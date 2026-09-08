package co.edu.uis.entornos.course_swap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cambio_ejecutado")
public class CambioEjecutado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false, referencedColumnName = "id")
    private MatchPropuesto match;

    @Column(name = "fecha_ejecucion", nullable = false)
    private String fechaEjecucion;
}
