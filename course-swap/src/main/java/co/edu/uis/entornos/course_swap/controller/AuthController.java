package co.edu.uis.entornos.course_swap.controller;

import co.edu.uis.entornos.course_swap.dto.AuthResponseDTO;
import co.edu.uis.entornos.course_swap.dto.EstudianteRegisterDTO;
import co.edu.uis.entornos.course_swap.dto.EstudianteResponseDTO;
import co.edu.uis.entornos.course_swap.dto.LoginRequestDTO;
import co.edu.uis.entornos.course_swap.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Endpoints de autenticación y registro de estudiantes")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/check")
    @Operation(summary = "Verificar estado del servicio de autenticación")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Servicio activo")
    })
    public ResponseEntity<Map<String,String>> check() {
        Map<String,String> status = new HashMap<>();
        status.put("status", "running");
        return ResponseEntity.ok(status);
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar un nuevo estudiante")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Estudiante registrado correctamente",
                    content = @Content(schema = @Schema(implementation = EstudianteResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o email ya registrado")
    })
    public ResponseEntity<EstudianteResponseDTO> registerUser(@Valid @RequestBody EstudianteRegisterDTO estudiante){
        EstudianteResponseDTO estudianteResponseDTO = authService.registerUser(estudiante);
        return ResponseEntity.status(HttpStatus.CREATED).body(estudianteResponseDTO);
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión y obtener JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Autenticación exitosa",
                    content = @Content(schema = @Schema(implementation = AuthResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Credenciales inválidas")
    })
    public ResponseEntity<AuthResponseDTO> loginUser(@Valid @RequestBody LoginRequestDTO loginRequest){
        AuthResponseDTO authResponseDTO = authService.loginUser(loginRequest);
        return ResponseEntity.ok(authResponseDTO);
    }

}
