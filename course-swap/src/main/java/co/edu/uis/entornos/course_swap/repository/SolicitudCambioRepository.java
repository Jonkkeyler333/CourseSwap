package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.model.Materia;
import co.edu.uis.entornos.course_swap.model.SolicitudCambio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SolicitudCambioRepository extends JpaRepository<SolicitudCambio, Long> {
    Optional<List<SolicitudCambio>> findByEstado(String estado);
    Optional<List<SolicitudCambio>> findByMateria(Materia materia);
}
