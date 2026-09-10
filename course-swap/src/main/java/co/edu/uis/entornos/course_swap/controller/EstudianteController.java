package co.edu.uis.entornos.course_swap.controller;

import co.edu.uis.entornos.course_swap.dto.EstudianteResponseDTO;
import co.edu.uis.entornos.course_swap.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/estudiantes")
@Tag(name = "Estudiantes", description = "Endpoints para la gestión de estudiantes")
public class EstudianteController {

    private final AuthService authService;

    public EstudianteController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener información del estudiante autenticado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Información del estudiante autenticado",
                    content = @Content(schema = @Schema(implementation = EstudianteResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    public ResponseEntity<EstudianteResponseDTO> getAuthenticatedUser(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        EstudianteResponseDTO estudianteResponseDTO = authService.getEstudianteByEmail(email);
        return ResponseEntity.ok(estudianteResponseDTO);
    }

}
