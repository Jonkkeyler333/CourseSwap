package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateMatriculaRequestDTO {
    @Schema(description = "Id del nuevo grupo", example = "5", required = true)
    @NotNull(message = "El id del grupo no puede estar vacío")
    private Long grupoId;
}
