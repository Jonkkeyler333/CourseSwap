import { useQuery } from '@tanstack/react-query'
import materiasService from '../services/materias'

export const useMateriaHorarios = (codigo) => {
  const result = useQuery({
    queryKey: ['materia-horarios', codigo],
    queryFn: () => materiasService.getMateriaHorarios(codigo),
    enabled: Boolean(codigo),
    staleTime: 5 * 60 * 1000,
  })

  return {
    horarios: result.data || [],
    isLoading: result.isPending,
    isError: result.isError,
  }
}
