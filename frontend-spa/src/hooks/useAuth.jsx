import { useQuery, useQueryClient } from '@tanstack/react-query'
import authService from '../services/auth'

export const useAuth = () => {
  const queryClient = useQueryClient()
  const token = localStorage.getItem('user-token')

  const result = useQuery({
    queryKey: ['authUser'],
    queryFn: authService.getMe,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const login = async (tokenString) => {
    localStorage.setItem('user-token', tokenString)
    await queryClient.query({
      queryKey: ['authUser'],
      queryFn: authService.getMe,
      staleTime: 5 * 60 * 1000,
    })
  }

  const logout = () => {
    authService.logoutUser()
    localStorage.removeItem('user-token')
    queryClient.setQueryData(['authUser'], null)
    queryClient.removeQueries({ queryKey: ['authUser'] })
  }

  return {
    user: result.data,
    isLoading: !!token && result.isPending,
    isError: result.isError,
    login,
    logout,
  }
}