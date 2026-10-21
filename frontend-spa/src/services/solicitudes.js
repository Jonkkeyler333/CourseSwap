import { api } from '../api/axiosConfig'

const getStudentSolicitudes = async (studentId) => {
  if (!studentId) {
    throw new Error('No se pudo identificar al estudiante autenticado')
  }
  const response = await api.get(`/estudiantes/${studentId}/solicitudes`)
  return response.data
}

const createSolicitud = async (solicitudData) => {
  if (
    !solicitudData?.codigo || !solicitudData?.grupoActualId || !solicitudData?.grupoNuevoId || !solicitudData?.materiaId
  ) 
  {
    throw new Error(
      'Todos los campos son obligatorios para crear una solicitud.',
    )
  }
  const response = await api.post('/solicitudes/', solicitudData)
  return response.data
}

const updateSolicitud = async (solicitudId, nuevoGrupoId) => {
  if (!solicitudId || !nuevoGrupoId) {
    throw new Error('Solicitud ID y Nuevo Grupo ID son obligatorios para actualizar una solicitud.')
  }
  const response = await api.put('/solicitudes/', {
    'solicitudId': solicitudId,
    'nuevoGrupoId': nuevoGrupoId
  })
  return response.data
}

const deleteSolicitud = async (solicitudId) => {
  if (!solicitudId) {
    throw new Error('Solicitud ID es obligatorio para eliminar una solicitud.')
  }
  await api.delete(`/solicitudes/${solicitudId}`)
}

export default {
  getStudentSolicitudes,
  updateSolicitud,
  createSolicitud,
  deleteSolicitud,
}