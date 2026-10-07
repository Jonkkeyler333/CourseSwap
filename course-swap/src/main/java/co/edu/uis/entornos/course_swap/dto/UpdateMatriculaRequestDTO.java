package co.edu.uis.entornos.course_swap.dto;

<<<<<<< HEAD
import io.swagger.v3.oas.annotations.media.Schema;
=======
>>>>>>> 7621925178baf3fce8ca0372ef6c600f576b1ed5
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateMatriculaRequestDTO {
<<<<<<< HEAD
    @Schema(description = "Id del nuevo grupo", example = "5", required = true)
=======
>>>>>>> 7621925178baf3fce8ca0372ef6c600f576b1ed5
    @NotNull(message = "El id del grupo no puede estar vacío")
    private Long grupoId;
}
