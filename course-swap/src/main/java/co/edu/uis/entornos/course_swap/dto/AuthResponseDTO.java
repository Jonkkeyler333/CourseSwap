package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    @Schema(description = "Token JWT de autenticación", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String token;
    @Schema(description = "Correo del usuario autenticado", example = "estudiante@uis.edu.co")
    private String email;
}
