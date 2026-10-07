package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class MatriculaDetalleResponseDTO {
    @Schema(description = "Id de la matrícula", example = "20")
    private Long id;
    @Schema(description = "Id del estudiante", example = "3")
    private Long estudianteId;
    @Schema(description = "Id de la materia", example = "10")
    private Long materiaId;
    @Schema(description = "Código de la materia", example = "22948")
    private String materiaCodigo;
    @Schema(description = "Nombre de la materia", example = "Fundamentos de Programación")
    private String materiaNombre;
    @Schema(description = "Id del grupo", example = "5")
    private Long grupoId;
    @Schema(description = "Nombre del grupo", example = "B1")
    private String grupoNombre;
    @Schema(description = "Profesor del grupo", example = "Carlos")
    private String grupoProfesor;
    @Schema(description = "Fecha de registro de la matrícula")
    private LocalDateTime fechaRegistro;
    @Schema(description = "Horarios del grupo")
    private List<HorarioGrupoResponseDTO> horarios;
}
