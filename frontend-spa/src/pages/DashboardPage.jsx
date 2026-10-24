import { Container, Paper, Typography, CircularProgress } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useMatch } from '../hooks/useMatch'
import Notification from '../components/Notification'
import ErrorIcon from '@mui/icons-material/Error'
import MatchCard from '../components/MatchCard'

const DashboardPage = () => {
  const { user, isLoading, isError } = useAuth()
  const { matches, isLoading: isMatchesLoading } = useMatch()

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (isError) {
    return (
      <Typography variant="body1" color="error">
        <ErrorIcon /> Error al cargar la información del usuario. Refresca la página 
      </Typography>
    )
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

      {!isMatchesLoading && matches.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No tienes matches disponibles.
        </Typography>
      ) : null}

      { isMatchesLoading && matches.length > 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          <CircularProgress size={20} /> Cargando tus matches...
        </Typography>
      ) : (
        matches.filter((match) => match.estado === 'ACTIVO').map(( match ) => 
          <MatchCard key={match.matchId} match={match} user={user} />
        )
      )}
      <Notification />
    </Container>
  )


}

export default DashboardPage