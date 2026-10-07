package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
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
    private Long id;
    private Long estudianteId;
    private String materiaCodigo;
    private Long materiaId;
    private String materiaNombre;
    private Long grupoId;
    private String grupoNombre;
    private String grupoProfesor;
    private LocalDateTime fechaRegistro;
    @ArraySchema(schema = @Schema(implementation = HorarioGrupoResponseDTO.class))
    private List<HorarioGrupoResponseDTO> horarios;
}
