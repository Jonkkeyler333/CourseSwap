import { CONFIG } from "./config.js";
import { fetchAPI } from "./api.js";

export const MatchService = {
    async getStudentMatches() {
        const userData = JSON.parse(localStorage.getItem(CONFIG.USER_KEY));
        if (!userData || !userData.codigo) {
            throw new Error(
                "A occurrido un error al obtener los datos del usuario. Por favor, inténtalo de nuevo.",
            );
        }
        const data = await fetchAPI(`/match/me`, {
            method: "GET",
        })
        return data;
    },

    async confirmMatch(matchId) {
        if (!matchId || isNaN(Number(matchId))) {
            throw new Error(
                "A occurrido un error al confirmar el match. Por favor, inténtalo de nuevo.",
            );
        }
        const data = await fetchAPI(`/match/${matchId}/confirm`, {
            method: "POST"
        })
        return data;
    },

    async cancelMatch(matchId) {
        if (!matchId || isNaN(Number(matchId))) {
            throw new Error("No se pudo cancelar el match. Inténtalo de nuevo.");
        }
        return await fetchAPI(`/match/${matchId}/cancel`, {
            method: "POST"
        });
    }
}
