package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@Builder
@AllArgsConstructor
public class HorarioGrupoResponseDTO {
    @Schema(description = "Identificador del grupo", example = "5")
    private Long grupoId;
    @Schema(description = "Día de la semana", example = "Lunes")
    private String dia;
    @Schema(description = "Hora de inicio", example = "08:00")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaInicio;
    @Schema(description = "Hora de finalización", example = "10:00")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaFin;
}
