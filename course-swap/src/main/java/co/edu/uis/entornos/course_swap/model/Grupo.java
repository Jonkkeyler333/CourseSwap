package co.edu.uis.entornos.course_swap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "grupo")
public class Grupo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "materia_id", nullable = false, referencedColumnName = "id")
    private Materia materia;

    @Column(length = 2, nullable = false)
    private String nombre;

    @Column(length = 100, nullable = false)
    private String profesor;

}
