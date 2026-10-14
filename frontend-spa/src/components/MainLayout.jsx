import { useAuth } from '../hooks/useAuth'
import { AppBar, Container, Toolbar, Link, Typography, Button, Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/CourseSwap_transparent.png'

const MainLayout = ({ user }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <Container maxWidth="lg">
      <AppBar position="static" elevation={1} >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Box component="img" src={logo} alt="CourseSwap logo" sx={{ height: 50 }} />
            <Typography variant="h4" component="h1">
              CourseSwap
            </Typography>
          </Box>

          
          
          <Button color="inherit" component={Link} to="/" sx={{ ml: 2 }}>
            Inicio
          </Button>
          
          <Button color="inherit" component={Link} to="/solicitudes" sx={{ ml: 2 }}>
            Mis Solicitudes
          </Button>

          <Typography variant='body1' component='span' sx={{ ml: 2, mr: 2 }}>
            {user ? `Bienvenido, ${user.nombre}` : 'No has iniciado sesión'}
          </Typography>

          <Button color="inherit" onClick={handleLogout}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <Outlet />
      </main>

    </Container>
  )
}

export default MainLayout