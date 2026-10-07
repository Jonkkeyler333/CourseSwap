import { CONFIG } from "./config.js";
import { fetchAPI } from "./api.js";

export const MateriaService = {
  async getAvailableMaterias(estudianteId) {
    const data = await fetchAPI(
      `/estudiantes/${estudianteId}/materias-disponibles`,
    );
    return data;
  },

  async getMaterias(nombre) {
    if (!nombre) {
      const data = await fetchAPI("/materias/all");
      return data;
    } else {
      const params = {
        nombre: nombre,
      };
      const queryString = new URLSearchParams(params).toString();
      const data = await fetchAPI(`/materias/?${queryString}`);
      return data;
    }
  },
  async getMateriaHorarios(codigoMateria) {
    if (!codigoMateria || typeof codigoMateria !== "string") {
      throw new Error(
        "El código de la materia es requerido para obtener los horarios.",
      );
    }
    const params = {
      codigo: codigoMateria,
    };
    const queryString = new URLSearchParams(params).toString();
    console.log("Fetching horarios for materia with query:", queryString);
    const data = await fetchAPI(`/materias/horario?${queryString}`);
    return data;
  },
  async getGroupsByMateria(materiaId) {
    const params = new URLSearchParams({ materia_id: String(materiaId) });
    const data = await fetchAPI(`/grupos?${params.toString()}`);
    return data;
  },
  async getGroupSchedules(grupoId) {
    const data = await fetchAPI(`/grupos/${grupoId}/horarios`);
    return data;
  },
};
