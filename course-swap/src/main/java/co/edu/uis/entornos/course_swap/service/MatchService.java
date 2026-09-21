package co.edu.uis.entornos.course_swap.service;

import co.edu.uis.entornos.course_swap.dto.MatchCreateDTO;
import co.edu.uis.entornos.course_swap.dto.MatchResponseDTO;
import co.edu.uis.entornos.course_swap.exception.ResourceNotFoundException;
import co.edu.uis.entornos.course_swap.model.*;
import co.edu.uis.entornos.course_swap.repository.CambioEjecutadoRepository;
import co.edu.uis.entornos.course_swap.repository.MatchRepository;
import co.edu.uis.entornos.course_swap.repository.MatriculaRepository;
import co.edu.uis.entornos.course_swap.repository.SolicitudCambioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchService {
    private final MatchRepository matchRepository;
    private final MatriculaRepository matriculaRepository;
    private final SolicitudCambioRepository solicitudCambioRepository;
    private final CambioEjecutadoRepository cambioEjecutadoRepository;

    public MatchService(MatchRepository matchRepository, MatriculaRepository matriculaRepository, SolicitudCambioRepository solicitudCambioRepository, CambioEjecutadoRepository cambioEjecutadoRepository) {
        this.matchRepository = matchRepository;
        this.matriculaRepository = matriculaRepository;
        this.solicitudCambioRepository = solicitudCambioRepository;
        this.cambioEjecutadoRepository = cambioEjecutadoRepository;
    }

    @Transactional
    public MatchCreateDTO confirmMatch(Long matchId, Long estudianteConfirmId) {
        MatchPropuesto match = matchRepository.findWithLockById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró un match con id: " + matchId));

        if (!match.getEstado().equals(MatchEstados.ACTIVO)) {
            throw new IllegalStateException("El match no está activo y no puede ser confirmado");
        }

        SolicitudCambio solicitudA = match.getSolicitudCambioA();
        SolicitudCambio solicitudB = match.getSolicitudCambioB();

//        Estudiante estudianteConfirm = solicitudA.getEstudiante().getId().equals(estudianteConfirmId) ? solicitudA.getEstudiante() : solicitudB.getEstudiante();
        // se podria haber hecho con el operador ternario, pero lo hice en un caso (poco probable=) que el estudianteConfirmId no sea ninguno de los dos estudiantes
        boolean isEstudianteA = solicitudA.getEstudiante().getId().equals(estudianteConfirmId);
        boolean isEstudianteB = solicitudB.getEstudiante().getId().equals(estudianteConfirmId);


        if (isEstudianteA) {
            match.setConfirmadoPorA(true);
        } else if (isEstudianteB) {
            match.setConfirmadoPorB(true);
        } else {
            throw new IllegalArgumentException("El estudiante con id: " + estudianteConfirmId + " no está asociado a este match");
        }

        if (match.isConfirmadoPorA() && match.isConfirmadoPorB()) {
            exchangeGrupos(match, solicitudA, solicitudB);
            match.setEstado(MatchEstados.CONFIRMADO);
        }
        matchRepository.save(match);
        return new MatchCreateDTO(
                match.getId(),
                solicitudA.getId(),
                solicitudB.getId(),
                match.getEstado(),
                solicitudA.getMateria().getCodigo(),
                match.isConfirmadoPorA(),
                match.isConfirmadoPorB()
        );

    }

    private void exchangeGrupos(MatchPropuesto match, SolicitudCambio solicitudCambioA, SolicitudCambio solicitudCambioB) {
        Materia materia = solicitudCambioA.getMateria();
        Estudiante estudianteA = solicitudCambioA.getEstudiante();
        Estudiante estudianteB = solicitudCambioB.getEstudiante();

        Matricula matriculaA = matriculaRepository.findByEstudianteAndMateria(estudianteA, materia)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la matrícula del estudiante A en la materia: " + materia.getCodigo()));
        Matricula matriculaB = matriculaRepository.findByEstudianteAndMateria(estudianteB, materia)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la matrícula del estudiante B en la materia: " + materia.getCodigo()));

        Grupo grupoA = matriculaA.getGrupo();
        Grupo grupoB = matriculaB.getGrupo();

        var tempGrupo = grupoA;
        matriculaA.setGrupo(grupoB);
        matriculaB.setGrupo(tempGrupo);

        matriculaRepository.save(matriculaA);
        matriculaRepository.save(matriculaB);

        match.setEstado(MatchEstados.CONFIRMADO);
        matchRepository.save(match);

        CambioEjecutado cambioEjecutado = new CambioEjecutado();
        cambioEjecutado.setMatch(match);
        cambioEjecutadoRepository.save(cambioEjecutado);

        solicitudCambioA.setEstado(SolicitudEstados.CONFIRMADA);
        solicitudCambioB.setEstado(SolicitudEstados.CONFIRMADA);
        solicitudCambioRepository.save(solicitudCambioA);
        solicitudCambioRepository.save(solicitudCambioB);
    }

    public MatchResponseDTO getMatchById(Long matchId) {
        MatchPropuesto match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró un match con id: " + matchId));

        return new MatchResponseDTO(
                match.getId(),
                match.getSolicitudCambioA().getId(),
                match.getSolicitudCambioB().getId(),
                match.getEstado(),
                match.getSolicitudCambioA().getMateria().getCodigo(),
                match.isConfirmadoPorA(),
                match.isConfirmadoPorB(),
                match.getSolicitudCambioA().getMateria().getNombre(),
                match.getSolicitudCambioA().getGrupoDeseado().getNombre(),
                match.getSolicitudCambioB().getGrupoDeseado().getNombre(),
                match.getSolicitudCambioA().getEstudiante().getNombre() + " " + match.getSolicitudCambioA().getEstudiante().getApellido(),
                match.getSolicitudCambioB().getEstudiante().getNombre() + " " + match.getSolicitudCambioB().getEstudiante().getApellido()
        );
    }

    public List<MatchResponseDTO> getMatchesByEstudiante(Long estudianteId) {
        List<MatchPropuesto> allMatches = matchRepository.findAll();
        List<MatchResponseDTO> matches = allMatches.stream()
                .filter(match -> match.getSolicitudCambioA().getEstudiante().getId().equals(estudianteId) ||
                        match.getSolicitudCambioB().getEstudiante().getId().equals(estudianteId))
                .map(match -> MatchResponseDTO.builder()
                        .matchId(match.getId())
                        .solicitudAId(match.getSolicitudCambioA().getId())
                        .solicitudBId(match.getSolicitudCambioB().getId())
                        .estado(match.getEstado())
                        .codigoMateria(match.getSolicitudCambioA().getMateria().getCodigo())
                        .confirmadoPorA(match.isConfirmadoPorA())
                        .confirmadoPorB(match.isConfirmadoPorB())
                        .nombreMateria(match.getSolicitudCambioA().getMateria().getNombre())
                        .nombreGrupoA(match.getSolicitudCambioA().getGrupoDeseado().getNombre())
                        .nombreGrupoB(match.getSolicitudCambioB().getGrupoDeseado().getNombre())
                        .build())
                .toList();
        return matches;
    }


}
