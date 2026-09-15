package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class MatriculaResponseDTO {
    @Schema(description = "Id de la matrícula", example = "20")
    private Long id;
    @Schema(description = "Id del estudiante", example = "3")
    private Long estudianteId;
    @Schema(description = "Código del estudiante", example = "2212334")
    private String estudianteCodigo;
    @Schema(description = "Nombre completo del estudiante", example = "Juan Pérez")
    private String estudianteNombre;
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
}
