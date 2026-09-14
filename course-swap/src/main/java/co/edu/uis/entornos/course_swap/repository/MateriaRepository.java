package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.dto.HorarioResponseDTO;
import co.edu.uis.entornos.course_swap.model.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MateriaRepository extends JpaRepository<Materia, Long> {
    Optional<Materia> findByCodigo(String codigo);
    List<Materia> findByNombreContainingIgnoreCase(String nombre);

    @Query("SELECT new co.edu.uis.entornos.course_swap.dto.HorarioResponseDTO( m.nombre, m.codigo, g.nombre, g.profesor, h.dia, h.horaInicio, h.horaFin)" +
            " FROM Grupo g" +
            " JOIN g.materia m" +
            " JOIN HorarioGrupo h ON h.grupo = g" +
            " WHERE m.codigo = :codigo"
    )
    List<HorarioResponseDTO> findMateriaWithGruposAndHorarios(@Param("codigo") String codigo);
}
