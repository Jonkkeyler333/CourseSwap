import { useAuth } from '../hooks/useAuth'
import { AppBar, Container, Toolbar, Link, Typography, Button } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const MainLayout = ({ user }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <Typography variant='h5' component='h1' sx={{ flexGrow: 1 }}>
            CourseSwap App
          </Typography>
          
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