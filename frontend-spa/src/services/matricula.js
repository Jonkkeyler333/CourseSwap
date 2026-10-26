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

const createMatricula = async (matriculaData) => {
  const response = await api.post('/matriculas/', matriculaData)
  return response.data
}

const updateMatricula = async (matriculaId, matriculaData) => {
  const response = await api.patch(`/matriculas/${matriculaId}`, matriculaData)
  return response.data
}

const deleteMatricula = async (matriculaId) => {
  await api.delete(`/matriculas/${matriculaId}`)
}

export default {
  getMatricula,
  createMatricula,
  updateMatricula,
  deleteMatricula,
}