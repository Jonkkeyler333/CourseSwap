package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.model.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {
    Optional<List<Matricula>> findByEstudianteId(Long estudianteId);
    boolean existsByIdAndMateriaId(Long matriculaId, Long materiaId);
}