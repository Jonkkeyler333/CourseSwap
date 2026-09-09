package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class EstudianteResponseDTO {
    @Schema(description = "Identificador único del estudiante", example = "1")
    private Long id;
    @Schema(description = "Nombre del estudiante", example = "Juan")
    private String nombre;
    @Schema(description = "Apellido del estudiante", example = "Pérez")
    private String apellido;
    @Schema(description = "Correo institucional del estudiante", example = "estudiante@uis.edu.co")
    private String email;
    @Schema(description = "Código del estudiante", example = "1234567")
    private String codigo;
}
