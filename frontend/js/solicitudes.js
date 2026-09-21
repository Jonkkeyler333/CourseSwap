import { CONFIG } from './config.js';
import { fetchAPI } from './api.js';

export const SolicitudesService = {
    async getAllSolicitudes() {
        const data = await fetchAPI('/solicitudes', {
            method: 'GET',
        })
        return data;
    },

    async getStudentSolicitudes() {
        const userData = JSON.parse(localStorage.getItem(CONFIG.USER_KEY));
        if (!userData || !userData.codigo) {
            throw new Error('A occurrido un error al obtener los datos del usuario. Por favor, inténtalo de nuevo.');
        }
        const data = await fetchAPI(`/estudiantes/${userData.id}/solicitudes`, {
            method: 'GET',
        });
        console.log('Solicitudes del estudiante:', data);
        return data;
    }
}