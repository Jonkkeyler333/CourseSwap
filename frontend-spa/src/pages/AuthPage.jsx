import { useAuth } from '../hooks/useAuth'
import authService from '../services/auth'
import { useNavigate } from 'react-router-dom'
import { Container, Typography } from '@mui/material'
import Notification from '../components/Notification'
import { useActions } from '../store/notifyStore'
import MyTabs from '../components/MyTabs'

const AuthPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { notify } = useActions()

  const handleLogin = async (credentials) => {
    try {
      const response = await authService.loginUser(credentials)
      await login(response.token)
      notify('Inicio de sesión exitoso', 'success')
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      const serverMessage = error.response?.data?.message
      notify(serverMessage || 'Error al iniciar sesión', 'error')
      console.log(error)
    }
  }

  const handleRegister = async (userData) => {
    if (userData.password !== userData.confirmPassword) {
      notify('Las contraseñas no coinciden', 'error')
      return
    }
    try {
      const response = await authService.registerUser(userData)
      notify(`Registro del estudiante con codigo ${response.codigo} exitoso, ahora puedes iniciar sesión`, 'success')
    } catch (error) {
      const serverMessage = error.response?.data?.message
      console.log(error)
      notify(serverMessage || 'Error al registrar usuario', 'error')
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h2" component="h1">
        Bienvenido a CourseSwap
      </Typography>
      <MyTabs onLogin={handleLogin} onRegister={handleRegister} />
      <Notification/>
    </Container>

  )
}

export default AuthPage