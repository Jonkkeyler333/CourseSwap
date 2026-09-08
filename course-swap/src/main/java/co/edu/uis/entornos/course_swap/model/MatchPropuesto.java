package co.edu.uis.entornos.course_swap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "match_propuesto")
public class MatchPropuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "solicitud_a_id", nullable = false, referencedColumnName = "id")
    private SolicitudCambio solicitudCambioA;

    @ManyToOne
    @JoinColumn(name = "solicitud_b_id", nullable = false, referencedColumnName = "id")
    private SolicitudCambio solicitudCambioB;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private MatchEstados estado;
}
