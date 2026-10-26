import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import solicitudesService from '../services/solicitudes'

export const useSolicitudBusqueda = (studentId) => {
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: ['solicitudes-compatibles', studentId],
    queryFn: solicitudesService.getSolicitudesCompatibles,
    enabled: Boolean(studentId),
    staleTime: 0,
  })

  const acceptMutation = useMutation({
    mutationFn: solicitudesService.aceptarMatchManual,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['solicitudes-compatibles', studentId] }),
        queryClient.invalidateQueries({ queryKey: ['solicitudes', studentId] }),
        queryClient.invalidateQueries({ queryKey: ['match'] }),
      ])
    },
  })

  return {
    solicitudesCompatibles: result.data || [],
    isLoading: result.isPending,
    isError: result.isError,
    acceptMatchManual: (solicitudId) => acceptMutation.mutateAsync(solicitudId),
    isAccepting: acceptMutation.isPending,
  }
}
