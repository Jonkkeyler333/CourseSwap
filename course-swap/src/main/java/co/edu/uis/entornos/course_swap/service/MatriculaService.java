package co.edu.uis.entornos.course_swap.service;

import co.edu.uis.entornos.course_swap.dto.MatriculaRequestDTO;
import co.edu.uis.entornos.course_swap.dto.MatriculaResponseDTO;
import co.edu.uis.entornos.course_swap.exception.ResourceNotFoundException;
import co.edu.uis.entornos.course_swap.model.Matricula;
import co.edu.uis.entornos.course_swap.repository.EstudianteRepository;
import co.edu.uis.entornos.course_swap.repository.GrupoRespository;
import co.edu.uis.entornos.course_swap.repository.MateriaRepository;
import co.edu.uis.entornos.course_swap.repository.MatriculaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final MateriaRepository materiaRepository;
    private final EstudianteRepository estudianteRepository;
    private final GrupoRespository grupoRespository;

    public MatriculaService(MatriculaRepository matriculaRepository, MateriaRepository materiaRepository, EstudianteRepository estudianteRepository, GrupoRespository grupoRespository) {
        this.matriculaRepository = matriculaRepository;
        this.materiaRepository = materiaRepository;
        this.estudianteRepository = estudianteRepository;
        this.grupoRespository = grupoRespository;
    }

    @Transactional
    public MatriculaResponseDTO crearMatricula(MatriculaRequestDTO matriculaRequestDTO) {
        var estudiante = estudianteRepository.findById(matriculaRequestDTO.getEstudianteId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe un estudiante con id: " + matriculaRequestDTO.getEstudianteId()));
        var materia = materiaRepository.findById(matriculaRequestDTO.getMateriaId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe una materia con id: " + matriculaRequestDTO.getMateriaId()));
        var grupo = grupoRespository.findById(matriculaRequestDTO.getGrupoId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe un grupo con id: " + matriculaRequestDTO.getGrupoId()));

        if (!grupo.getMateria().getId().equals(materia.getId())) {
            throw new IllegalArgumentException("El grupo seleccionado no pertenece a la materia indicada");
        }

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

    public MatriculaResponseDTO getMatriculaById(Long id) {
        var matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe una matrícula con id: " + id));
        return mapper(matricula);
    }

    public List<MatriculaResponseDTO> getMatriculasByEstudianteId(Long estudianteId) {
        if (!estudianteRepository.existsById(estudianteId)) {
            throw new ResourceNotFoundException("No existe un estudiante con id: " + estudianteId);
        }
        var matriculas = matriculaRepository.findByEstudianteId(estudianteId)
                .orElseThrow(() -> new ResourceNotFoundException("No existen matrículas para el estudiante con id: " + estudianteId));
        return matriculas.stream().map(matricula -> mapper(matricula)).toList();
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
        if (matriculaRepository.existsByIdAndMateriaId(estudianteId, materiaId)) {
            throw new IllegalArgumentException("El estudiante ya está matriculado en esta materia.");
        }
    }

}
