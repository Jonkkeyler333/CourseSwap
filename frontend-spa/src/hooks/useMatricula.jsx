import matriculaService from '../services/matricula'
import { useQuery } from '@tanstack/react-query'

export const useMatricula = (studentId) => {
  const result = useQuery({
    queryKey: ['matricula', studentId],
    queryFn: () => matriculaService.getMatricula(studentId),
    enabled: Boolean(studentId),
    staleTime: 5 * 60 * 1000,
  })

  return {
    matriculaEstudiante: result.data,
    isLoading: result.isPending,
    isError: result.isError,
  }
}
