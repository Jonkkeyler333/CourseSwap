package co.edu.uis.entornos.course_swap.controller;

import co.edu.uis.entornos.course_swap.dto.MatriculaRequestDTO;
import co.edu.uis.entornos.course_swap.dto.MatriculaResponseDTO;
import co.edu.uis.entornos.course_swap.service.MatriculaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matriculas")
@Tag(name = "Matrículas", description = "Endpoints para la gestión de matrículas")
public class MatriculaController {

    private final MatriculaService matriculaService;

    public MatriculaController(MatriculaService matriculaService) {
        this.matriculaService = matriculaService;
    }

    @PostMapping("/")
    @Operation(summary = "Crear una nueva matrícula")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Matrícula creada exitosamente", content = @Content(schema = @Schema(implementation = MatriculaResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<MatriculaResponseDTO> createMatricula(@Valid @RequestBody MatriculaRequestDTO matricula) {
        matriculaService.isMatriculaExists(matricula.getEstudianteId(), matricula.getMateriaId());
        MatriculaResponseDTO createdMatricula = matriculaService.crearMatricula(matricula);
        return ResponseEntity.status(201).body(createdMatricula);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatriculaResponseDTO> getMatriculaById(@PathVariable Long id) {
        var matricula = matriculaService.getMatriculaById(id);
        if (matricula == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(matricula);
    }
}
