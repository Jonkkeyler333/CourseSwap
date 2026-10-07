package co.edu.uis.entornos.course_swap.controller;

import co.edu.uis.entornos.course_swap.dto.HorarioResponseDTO;
import co.edu.uis.entornos.course_swap.model.Grupo;
import co.edu.uis.entornos.course_swap.service.GrupoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
@Tag(name = "Grupos", description = "Endpoints para la consulta de grupos")
public class GrupoController {
    private final GrupoService grupoService;

    public GrupoController(GrupoService grupoService) {
        this.grupoService = grupoService;
    }

    @GetMapping("/all")
    @Operation(summary = "Obtener todos los grupos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Grupos encontrados",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = Grupo.class)))),
            @ApiResponse(responseCode = "404", description = "No hay grupos disponibles")
    })
    public ResponseEntity<List<Grupo>> getAllGrupos() {
        return ResponseEntity.ok(grupoService.getAllGrupos());
    }

    @GetMapping("/{grupoId}/horarios")
    @Operation(summary = "Obtener horarios de un grupo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Horarios encontrados",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = HorarioResponseDTO.class)))),
            @ApiResponse(responseCode = "404", description = "Grupo inexistente o sin horarios")
    })
    public ResponseEntity<List<HorarioResponseDTO>> getHorariosByGrupoId(
            @PathVariable Long grupoId) {
        return ResponseEntity.ok(grupoService.getHorariosByGrupoId(grupoId));
    }

    @GetMapping
    @Operation(summary = "Obtener grupos por materia")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Grupos encontrados",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = Grupo.class)))),
            @ApiResponse(responseCode = "404", description = "No hay grupos para la materia indicada")
    })
    public ResponseEntity<List<Grupo>> getGruposByMateriaId(
            @RequestParam(name = "materia_id") Long materiaId) {
        return ResponseEntity.ok(grupoService.getGruposByMateriaId(materiaId));
    }
}
