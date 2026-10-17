import { api } from '../api/axiosConfig'

const getMatricula = async (studentId) => {
  if (!studentId) {
    throw new Error(
      'A occurrido un error al obtener los datos del usuario. Por favor, inténtalo de nuevo.',
    )
  }
  const response = await api(`/estudiantes/${studentId}/matriculas`)
  return response.data
}

export default {
  getMatricula,
}