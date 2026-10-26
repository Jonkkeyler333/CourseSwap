import matchService from '../services/match'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useActions } from '../store/notifyStore'

export const useMatch = ( ) => {
  const queryClient = useQueryClient()
  const { notify } = useActions()

  const result = useQuery({
    queryKey: ['match'],
    queryFn: () => matchService.getStudentMatches(),
    staleTime: 5 * 60 * 1000,
  })

  const confirmMatchMutation = useMutation({
    mutationFn: matchService.confirmMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match'] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
    },
    onError: (error) => {
      notify(`No se pudo confirmar el match: ${error.response?.data?.message}`, 'error')
      console.error(error)
    } 
  })

  const cancelMatchMutation = useMutation({
    mutationFn: matchService.cancelMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match'] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes-compatibles'] })
    },
    onError: (error) => {
      notify(`No se pudo rechazar el match: ${error.response?.data?.message || error.message}`, 'error')
      console.error(error)
    },
  })

  return {
    matches: result.data || [],
    isLoading: result.isPending,
    isError: result.isError,
    confirmMatch: async (matchId) => confirmMatchMutation.mutateAsync(matchId),
    cancelMatch: async (matchId) => cancelMatchMutation.mutateAsync(matchId),
    isCancelling: cancelMatchMutation.isPending,
  }
}
