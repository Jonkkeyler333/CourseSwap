import { api } from '../api/axiosConfig'

const getStudentMatches = async () => {
  try {
    const response = await api.get('/match/me')
    return response.data || []
  } catch (error) {
    if (error.response?.status === 404) {
      return []
    }
    throw error
  }
}

const confirmMatch = async (matchId) => {
  if (!matchId || isNaN(Number(matchId))) {
    throw new Error( 'A occurrido un error al confirmar el match. Por favor, inténtalo de nuevo')
  }
  const response = await api.post(`/match/${matchId}/confirm`)
  return response.data
}

const cancelMatch = async (matchId) => {
  if (!matchId || isNaN(Number(matchId))) {
    throw new Error('No se pudo identificar el match que quieres rechazar.')
  }
  const response = await api.post(`/match/${matchId}/cancel`)
  return response.data
}

export default {
  getStudentMatches,
  confirmMatch,
  cancelMatch,
}
