package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SolicitudBusquedaDTO {

    @Schema(description = "ID de la solicitud", example = "12")
    private Long id;

    @Schema(description = "Nombre del estudiante que publicó la solicitud", example = "Ana Pérez")
    private String nombreEstudiante;

    @Schema(description = "Código de la materia", example = "22948")
    private String codigoMateria;

    @Schema(description = "Nombre de la materia", example = "Fundamentos de Programación")
    private String nombreMateria;

    @Schema(description = "Grupo actual del estudiante que publicó la solicitud", example = "A1")
    private String nombreGrupoActual;

    @Schema(description = "Grupo al que desea cambiarse", example = "B1")
    private String nombreGrupoDeseado;

    @Schema(description = "Fecha de publicación de la solicitud", example = "2026-09-27T14:30:00")
    private String fechaSolicitud;
}