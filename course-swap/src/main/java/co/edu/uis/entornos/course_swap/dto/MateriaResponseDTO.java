package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class MateriaResponseDTO {
    @Schema(description = "Identificador de la materia", example = "10")
    private Long id;
    @Schema(description = "Código de la materia", example = "22948")
    private String codigo;
    @Schema(description = "Nombre de la materia", example = "Fundamentos de Programación")
    private String nombre;
}
