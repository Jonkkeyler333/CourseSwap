import { CONFIG } from "./config.js";
import { fetchAPI } from "./api.js";

export const SolicitudesService = {
  async getAllSolicitudes() {
    const data = await fetchAPI("/solicitudes/", {
      method: "GET",
    });
    return data;
  },

  async getStudentSolicitudes() {
    const userData = JSON.parse(localStorage.getItem(CONFIG.USER_KEY));
    if (!userData || !userData.codigo) {
      throw new Error(
        "A occurrido un error al obtener los datos del usuario. Por favor, inténtalo de nuevo.",
      );
    }
    const data = await fetchAPI(`/estudiantes/${userData.id}/solicitudes`, {
      method: "GET",
    });
    return data;
  },
  async createSolicitud(solicitudData) {
    if (
      !solicitudData.codigo ||
      !solicitudData.grupoActualId ||
      !solicitudData.grupoNuevoId ||
      !solicitudData.materiaId
    ) {
      throw new Error(
        "Todos los campos son obligatorios para crear una solicitud.",
      );
    }
    const data = await fetchAPI("/solicitudes/", {
      method: "POST",
      body: JSON.stringify(solicitudData),
    });
    return data;
  },
};
