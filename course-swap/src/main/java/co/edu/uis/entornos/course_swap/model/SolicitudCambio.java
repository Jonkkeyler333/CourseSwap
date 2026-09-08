package co.edu.uis.entornos.course_swap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitud_cambio", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"estudiante_id", "materia_id"})
})
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudCambio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "estado")
    @Enumerated(EnumType.STRING)
    private SolicitudEstados estado;

    @ManyToOne
    @JoinColumn(name = "grupo_deseado_id", nullable = false)
    private Grupo grupoDeseado;

    @ManyToOne
    @JoinColumn(name = "grupo_actual_id", nullable = false)
    private Grupo grupoActual;

    @ManyToOne
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @ManyToOne
    @JoinColumn(name = "materia_id", nullable = false)
    private Materia materia;

    @Column(name = "fecha_solicitud", nullable = false)
    private LocalDateTime fechaSolicitud;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
}
