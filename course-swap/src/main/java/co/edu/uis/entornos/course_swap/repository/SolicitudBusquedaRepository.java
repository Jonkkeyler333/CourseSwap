package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.model.SolicitudCambio;
import co.edu.uis.entornos.course_swap.model.SolicitudEstados;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SolicitudBusquedaRepository
        extends Repository<SolicitudCambio, Long> {

    @Query("SELECT DISTINCT sc " +
           "FROM SolicitudCambio sc, Matricula m " +
           "WHERE m.estudiante.id = :estudianteId " +
           "AND m.materia = sc.materia " +
           "AND sc.estado = :estado " +
           "AND sc.estudiante.id <> :estudianteId " +
           "AND sc.grupoDeseado = m.grupo " +
           "ORDER BY sc.fechaSolicitud DESC")
    List<SolicitudCambio> findSolicitudesCompatiblesByEstudianteId(
            @Param("estudianteId") Long estudianteId,
            @Param("estado") SolicitudEstados estado
    );
}