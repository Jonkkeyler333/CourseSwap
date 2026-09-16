package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.model.MatchPropuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MatchRepository extends JpaRepository<MatchPropuesto, Long> {

}
