package co.edu.uis.entornos.course_swap.controller;

import co.edu.uis.entornos.course_swap.dto.HorarioResponseDTO;
import co.edu.uis.entornos.course_swap.model.Materia;
import co.edu.uis.entornos.course_swap.service.MateriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
@Tag(name = "Materias", description = "Endpoints para consulta de materias y horarios")
public class MateriaController {
    private final MateriaService materiaService;

    public MateriaController(MateriaService materiaService) {
        this.materiaService = materiaService;
    }

    @GetMapping("/{codigo}")
    @Operation(summary = "Buscar materia por código")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Materia encontrada",
                    content = @Content(schema = @Schema(implementation = Materia.class))),
            @ApiResponse(responseCode = "400", description = "Parámetro inválido o materia no encontrada")
    })
    public ResponseEntity<Materia> getByCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(materiaService.getByCodigo(codigo));
    }

    @GetMapping("/")
    @Operation(summary = "Buscar materias por nombre (ignora mayúsculas/minúsculas)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Materias encontradas",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = Materia.class)))),
            @ApiResponse(responseCode = "400", description = "Parámetro inválido o sin resultados")
    })
    public ResponseEntity<List<Materia>> getByNombre(@RequestParam(required = false) String nombre) {
        if (nombre == null){
            return ResponseEntity.ok(materiaService.getAllMaterias());
        }
        return ResponseEntity.ok(materiaService.searchByNombre(nombre));
    }

    @GetMapping("/horario")
    @Operation(summary = "Obtener horario de una materia por código")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Horario encontrado",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = HorarioResponseDTO.class)))),
            @ApiResponse(responseCode = "400", description = "Parámetro inválido o materia sin horario")
    })
    public ResponseEntity<List<HorarioResponseDTO>> getHorarioByCodigo(@RequestParam String codigo) {
        return ResponseEntity.ok(materiaService.getMateriaHorarioByCodigo(codigo));
    }
}
