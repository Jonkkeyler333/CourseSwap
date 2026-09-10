package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SolicitudRequestDTO {

    @Schema(description = "Código del estudiante", example = "2221010")
    @NotBlank
    @Size(min = 7, max = 7, message = "El código del estudiante debe tener 7 caracteres")
    private String codigo;

    @Schema(description = "Grupo actual del estudiante", example = "1")
    @NotBlank
    private Long grupoActualId;

    @Schema(description = "Grupo al que el estudiante desea cambiarse", example = "2")
    @NotBlank
    private Long grupoNuevoId;

    @Schema(description = "codigo de la materia", example = "224591")
    @Size(min = 6, max = 6, message = "El código de la materia debe tener 6 caracteres")
    @NotBlank
    private String materiaId;
}
