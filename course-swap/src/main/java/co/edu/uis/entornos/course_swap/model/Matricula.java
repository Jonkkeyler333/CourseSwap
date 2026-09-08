package co.edu.uis.entornos.course_swap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "matricula", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"estudiante_id", "materia_id"})
})
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false, referencedColumnName = "id")
    private Estudiante estudiante;

    @ManyToOne
    @JoinColumn(name = "grupo_id", nullable = false, referencedColumnName = "id")
    private Grupo grupo;

    @ManyToOne
    @JoinColumn(name = "materia_id", nullable = false, referencedColumnName = "id")
    private Materia materia;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;
}