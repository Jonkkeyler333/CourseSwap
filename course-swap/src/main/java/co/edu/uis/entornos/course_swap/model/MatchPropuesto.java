package co.edu.uis.entornos.course_swap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

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
    @ColumnDefault("'ACTIVO'")
    @Column(name = "estado", nullable = false, length = 20)
    private MatchEstados estado;

    @Column(name = "fecha_creacion", nullable = false)
    @CreationTimestamp
    private LocalDate fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDate fechaActualizacion;

    @Column(name = "confirmado_por_a", nullable = false)
    @ColumnDefault("false")
    private boolean confirmadoPorA;

    @Column(name = "confirmado_por_b", nullable = false)
    @ColumnDefault("false")
    private boolean confirmadoPorB;

}
