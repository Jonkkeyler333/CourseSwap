package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRequestDTO {
    @Schema(description = "Correo registrado del estudiante", example = "estudiante@uis.edu.co")
    private String email;
    @Schema(description = "Contraseña del estudiante", example = "miPassword123")
    private String password;
}
