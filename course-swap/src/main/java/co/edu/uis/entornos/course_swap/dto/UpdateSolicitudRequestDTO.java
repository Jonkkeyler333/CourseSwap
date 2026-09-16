package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateSolicitudRequestDTO {
    @Schema(description = "Id de la solicitud a actualizar", example = "1")
    @NotNull
    private Long solicitudId;
    @Schema(description = "Id del nuevo grupo al que se desea cambiar", example = "2")
    @NotNull
    private Long nuevoGrupoId;
}
