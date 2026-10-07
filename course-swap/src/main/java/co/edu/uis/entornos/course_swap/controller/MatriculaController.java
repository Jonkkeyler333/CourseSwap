package co.edu.uis.entornos.course_swap.controller;

import co.edu.uis.entornos.course_swap.dto.MatriculaRequestDTO;
import co.edu.uis.entornos.course_swap.dto.MatriculaResponseDTO;
import co.edu.uis.entornos.course_swap.dto.UpdateMatriculaRequestDTO;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

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
            @ApiResponse(responseCode = "409", description = "El estudiante ya está matriculado en la materia"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<MatriculaResponseDTO> createMatricula(@Valid @RequestBody MatriculaRequestDTO matricula,
                                                                  @AuthenticationPrincipal UserDetails userDetails) {
        MatriculaResponseDTO createdMatricula = matriculaService.crearMatricula(matricula, userDetails.getUsername());
        return ResponseEntity.status(201).body(createdMatricula);
    }

    @PatchMapping("/{matriculaId}")
    public ResponseEntity<MatriculaResponseDTO> updateMatricula(
            @PathVariable Long matriculaId,
            @Valid @RequestBody UpdateMatriculaRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(matriculaService.updateMatricula(
                matriculaId, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{matriculaId}")
    public ResponseEntity<Void> deleteMatricula(
            @PathVariable Long matriculaId,
            @AuthenticationPrincipal UserDetails userDetails) {
        matriculaService.deleteMatricula(matriculaId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatriculaResponseDTO> getMatriculaById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(matriculaService.getMatriculaById(id, userDetails.getUsername()));
    }
}
