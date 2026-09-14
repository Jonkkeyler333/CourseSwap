package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class HorarioResponseDTO {
    @Schema(description = "Nombre de la materia", example = "Fundamentos de Programación")
    private String materia;
    @Schema(description = "Código de la materia", example = "22948")
    private String codigo;
    @Schema(description = "Nombre del grupo", example = "B1")
    private String grupo;
    @Schema(description = "Nombre del profesor", example = "Carlos")
    private String profesor;
    @Schema(description = "Día de la semana", example = "Lunes")
    private String dia;
    @Schema(description = "Hora de inicio del horario", example = "08:00")
    private LocalTime horaInicio;
    @Schema(description = "Hora de finalización del horario", example = "10:00")
    private LocalTime horaFin;
}
