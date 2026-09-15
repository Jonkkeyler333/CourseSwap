package co.edu.uis.entornos.course_swap.service;

import co.edu.uis.entornos.course_swap.dto.HorarioResponseDTO;
import co.edu.uis.entornos.course_swap.exception.ResourceNotFoundException;
import co.edu.uis.entornos.course_swap.model.Materia;
import co.edu.uis.entornos.course_swap.repository.MateriaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MateriaService {
    private final MateriaRepository materiaRepository;

    public MateriaService(MateriaRepository materiaRepository) {
        this.materiaRepository = materiaRepository;
    }

    public Materia getByCodigo(String codigo) {
        String normalizedCodigo = normalizeInput(codigo, "El código de la materia es obligatorio");
        return materiaRepository.findByCodigo(normalizedCodigo)
                .orElseThrow(() -> new ResourceNotFoundException("No existe una materia con código: " + normalizedCodigo));
    }

    public List<Materia> searchByNombre(String nombre) {
        String normalizedNombre = normalizeInput(nombre, "El nombre de la materia es obligatorio");
        List<Materia> materias = materiaRepository.findByNombreContainingIgnoreCase(normalizedNombre);
        if (materias.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron materias para el nombre: " + normalizedNombre);
        }
        return materias;
    }

    public List<Materia> getAllMaterias() {
        var materias = materiaRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre"));
        if (materias.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron materias en la base de datos");
        }
        return materias;
    }

    public List<HorarioResponseDTO> getMateriaHorarioByCodigo(String codigo) {
        String normalizedCodigo = normalizeInput(codigo, "El código de la materia es obligatorio");
        List<HorarioResponseDTO> horarios = materiaRepository.findMateriaWithGruposAndHorarios(normalizedCodigo);
        if (horarios.isEmpty()) {
            throw new ResourceNotFoundException("No se encontró horario para la materia con código: " + normalizedCodigo);
        }
        return horarios;
    }

    private String normalizeInput(String input, String errorMessage) {
        if (input == null || input.trim().isEmpty()) {
            throw new IllegalArgumentException(errorMessage);
        }
        return input.trim();
    }
}
