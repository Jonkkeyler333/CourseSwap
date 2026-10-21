import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import solicitudesService from '../services/solicitudes'
import { useActions } from '../store/notifyStore'

export const useSolicitudes = (studentId) => {
  const queryClient = useQueryClient()
  const { notify } = useActions()
  const result = useQuery({
    queryKey: ['solicitudes', studentId],
    queryFn: () => solicitudesService.getStudentSolicitudes(studentId),
    enabled: Boolean(studentId),
    staleTime: 5 * 60 * 1000,
  })

  const createSolicitudMutation = useMutation({
    mutationFn: solicitudesService.createSolicitud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes', studentId] })
    },
    onError: (error) => {
      notify(`No se pudo crear la solicitud: ${error.response?.data?.message}`, 'error')
    }
  })

  return {
    solicitudesEstudiante: result.data,
    isLoading: result.isPending,
    isError: result.isError,
    addSolicitud: async (solicitudData) => createSolicitudMutation.mutateAsync(solicitudData),
  }
}