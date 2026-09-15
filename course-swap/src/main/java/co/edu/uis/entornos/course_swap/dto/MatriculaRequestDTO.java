package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MatriculaRequestDTO {
    @Schema(description = "Id de la materia", example = "10", required = true)
    @NotNull(message = "El id de la materia no puede estar vacío")
    private Long materiaId;
    @Schema(description = "Id del grupo", example = "5", required = true)
    @NotNull(message = "El id del grupo no puede estar vacío")
    private Long grupoId;
    @Schema(description = "Id del estudiante", example = "3", required = true)
    @NotNull(message = "El id del estudiante no puede estar vacío")
    private Long estudianteId;
}
