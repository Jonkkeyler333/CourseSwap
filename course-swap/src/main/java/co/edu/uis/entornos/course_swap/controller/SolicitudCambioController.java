package co.edu.uis.entornos.course_swap.controller;

import co.edu.uis.entornos.course_swap.dto.SolicitudRequestDTO;
import co.edu.uis.entornos.course_swap.dto.SolicitudResponseDTO;
import co.edu.uis.entornos.course_swap.service.SolicitudCambioService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Solicitudes de Cambio", description = "Endpoints para la gestión de solicitudes de cambio de grupo")
@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudCambioController {
    private final SolicitudCambioService solicitudCambioService;

    public SolicitudCambioController(SolicitudCambioService solicitudCambioService) {
        this.solicitudCambioService = solicitudCambioService;
    }

    @PostMapping("/")
    @Operation(summary = "Crear solicitud de cambio", description = "Crea una nueva solicitud de cambio de grupo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Solicitud creada correctamente", content = @Content(schema = @Schema(implementation = SolicitudResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    public ResponseEntity<SolicitudResponseDTO> crearSolicitudCambio(@Valid @RequestBody SolicitudRequestDTO solicitud) {
        return ResponseEntity.ok(solicitudCambioService.crearSolicitudCambio(solicitud));
    }
}
