import { api } from '../api/axiosConfig'

const loginUser = async (credentials) => {
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required')
  }
  const response = await api.post('/auth/login', credentials)
  return response.data
}

const registerUser = async (userData) => {
  if (!userData.nombre || !userData.apellido || !userData.email || !userData.password || !userData.codigo) {
    throw new Error('All fields are required')
  }
  const response = await api.post('/auth/register', userData)
  return response.data
}

const getMe = async () => {
  const response = await api.get('/estudiantes/me')
  return response.data
}

const logoutUser = () => {
  localStorage.removeItem('user-token')
}

export default {
  loginUser,
  registerUser,
  getMe,
  logoutUser
}
