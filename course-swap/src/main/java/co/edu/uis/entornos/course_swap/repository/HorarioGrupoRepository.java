package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.dto.HorarioResponseDTO;
import co.edu.uis.entornos.course_swap.dto.HorarioGrupoResponseDTO;
import co.edu.uis.entornos.course_swap.model.HorarioGrupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HorarioGrupoRepository extends JpaRepository<HorarioGrupo, Long> {

    @Query("SELECT new co.edu.uis.entornos.course_swap.dto.HorarioResponseDTO(" +
            "m.nombre, m.codigo, g.nombre, g.profesor, hg.dia, " +
            "hg.horaInicio, hg.horaFin, g.id, m.id) " +
            "FROM HorarioGrupo hg " +
            "JOIN hg.grupo g " +
            "JOIN g.materia m " +
            "WHERE g.id = :grupoId " +
            "ORDER BY hg.dia, hg.horaInicio")
    List<HorarioResponseDTO> findHorariosByGrupoId(@Param("grupoId") Long grupoId);

    List<HorarioGrupo> findByGrupoIdOrderByDiaAscHoraInicioAsc(Long grupoId);

    @Query("SELECT new co.edu.uis.entornos.course_swap.dto.HorarioGrupoResponseDTO(" +
            "hg.grupo.id, hg.dia, hg.horaInicio, hg.horaFin) " +
            "FROM HorarioGrupo hg " +
            "WHERE hg.grupo.id IN (" +
            "SELECT m.grupo.id FROM Matricula m WHERE m.estudiante.id = :estudianteId) " +
            "ORDER BY hg.grupo.id, hg.dia, hg.horaInicio")
    List<HorarioGrupoResponseDTO> findHorariosByEstudianteId(@Param("estudianteId") Long estudianteId);
}
