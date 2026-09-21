package co.edu.uis.entornos.course_swap.service;

import co.edu.uis.entornos.course_swap.dto.SolicitudRequestDTO;
import co.edu.uis.entornos.course_swap.dto.SolicitudResponseDTO;
import co.edu.uis.entornos.course_swap.dto.UpdateSolicitudRequestDTO;
import co.edu.uis.entornos.course_swap.exception.ResourceNotFoundException;
import co.edu.uis.entornos.course_swap.model.SolicitudEstados;
import co.edu.uis.entornos.course_swap.model.*;
import co.edu.uis.entornos.course_swap.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SolicitudCambioService {

    private final SolicitudCambioRepository solicitudCambioRepository;
    private final MatriculaRepository matriculaRepository;
    private final EstudianteRepository estudianteRepository;
    private final GrupoRespository grupoRespository;
    private final MateriaRepository materiaRepository;
    private final MatchRepository matchRepository;

    public SolicitudCambioService(SolicitudCambioRepository solicitudCambioRepository,
                                  MatriculaRepository matriculaRepository,
                                  EstudianteRepository estudianteRepository,
                                  GrupoRespository grupoRespository,
                                  MateriaRepository materiaRepository,
                                  MatchRepository matchRepository) {
        this.solicitudCambioRepository = solicitudCambioRepository;
        this.matriculaRepository = matriculaRepository;
        this.estudianteRepository = estudianteRepository;
        this.grupoRespository = grupoRespository;
        this.materiaRepository = materiaRepository;
        this.matchRepository = matchRepository;
    }

    @Transactional
    public SolicitudResponseDTO crearSolicitudCambio(SolicitudRequestDTO solicitud) {
        boolean existsMatricula = matriculaRepository.existsByEstudianteCodigoAndMateriaId(solicitud.getCodigo(), solicitud.getMateriaId());
        if (!existsMatricula) {
            throw new IllegalArgumentException("El estudiante no está matriculado en la materia indicada");
        }
        boolean existsInterference = matriculaRepository.existsHorarioInterference(solicitud.getCodigo(), solicitud.getMateriaId(), solicitud.getGrupoNuevoId());
        if (existsInterference) {
            throw new IllegalArgumentException("El grupo deseado tiene un horario que interfiere con la matrícula actual del estudiante");
        }
        Estudiante estudiante = estudianteRepository.findByCodigo(solicitud.getCodigo())
                .orElseThrow(() -> new ResourceNotFoundException("No existe un estudiante con código: " + solicitud.getCodigo()));
        Grupo grupoActual = grupoRespository.findById(solicitud.getGrupoActualId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe un grupo con id: " + solicitud.getGrupoActualId()));
        Grupo grupoDeseado = grupoRespository.findById(solicitud.getGrupoNuevoId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe un grupo con id: " + solicitud.getGrupoNuevoId()));
        Materia materia = grupoActual.getMateria();
        SolicitudCambio solicitudCambio = new SolicitudCambio();
        solicitudCambio.setEstudiante(estudiante);
        solicitudCambio.setMateria(materia);
        solicitudCambio.setGrupoActual(grupoActual);
        solicitudCambio.setGrupoDeseado(grupoDeseado);
        solicitudCambio.setEstado(SolicitudEstados.PROPUESTA);
        solicitudCambio = solicitudCambioRepository.saveAndFlush(solicitudCambio);
        Optional<SolicitudCambio> matchOpt = solicitudCambioRepository.findMatch(solicitudCambio.getId());
        if (matchOpt.isPresent()) {
            SolicitudCambio solicitudMatch = matchOpt.get();

            solicitudCambio.setEstado(SolicitudEstados.MATCHED);
            solicitudMatch.setEstado(SolicitudEstados.MATCHED);
            solicitudMatch.setFechaActualizacion(LocalDateTime.now());
            solicitudCambio.setFechaActualizacion(LocalDateTime.now());
            solicitudCambioRepository.save(solicitudCambio);
            solicitudCambioRepository.save(solicitudMatch);

            MatchPropuesto newMatch = new MatchPropuesto();

            newMatch.setSolicitudCambioA(solicitudCambio);
            newMatch.setSolicitudCambioB(solicitudMatch);
            newMatch.setEstado(MatchEstados.ACTIVO);
            matchRepository.save(newMatch);
        }
        return mapper(solicitudCambio);
    }

    public List<SolicitudResponseDTO> getSolicitudesByMateria(String codigoMateria) {
        Materia materia = materiaRepository.findByCodigo(codigoMateria)
                .orElseThrow(() -> new ResourceNotFoundException("No existe una materia con código: " + codigoMateria));
        List<SolicitudCambio> solicitudes = solicitudCambioRepository.findByMateria(materia)
                .orElseThrow(() -> new ResourceNotFoundException("No existen solicitudes para la materia con código: " + codigoMateria));
        return solicitudes.stream().map(this::mapper).toList();
    }

    public List<SolicitudResponseDTO> getSolicitudesByEstudiante(Long idEstudiante) {
        Estudiante estudiante = estudianteRepository.findById(idEstudiante)
                .orElseThrow(() -> new ResourceNotFoundException("No existe un estudiante con código: " + idEstudiante));
        List<SolicitudCambio> solicitudes = solicitudCambioRepository.findByEstudiante(estudiante)
                .orElseThrow(() -> new ResourceNotFoundException("No existen solicitudes para el estudiante con código: " + idEstudiante));
        return solicitudes.stream().map(this::mapper).toList();
    }

    public boolean deleteSolicitudCambio(Long idSolicitud) {
        SolicitudCambio solicitud = solicitudCambioRepository.findById(idSolicitud)
                .orElseThrow(() -> new ResourceNotFoundException("No existe una solicitud con id: " + idSolicitud));
        solicitudCambioRepository.delete(solicitud);
        return true;
    }

    public SolicitudResponseDTO updateSolicitudCambio(UpdateSolicitudRequestDTO newSolicitud) {
        SolicitudCambio solicitud = solicitudCambioRepository.findById(newSolicitud.getSolicitudId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe una solicitud con id: " + newSolicitud.getSolicitudId()));
        Grupo newGrupo = grupoRespository.findById(newSolicitud.getNuevoGrupoId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe un grupo con id: " + newSolicitud.getNuevoGrupoId()));
        solicitud.setGrupoDeseado(newGrupo);
        solicitud.setFechaActualizacion(LocalDateTime.now());
        solicitud.setEstado(SolicitudEstados.PROPUESTA);
        solicitud = solicitudCambioRepository.save(solicitud);
        return mapper(solicitud);
    }

    public List<SolicitudResponseDTO> getAllSolicitudes() {
        List<SolicitudCambio> solicitudes = solicitudCambioRepository.findAll();
        return solicitudes.stream().map(this::mapper).toList();
    }

    public Optional<SolicitudResponseDTO> getSolicitudById(Long idSolicitud) {
        Optional<SolicitudCambio> solicitud = solicitudCambioRepository.findById(idSolicitud);
        return solicitud.map(this::mapper);
    }

    private SolicitudResponseDTO mapper(SolicitudCambio solicitudCambio) {
        return new SolicitudResponseDTO(
                solicitudCambio.getId(),
                solicitudCambio.getEstado(),
                solicitudCambio.getGrupoDeseado().getId().toString(),
                solicitudCambio.getGrupoActual().getId().toString(),
                solicitudCambio.getFechaSolicitud().toString(),
                solicitudCambio.getEstudiante().getId(),
                solicitudCambio.getMateria().getCodigo(),
                solicitudCambio.getMateria().getNombre(),
                solicitudCambio.getGrupoActual().getNombre(),
                solicitudCambio.getGrupoDeseado().getNombre()
        );
    }
}
