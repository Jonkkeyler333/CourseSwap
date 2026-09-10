package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.model.Materia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MateriaRepository extends JpaRepository<Materia, Long> {
    Optional<Materia> findByCodigo(String codigo);
}
