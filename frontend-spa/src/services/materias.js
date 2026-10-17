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

export default {
  getMateriaHorarios,
}
