package co.edu.uis.entornos.course_swap.controller;

import co.edu.uis.entornos.course_swap.dto.SolicitudRequestDTO;
import co.edu.uis.entornos.course_swap.dto.SolicitudResponseDTO;
import co.edu.uis.entornos.course_swap.dto.UpdateSolicitudRequestDTO;
import co.edu.uis.entornos.course_swap.service.SolicitudCambioService;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.List;

@Tag(name = "Solicitudes de Cambio", description = "Endpoints para la gestión de solicitudes de cambio de grupo")
@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudCambioController {
    private final SolicitudCambioService solicitudCambioService;

    public SolicitudCambioController(SolicitudCambioService solicitudCambioService) {
        this.solicitudCambioService = solicitudCambioService;
    }

    @GetMapping("/")
    @Operation(summary = "Obtener todas las solicitudes de cambio", description = "Devuelve una lista de todas las solicitudes de cambio de grupo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de solicitudes obtenida correctamente", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = SolicitudResponseDTO.class)))),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    public ResponseEntity<List<SolicitudResponseDTO>> getAllSolicitudes() {
        return ResponseEntity.ok(solicitudCambioService.getAllSolicitudes());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una solicitud de cambio por ID", description = "Devuelve una sola solicitud de cambio de grupo por su ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Solicitud obtenida correctamente", content = @Content(schema = @Schema(implementation = SolicitudResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Solicitud no encontrada")
    })
    public ResponseEntity<SolicitudResponseDTO> getSolicitudById(@PathVariable Long id) {
        return ResponseEntity.ok(solicitudCambioService.getSolicitudById(id).orElse(null));
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSolicitudCambio(@PathVariable Long id){
        solicitudCambioService.deleteSolicitudCambio(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/")
    @Operation(summary = "Actualizar una solicitud de cambio", description = "Actualiza una solicitud de cambio de grupo existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Solicitud actualizada correctamente", content = @Content(schema = @Schema(implementation = SolicitudResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    public ResponseEntity<SolicitudResponseDTO> actualizarSolicitudCambio(@Valid @RequestBody UpdateSolicitudRequestDTO solicitud) {
        return ResponseEntity.ok(solicitudCambioService.updateSolicitudCambio(solicitud));
    }
}
