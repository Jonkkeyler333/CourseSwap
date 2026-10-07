package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.dto.HorarioResponseDTO;
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
}
