import { Container, Paper, Typography } from '@mui/material'
import { useAuth } from '../hooks/useAuth'

const DashboardPage = () => {
  const { user, isLoading} = useAuth()

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={1} sx={{ mt:2, padding: 2 }}>
        <Typography variant="h3" component="h1">
          Panel Principal
        </Typography>
        <Typography variant="h4" component="h1">
          Hola, {user ? user.nombre : 'Invitado'}! Bienvenido a CourseSwap.
        </Typography>
        <Typography variant="body1">
          Gestiona tu matrícula y encuentra intercambios de grupo con otros estudiantes UIS.
        </Typography>
        <Typography variant="body1">
          Codigo: {user ? user.codigo : 'N/A'}
        </Typography>
                
      </Paper>
    </Container>
  )


}

export default DashboardPage