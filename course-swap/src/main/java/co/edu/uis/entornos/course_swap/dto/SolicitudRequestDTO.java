package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotNull
    private Long grupoActualId;

    @Schema(description = "Grupo al que el estudiante desea cambiarse", example = "2")
    @NotNull
    private Long grupoNuevoId;

    @Schema(description = "id de la materia", example = "1")
    @NotNull
    private Long materiaId;
}
