package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.model.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GrupoRespository extends JpaRepository<Grupo, Long> {
    Optional<Grupo> findByNombre(String codigo);
}
