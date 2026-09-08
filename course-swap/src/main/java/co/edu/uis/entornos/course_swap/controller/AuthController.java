package co.edu.uis.entornos.course_swap.controller;

import co.edu.uis.entornos.course_swap.dto.AuthResponseDTO;
import co.edu.uis.entornos.course_swap.dto.EstudianteRegisterDTO;
import co.edu.uis.entornos.course_swap.dto.EstudianteResponseDTO;
import co.edu.uis.entornos.course_swap.dto.LoginRequestDTO;
import co.edu.uis.entornos.course_swap.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<EstudianteResponseDTO> registerUser(@Valid @RequestBody EstudianteRegisterDTO estudiante){
        EstudianteResponseDTO estudianteResponseDTO = authService.registerUser(estudiante);
        return ResponseEntity.status(HttpStatus.CREATED).body(estudianteResponseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> loginUser(@Valid @RequestBody LoginRequestDTO loginRequest){
        AuthResponseDTO authResponseDTO = authService.loginUser(loginRequest);
        return ResponseEntity.ok(authResponseDTO);
    }

}
