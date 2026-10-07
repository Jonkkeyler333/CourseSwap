package co.edu.uis.entornos.course_swap.service;

import co.edu.uis.entornos.course_swap.exception.ResourceNotFoundException;
import co.edu.uis.entornos.course_swap.model.Grupo;
import co.edu.uis.entornos.course_swap.repository.GrupoRespository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrupoService {
    private final GrupoRespository grupoRespository;

    public GrupoService(GrupoRespository grupoRespository) {
        this.grupoRespository = grupoRespository;
    }

    public List<Grupo> getAllGrupos() {
        var grupos = grupoRespository.findAll(Sort.by(
                Sort.Order.asc("materia.nombre"),
                Sort.Order.asc("nombre")
        ));
        if (grupos.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron grupos en la base de datos");
        }
        return grupos;
    }

    public List<Grupo> getGruposByMateriaId(Long materiaId) {
        var grupos = grupoRespository.findByMateriaId(materiaId).stream()
                .sorted((grupoA, grupoB) -> grupoA.getNombre().compareToIgnoreCase(grupoB.getNombre()))
                .toList();
        if (grupos.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron grupos para la materia con id: " + materiaId);
        }
        return grupos;
    }
}
