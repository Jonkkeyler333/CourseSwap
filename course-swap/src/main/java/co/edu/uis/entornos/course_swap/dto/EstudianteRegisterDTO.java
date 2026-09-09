package co.edu.uis.entornos.course_swap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EstudianteRegisterDTO {
    @Schema(description = "Nombre del estudiante", example = "Juan")
    @NotBlank(message = "El nombre no puede estar vacio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @Schema(description = "Apellido del estudiante", example = "Pérez")
    @NotBlank(message = "El apellido no puede estar vacio")
    @Size(min = 2, max = 100, message = "El apellido debe tener entre 2 y 100 caracteres")
    private String apellido;

    @Schema(description = "Correo institucional del estudiante", example = "estudiante@uis.edu.co")
    @NotBlank(message = "El email no puede estar vacio")
    @Email(message = "El email debe ser valido")
    private String email;

    @Schema(description = "Contraseña del estudiante", example = "miPassword123")
    @NotBlank(message = "La contraseña no puede estar vacia")
    @Size(min = 6, max = 100, message = "La contraseña debe tener entre 6 y 100 caracteres")
    private String password;

    @Schema(description = "Código del estudiante (7 caracteres)", example = "1234567")
    @NotBlank(message = "El codigo de estudiante no puede estar vacio")
    @Size(min = 7, max = 7, message = "El codigo de estudiante debe tener 7 caracteres")
    private String codigo;
}