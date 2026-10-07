package co.edu.uis.entornos.course_swap.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateMatriculaRequestDTO {
    @NotNull(message = "El id del grupo no puede estar vacío")
    private Long grupoId;
}
