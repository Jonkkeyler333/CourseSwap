package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
    Optional<Estudiante> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Estudiante> findByCodigo(String codigo);
}
