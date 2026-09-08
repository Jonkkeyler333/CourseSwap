package co.edu.uis.entornos.course_swap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class EstudianteResponseDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String codigo;
}
