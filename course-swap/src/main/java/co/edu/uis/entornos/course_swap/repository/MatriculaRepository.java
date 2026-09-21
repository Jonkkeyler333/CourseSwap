package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.model.Estudiante;
import co.edu.uis.entornos.course_swap.model.Materia;
import co.edu.uis.entornos.course_swap.model.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {
    Optional<Matricula> findByEstudianteAndMateria(Estudiante estudiante, Materia materia);
    Optional<List<Matricula>> findByEstudianteId(Long estudianteId);

    boolean existsByIdAndMateriaId(Long matriculaId, Long materiaId);

    @Query("SELECT CASE WHEN (COUNT(m) > 0) THEN true ELSE false END " +
            "FROM Matricula m " +
            " WHERE m.estudiante.codigo = :estudianteCodigo " +
            "   AND m.materia.id = :materiaId")
    boolean existsByEstudianteCodigoAndMateriaId(String estudianteCodigo, Long materiaId);

    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END " +
            "FROM Matricula m " +
            " JOIN HorarioGrupo hgMatriculado ON hgMatriculado.grupo = m.grupo " +
            " JOIN HorarioGrupo hgDeseado ON hgDeseado.grupo.id = :grupoDeseadoId " +
            " WHERE m.estudiante.codigo = :estudianteCodigo " +
            "   AND m.materia.id <> :materiaIdCambio " +
            "   AND hgDeseado.dia = hgMatriculado.dia " +
            "   AND hgDeseado.horaInicio < hgMatriculado.horaFin " +
            "   AND hgDeseado.horaFin > hgMatriculado.horaInicio"
    )
    boolean existsHorarioInterference(@Param("estudianteCodigo") String estudianteCodigo, @Param("materiaIdCambio") Long materiaIdCambio, @Param("grupoDeseadoId") Long grupoDeseadoId);
}