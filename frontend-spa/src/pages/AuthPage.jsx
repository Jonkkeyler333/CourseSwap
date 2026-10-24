import { useAuth } from '../hooks/useAuth'
import authService from '../services/auth'
import { useNavigate } from 'react-router-dom'
import { Box, Chip, Container, Paper, Stack, Typography } from '@mui/material'
import Notification from '../components/Notification'
import { useActions } from '../store/notifyStore'
import MyTabs from '../components/MyTabs'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import logo from '../assets/CourseSwap_transparent.png'

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
      notify(serverMessage || 'Error al registrar usuario', 'error')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 3, md: 6 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={10}
          sx={{
            overflow: 'hidden',
            borderRadius: 4,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' },
          }}
        >
          
          <Box
            sx={{
              p: { xs: 3, md: 6 },
              color: 'common.white',
              backgroundColor: 'primary.main',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="CourseSwap logo"
              sx={{
                height: { xs: 86, sm: 100 },
                maxWidth: '100%',
                objectFit: 'contain',
                mb: 3,
              }}
            />
            <Chip
              icon={<SwapHorizIcon />}
              label="Intercambia con confianza"
              sx={{ alignSelf: 'flex-start', mb: 3, color: 'common.white', borderColor: 'rgba(255,255,255,.45)' }}
              variant="outlined"
            />
            <Typography variant="h2" component="h1" fontWeight={800} sx={{ fontSize: { xs: '2.3rem', md: '3.5rem' } }}>
              Bienvenido a CourseSwap
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, opacity: 0.9, fontWeight: 400 }}>
              Encuentra el grupo que necesitas y conecta con estudiantes que buscan el cambio opuesto.
            </Typography>
            <Stack spacing={2} sx={{ mt: 5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <SchoolOutlinedIcon />
                <Typography>Organiza tu matrícula en un solo lugar.</Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <GroupsOutlinedIcon />
                <Typography>Encuentra coincidencias con otros estudiantes UIS.</Typography>
              </Stack>
            </Stack>
          </Box>
          <Box sx={{ p: { xs: 2, sm: 4, md: 6 }, bgcolor: 'background.paper' }}>
            <Typography variant="overline" color="primary" fontWeight={700}>
              Tu espacio académico
            </Typography>
            <Typography variant="h4" component="h2" fontWeight={700} sx={{ mb: 1 }}>
              Accede a tu cuenta
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Inicia sesión o crea tu cuenta para comenzar.
            </Typography>
            <MyTabs onLogin={handleLogin} onRegister={handleRegister} />
          </Box>
        </Paper>
      </Container>
      <Notification/>
    </Box>

  )
}

export default AuthPage