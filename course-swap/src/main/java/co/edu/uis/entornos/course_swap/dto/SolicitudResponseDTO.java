package co.edu.uis.entornos.course_swap.dto;

import co.edu.uis.entornos.course_swap.model.SolicitudEstados;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SolicitudResponseDTO {

    @Schema(description = "Id de la solicitud", example = "1")
    private Long id;
    @Schema(description = "Estado de la solicitud", example = "PROPUESTA")
    private SolicitudEstados estado;
    @Schema(description = "Id del grupo deseado", example = "2")
    private String grupoDeseado;
    @Schema(description = "Id del grupo actual", example = "1")
    private String grupoActual;
    @Schema(description = "Fecha de la solicitud", example = "2023-01-01")
    private String fechaSolicitud;
    @Schema(description = "Id del estudiante", example = "2221010")
    private Long estudianteId;
    @Schema(description = "Código del estudiante", example = "22973")
    private String materiaCodigo;
    @Schema(description = "Nombre de la materia", example = "Programación")
    private String nombreMateria;
    @Schema(description = "Nombre del grupo actual", example = "A1")
    private String nombreGrupoActual;
    @Schema(description = "Nombre del grupo deseado", example = "B1")
    private String nombreGrupoDeseado;
}
