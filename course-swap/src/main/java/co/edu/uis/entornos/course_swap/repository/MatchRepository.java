package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.model.MatchPropuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<MatchPropuesto, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<MatchPropuesto> findWithLockById(Long id);
}
