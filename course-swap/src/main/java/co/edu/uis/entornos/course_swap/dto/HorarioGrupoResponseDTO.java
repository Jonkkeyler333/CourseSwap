package co.edu.uis.entornos.course_swap.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class HorarioGrupoResponseDTO {
    @Schema(description = "Identificador del grupo", example = "5")
    private Long grupoId;

    @Schema(description = "Día de la semana", example = "Lunes")
    private String dia;

    @Schema(description = "Hora de inicio del horario", example = "08:00")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaInicio;

    @Schema(description = "Hora de finalización del horario", example = "10:00")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaFin;
}
