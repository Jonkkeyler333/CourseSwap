package co.edu.uis.entornos.course_swap.controller;

import co.edu.uis.entornos.course_swap.dto.EstudianteResponseDTO;
import co.edu.uis.entornos.course_swap.dto.MatchCreateDTO;
import co.edu.uis.entornos.course_swap.dto.MatchResponseDTO;
import co.edu.uis.entornos.course_swap.service.AuthService;
import co.edu.uis.entornos.course_swap.service.MatchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Content;

import java.util.List;

@RestController
@RequestMapping("/api/match")
@Tag(name = "Match", description = "Endpoints para la gestión de los matches")
public class MatchController {

    private MatchService matchService;
    private AuthService authService;

    public MatchController(MatchService matchService, AuthService authService) {
        this.matchService = matchService;
        this.authService = authService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un match por su ID", description = "Devuelve los detalles de un match específico dado su ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Match encontrado", content = @Content(schema = @Schema(implementation = MatchResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Match no encontrado")
    })
    public MatchResponseDTO getMatchById(@PathVariable Long id){
        return matchService.getMatchById(id);
    }

    @PostMapping("/{id}/confirm")
    @Operation(summary = "Confirmar un match", description = "Permite a un estudiante confirmar un match propuesto. Si ambos estudiantes confirman, se ejecuta el intercambio de grupos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Match confirmado exitosamente", content = @Content(schema = @Schema(implementation = MatchCreateDTO.class))),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida o el match no está activo"),
            @ApiResponse(responseCode = "404", description = "Match no encontrado")
    })
    public ResponseEntity<MatchCreateDTO> confirmMatch(@PathVariable Long id, Authentication authentication){
        EstudianteResponseDTO estudiante = getStudentByEmail(authentication);
        System.out.println(estudiante.getId());
        MatchCreateDTO confirmedMatch = matchService.confirmMatch(id, estudiante.getId());
        return ResponseEntity.ok(confirmedMatch);
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener los matches del estudiante autenticado", description = "Devuelve una lista de todos los matches asociados al estudiante que ha iniciado sesión.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de matches obtenida exitosamente", content = @Content(schema = @Schema(implementation = MatchResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    public ResponseEntity<List<MatchResponseDTO>> getMyMatches(Authentication authentication){
        EstudianteResponseDTO estudiante = getStudentByEmail(authentication);
        List<MatchResponseDTO> matches = matchService.getMatchesByEstudiante(estudiante.getId());
        return ResponseEntity.ok(matches);
    }

    private EstudianteResponseDTO getStudentByEmail(Authentication authentication){
        String email = authentication.getName();
        return authService.getEstudianteByEmail(email);
    }

}
