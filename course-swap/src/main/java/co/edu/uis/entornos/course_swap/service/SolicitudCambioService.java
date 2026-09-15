package co.edu.uis.entornos.course_swap.service;

import co.edu.uis.entornos.course_swap.dto.SolicitudRequestDTO;
import co.edu.uis.entornos.course_swap.dto.SolicitudResponseDTO;
import co.edu.uis.entornos.course_swap.exception.ResourceNotFoundException;
import co.edu.uis.entornos.course_swap.model.SolicitudEstados;
import co.edu.uis.entornos.course_swap.model.*;
import co.edu.uis.entornos.course_swap.repository.EstudianteRepository;
import co.edu.uis.entornos.course_swap.repository.GrupoRespository;
import co.edu.uis.entornos.course_swap.repository.MatriculaRepository;
import co.edu.uis.entornos.course_swap.repository.SolicitudCambioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.module.ResolutionException;
import java.util.Optional;

@Service
public class SolicitudCambioService {

    private final SolicitudCambioRepository solicitudCambioRepository;
    private final MatriculaRepository matriculaRepository;
    private final EstudianteRepository estudianteRepository;
    private final GrupoRespository grupoRespository;

    public SolicitudCambioService(SolicitudCambioRepository solicitudCambioRepository, MatriculaRepository matriculaRepository, EstudianteRepository estudianteRepository, GrupoRespository grupoRespository) {
        this.solicitudCambioRepository = solicitudCambioRepository;
        this.matriculaRepository = matriculaRepository;
        this.estudianteRepository = estudianteRepository;
        this.grupoRespository = grupoRespository;
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
        solicitudCambio = solicitudCambioRepository.save(solicitudCambio);
        return mapper(solicitudCambio);
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
