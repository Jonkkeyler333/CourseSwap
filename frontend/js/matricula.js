import { CONFIG } from "./config.js";
import { fetchAPI } from "./api.js";

export const MatriculaService = {
  async getMatricula() {
    const userData = JSON.parse(localStorage.getItem(CONFIG.USER_KEY));
    if (!userData || !userData.codigo) {
      throw new Error(
        "A occurrido un error al obtener los datos del usuario. Por favor, inténtalo de nuevo.",
      );
    }
    const data = await fetchAPI(`/estudiantes/${userData.id}/matriculas`);
    return data;
  },

  async createMatricula(matriculaData) {
    const data = await fetchAPI("/matriculas/", {
      method: "POST",
      body: JSON.stringify(matriculaData),
    });
    return data;
  },

  async updateMatricula(matriculaId, matriculaData) {
    const data = await fetchAPI(`/matriculas/${matriculaId}`, {
      method: "PATCH",
      body: JSON.stringify(matriculaData),
    });
    return data;
  },

  async deleteMatricula(matriculaId) {
    return fetchAPI(`/matriculas/${matriculaId}`, {
      method: "DELETE",
    });
  },
};
