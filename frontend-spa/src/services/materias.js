import { api } from '../api/axiosConfig'

const getMateriaHorarios = async (codigo) => {
  if (!codigo) {
    throw new Error('El código de la materia es obligatorio')
  }
  const response = await api.get('/materias/horario', {
    params: { codigo },
  })
  return response.data
}

const getGroupSchedules = async (grupoId) => {
  if (!grupoId) {
    throw new Error('El grupo es obligatorio')
  }
  const response = await api.get(`/grupos/${grupoId}/horarios`)
  return response.data
}

const getAvailableMaterias = async (studentId) => {
  const response = await api.get(`/estudiantes/${studentId}/materias-disponibles`)
  return response.data
}

const getGroupsByMateria = async (materiaId) => {
  const response = await api.get('/grupos', { params: { materia_id: materiaId } })
  return response.data
}

export default {
  getMateriaHorarios,
  getGroupSchedules,
  getAvailableMaterias,
  getGroupsByMateria,
}
