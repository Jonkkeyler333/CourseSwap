package co.edu.uis.entornos.course_swap.service;

import co.edu.uis.entornos.course_swap.dto.MatriculaRequestDTO;
import co.edu.uis.entornos.course_swap.dto.UpdateMatriculaRequestDTO;
import co.edu.uis.entornos.course_swap.dto.HorarioGrupoResponseDTO;
import co.edu.uis.entornos.course_swap.dto.MatriculaDetalleResponseDTO;
import co.edu.uis.entornos.course_swap.dto.MatriculaResponseDTO;
import co.edu.uis.entornos.course_swap.exception.DuplicateMatriculaException;
import co.edu.uis.entornos.course_swap.exception.ResourceNotFoundException;
import co.edu.uis.entornos.course_swap.exception.ScheduleConflictException;
import co.edu.uis.entornos.course_swap.model.Matricula;
import co.edu.uis.entornos.course_swap.repository.EstudianteRepository;
import co.edu.uis.entornos.course_swap.repository.GrupoRespository;
import co.edu.uis.entornos.course_swap.repository.HorarioGrupoRepository;
import co.edu.uis.entornos.course_swap.repository.MateriaRepository;
import co.edu.uis.entornos.course_swap.repository.MatriculaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final MateriaRepository materiaRepository;
    private final EstudianteRepository estudianteRepository;
    private final GrupoRespository grupoRespository;
    private final HorarioGrupoRepository horarioGrupoRepository;

    public MatriculaService(MatriculaRepository matriculaRepository, MateriaRepository materiaRepository, EstudianteRepository estudianteRepository, GrupoRespository grupoRespository, HorarioGrupoRepository horarioGrupoRepository) {
        this.matriculaRepository = matriculaRepository;
        this.materiaRepository = materiaRepository;
        this.estudianteRepository = estudianteRepository;
        this.grupoRespository = grupoRespository;
        this.horarioGrupoRepository = horarioGrupoRepository;
    }

    @Transactional
    public MatriculaResponseDTO crearMatricula(MatriculaRequestDTO matriculaRequestDTO) {
        var estudiante = estudianteRepository.findById(matriculaRequestDTO.getEstudianteId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe un estudiante con id: " + matriculaRequestDTO.getEstudianteId()));
        isMatriculaExists(matriculaRequestDTO.getEstudianteId(), matriculaRequestDTO.getMateriaId());
        var materia = materiaRepository.findById(matriculaRequestDTO.getMateriaId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe una materia con id: " + matriculaRequestDTO.getMateriaId()));
        var grupo = grupoRespository.findById(matriculaRequestDTO.getGrupoId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe un grupo con id: " + matriculaRequestDTO.getGrupoId()));

        if (!grupo.getMateria().getId().equals(materia.getId())) {
            throw new IllegalArgumentException("El grupo seleccionado no pertenece a la materia indicada");
        }
        validateScheduleConflict(estudiante.getId(), grupo.getId(), null);

        var matricula = new Matricula();
        matricula.setEstudiante(estudiante);
        matricula.setMateria(materia);
        matricula.setGrupo(grupo);
        var savedMatricula = matriculaRepository.save(matricula);
        return MatriculaResponseDTO.builder()
                .id(savedMatricula.getId())
                .estudianteId(estudiante.getId())
                .estudianteCodigo(estudiante.getCodigo())
                .estudianteNombre(estudiante.getNombre() + " " + estudiante.getApellido())
                .materiaId(materia.getId())
                .materiaCodigo(materia.getCodigo())
                .materiaNombre(materia.getNombre())
                .grupoId(grupo.getId())
                .grupoNombre(grupo.getNombre())
                .grupoProfesor(grupo.getProfesor())
                .fechaRegistro(savedMatricula.getFechaRegistro())
                .build();
    }

    @Transactional
    public MatriculaResponseDTO crearMatricula(MatriculaRequestDTO request, String authenticatedEmail) {
        var authenticatedStudent = estudianteRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No existe el estudiante autenticado"));
        if (!authenticatedStudent.getId().equals(request.getEstudianteId())) {
            throw new IllegalArgumentException("El estudiante de la matrícula no coincide con el usuario autenticado");
        }
        return crearMatricula(request);
    }

    @Transactional
    public MatriculaResponseDTO updateMatricula(Long matriculaId, UpdateMatriculaRequestDTO request,
                                                String authenticatedEmail) {
        var estudiante = estudianteRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No existe el estudiante autenticado"));
        var matricula = matriculaRepository.findById(matriculaId)
                .orElseThrow(() -> new ResourceNotFoundException("No existe una matrícula con id: " + matriculaId));
        ensureOwnership(matricula, estudiante.getId());

        var grupo = grupoRespository.findById(request.getGrupoId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe un grupo con id: " + request.getGrupoId()));
        if (!grupo.getMateria().getId().equals(matricula.getMateria().getId())) {
            throw new IllegalArgumentException("El grupo seleccionado no pertenece a la materia indicada");
        }
        validateScheduleConflict(estudiante.getId(), grupo.getId(), matricula.getId());
        matricula.setGrupo(grupo);
        return mapper(matriculaRepository.save(matricula));
    }

    @Transactional
    public void deleteMatricula(Long matriculaId, String authenticatedEmail) {
        var estudiante = estudianteRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No existe el estudiante autenticado"));
        var matricula = matriculaRepository.findById(matriculaId)
                .orElseThrow(() -> new ResourceNotFoundException("No existe una matrícula con id: " + matriculaId));
        ensureOwnership(matricula, estudiante.getId());
        matriculaRepository.delete(matricula);
    }

    private void ensureOwnership(Matricula matricula, Long estudianteId) {
        if (!matricula.getEstudiante().getId().equals(estudianteId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "No tiene permiso para modificar esta matrícula");
        }
    }

    private void validateScheduleConflict(Long estudianteId, Long grupoId, Long excludedMatriculaId) {
        var desiredSchedules = horarioGrupoRepository.findByGrupoIdOrderByDiaAscHoraInicioAsc(grupoId);
        var currentEnrollments = matriculaRepository.findByEstudianteId(estudianteId).orElse(List.of());
        boolean conflict = currentEnrollments.stream()
                .filter(matricula -> !Objects.equals(matricula.getId(), excludedMatriculaId))
                .flatMap(matricula -> horarioGrupoRepository
                        .findByGrupoIdOrderByDiaAscHoraInicioAsc(matricula.getGrupo().getId()).stream())
                .anyMatch(existing -> desiredSchedules.stream()
                        .anyMatch(desired -> schedulesOverlap(existing, desired)));
        if (conflict) {
            throw new ScheduleConflictException("El horario se cruza con otra materia matriculada.");
        }
    }

    private boolean schedulesOverlap(co.edu.uis.entornos.course_swap.model.HorarioGrupo first,
                                     co.edu.uis.entornos.course_swap.model.HorarioGrupo second) {
        return first.getDia().equalsIgnoreCase(second.getDia())
                && first.getHoraInicio().isBefore(second.getHoraFin())
                && second.getHoraInicio().isBefore(first.getHoraFin());
    }

    public MatriculaResponseDTO getMatriculaById(Long id, String authenticatedEmail) {
        var estudiante = estudianteRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No existe el estudiante autenticado"));
        var matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe una matrícula con id: " + id));
        ensureOwnership(matricula, estudiante.getId());
        return mapper(matricula);
    }

    public List<MatriculaResponseDTO> getMatriculasByEstudianteId(Long estudianteId) {
        if (!estudianteRepository.existsById(estudianteId)) {
            throw new ResourceNotFoundException("No existe un estudiante con id: " + estudianteId);
        }
        var matriculas = matriculaRepository.findByEstudianteId(estudianteId)
                .orElseThrow(() -> new ResourceNotFoundException("No existen matrículas para el estudiante con id: " + estudianteId));
        return matriculas.stream().map(this::mapper).toList();
    }

    public List<MatriculaDetalleResponseDTO> getMatriculasDetalleByEstudianteId(Long estudianteId) {
        if (!estudianteRepository.existsById(estudianteId)) {
            throw new ResourceNotFoundException("No existe un estudiante con id: " + estudianteId);
        }

        var matriculas = matriculaRepository.findByEstudianteId(estudianteId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No existen matrículas para el estudiante con id: " + estudianteId));
        Map<Long, List<HorarioGrupoResponseDTO>> horariosPorGrupo =
                horarioGrupoRepository.findHorariosByEstudianteId(estudianteId).stream()
                        .collect(Collectors.groupingBy(HorarioGrupoResponseDTO::getGrupoId));

        return matriculas.stream()
                .map(matricula -> MatriculaDetalleResponseDTO.builder()
                        .id(matricula.getId())
                        .estudianteId(matricula.getEstudiante().getId())
                        .materiaId(matricula.getMateria().getId())
                        .materiaCodigo(matricula.getMateria().getCodigo())
                        .materiaNombre(matricula.getMateria().getNombre())
                        .grupoId(matricula.getGrupo().getId())
                        .grupoNombre(matricula.getGrupo().getNombre())
                        .grupoProfesor(matricula.getGrupo().getProfesor())
                        .fechaRegistro(matricula.getFechaRegistro())
                        .horarios(horariosPorGrupo.getOrDefault(matricula.getGrupo().getId(), List.of()))
                        .build())
                .toList();
    }

    private MatriculaResponseDTO mapper(Matricula matricula) {
        return MatriculaResponseDTO.builder()
                .id(matricula.getId())
                .estudianteId(matricula.getEstudiante().getId())
                .estudianteCodigo(matricula.getEstudiante().getCodigo())
                .estudianteNombre(matricula.getEstudiante().getNombre() + " " + matricula.getEstudiante().getApellido())
                .materiaId(matricula.getMateria().getId())
                .materiaCodigo(matricula.getMateria().getCodigo())
                .materiaNombre(matricula.getMateria().getNombre())
                .grupoId(matricula.getGrupo().getId())
                .grupoNombre(matricula.getGrupo().getNombre())
                .grupoProfesor(matricula.getGrupo().getProfesor())
                .fechaRegistro(matricula.getFechaRegistro())
                .build();
    }

    public void isMatriculaExists(Long estudianteId, Long materiaId) throws IllegalArgumentException {
        if (matriculaRepository.existsByEstudianteIdAndMateriaId(estudianteId, materiaId)) {
            throw new DuplicateMatriculaException("El estudiante ya está matriculado en esta materia.");
        }
    }

}
