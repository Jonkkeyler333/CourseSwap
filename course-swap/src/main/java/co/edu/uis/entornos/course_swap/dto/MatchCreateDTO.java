package co.edu.uis.entornos.course_swap.dto;

import co.edu.uis.entornos.course_swap.model.MatchEstados;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchCreateDTO {

    @Schema(description = "ID del match propuesto", example = "1")
    private Long matchId;
    @Schema(description = "ID de la solicitud A", example = "1")
    private Long solicitudAId;
    @Schema(description = "ID de la solicitud B", example = "1")
    private Long solicitudBId;
    @Schema(description = "Estado del match", example = "ACTIVO")
    private MatchEstados estado;
    @Schema(description = "Código de materia", example = "22098")
    private String codigoMateria;
    @Schema(description = "Indica si la solicitud A ha confirmado el match", example = "true")
    private boolean confirmadoPorA;
    @Schema(description = "Indica si la solicitud B ha confirmado el match", example = "true")
    private boolean confirmadoPorB;
}
