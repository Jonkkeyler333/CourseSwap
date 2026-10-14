import { useAuth } from '../hooks/useAuth'
import authService from '../services/auth'
import { useNavigate } from 'react-router-dom'
import { Container, Typography } from '@mui/material'
import Notification from '../components/Notification'
import { useMessage, useType, useActions } from '../store/notifyStore'
import MyTabs from '../components/MyTabs'

const AuthPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const notification = useMessage()
  const typeNotify = useType()
  const { setMessage, setType } = useActions()

  const handleLogin = async (credentials) => {
    try {
      const response = await authService.loginUser(credentials)
      await login(response.token)
      setMessage('Inicio de sesión exitoso')
      setType('success')
      setTimeout(() => {
        setMessage('')
        setType('')
        navigate('/')
      }, 1300)
    } catch (error) {
      const serverMessage = error.response?.data?.message
      setMessage(serverMessage || 'Error al iniciar sesión')
      setType('error')
      setTimeout(() => {
        setMessage('')
        setType('')
      }, 3000)
      console.log(error)
    }
  }

  const handleRegister = async (userData) => {
    if (userData.password !== userData.confirmPassword) {
      setMessage('Las contraseñas no coinciden')
      setType('error')
      setTimeout(() => {
        setMessage('')
        setType('')
      }, 3000)
      return
    }
    try {
      const response = await authService.registerUser(userData)
      setMessage(`Registro del estudiante con codigo ${response.codigo} exitoso, ahora puedes iniciar sesión`)
      setType('success')
      setTimeout(() => {
        setMessage('')
        setType('')
      }, 3000)
    } catch (error) {
      const serverMessage = error.response?.data?.message
      console.log(error)
      setMessage(serverMessage || 'Error al registrar usuario')
      setType('error')
      setTimeout(() => {
        setMessage('')
        setType('')
      }, 3000)
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h2" component="h1">
        Bienvenido a CourseSwap
      </Typography>
      <MyTabs onLogin={handleLogin} onRegister={handleRegister} />
      <Notification message={notification} type={typeNotify}/>
    </Container>

  )
}

export default AuthPage