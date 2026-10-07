package co.edu.uis.entornos.course_swap.dto;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
=======
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@Builder
>>>>>>> 7621925178baf3fce8ca0372ef6c600f576b1ed5
@AllArgsConstructor
public class HorarioGrupoResponseDTO {
    @Schema(description = "Identificador del grupo", example = "5")
    private Long grupoId;
<<<<<<< HEAD

    @Schema(description = "Día de la semana", example = "Lunes")
    private String dia;

    @Schema(description = "Hora de inicio del horario", example = "08:00")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaInicio;

    @Schema(description = "Hora de finalización del horario", example = "10:00")
=======
    @Schema(description = "Día de la semana", example = "Lunes")
    private String dia;
    @Schema(description = "Hora de inicio", example = "08:00")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaInicio;
    @Schema(description = "Hora de finalización", example = "10:00")
>>>>>>> 7621925178baf3fce8ca0372ef6c600f576b1ed5
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaFin;
}
