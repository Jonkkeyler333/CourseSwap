package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.model.Estudiante;
import co.edu.uis.entornos.course_swap.model.Materia;
import co.edu.uis.entornos.course_swap.model.SolicitudCambio;
import co.edu.uis.entornos.course_swap.model.SolicitudEstados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

public interface SolicitudCambioRepository extends JpaRepository<SolicitudCambio, Long> {
    Optional<List<SolicitudCambio>> findByEstado(String estado);
    Optional<List<SolicitudCambio>> findByMateria(Materia materia);
    Optional<List<SolicitudCambio>> findByEstudiante(Estudiante estudiante);
        List<SolicitudCambio> findByEstudianteAndMateriaAndEstadoIn(
            Estudiante estudiante,
            Materia materia,
            List<SolicitudEstados> estados
        );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT sc2 FROM SolicitudCambio sc1 " +
            "JOIN SolicitudCambio sc2 ON sc1.materia = sc2.materia " +
            "WHERE sc1.id = :solicitudId" +
            " AND sc1.estado = 'PROPUESTA' "+
            " AND sc2.estado = 'PROPUESTA' " +
            " AND sc1.id <> sc2.id" +
            " AND sc1.estudiante <> sc2.estudiante" +
            " AND sc1.grupoActual = sc2.grupoDeseado" +
            " AND sc1.grupoDeseado = sc2.grupoActual"
    )
    Optional<SolicitudCambio> findMatch(Long solicitudId);

}
