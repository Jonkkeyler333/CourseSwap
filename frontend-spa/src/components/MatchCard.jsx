import { useMatch } from '../hooks/useMatch'
import { Card } from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { Button, Stack, Typography } from '@mui/material'
import { useActions } from '../store/notifyStore'
import RecommendIcon from '@mui/icons-material/Recommend'

// componente para mostrar tarjetas de matches en el dashboard general
const MatchCard = ({ match, user }) => {
  const { confirmMatch, cancelMatch } = useMatch()
  console.log('MatchCard - match:', match)
  console.log('MatchCard - user:', user)
  const isEstudianteA = String(match.nombreEstudianteA) === String(user?.nombre + ' ' + user?.apellido)
  //   const isEstudianteB = String(match.nombreEstudianteB) === String(user?.nombre)
  const { notify } = useActions()

  const handleConfirmMatch = async () => {
    try {
      const updatedMatch = await confirmMatch(match.matchId)
      if (updatedMatch?.estado === 'CONFIRMADO') {
        notify('¡Match confirmado! El cambio de grupo se realizó correctamente.', 'success')
        return
      }
      notify('Tu confirmación fue registrada. Ahora debes esperar al otro estudiante.', 'success')
      return
    } catch (error) {
      console.error('Error al confirmar el match:', error)
    }
  }

  const handleRejectMatch = async () => {
    if (!window.confirm('¿Rechazar este match? El match y las dos solicitudes quedarán cancelados.')) return
    try {
      await cancelMatch(match.matchId)
      notify('Has rechazado el match. Ambas solicitudes quedaron canceladas.', 'success')
    } catch (error) {
      console.error('Error al rechazar el match:', error)
    }
  }

  const currentStudentConfirmed = isEstudianteA ? match.confirmadoPorA : match.confirmadoPorB

  return (
    <Card>
      <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <NotificationsActiveIcon /> Tienes un match disponible 
      </Typography>
      <Typography variant="body1">
        Materia: {match.nombreMateria} {match.codigoMateria}
      </Typography>
      <Typography variant="body1">
        Grupo actual: {match.nombreGrupoA}
      </Typography>
      <Typography variant="body1">
        Grupo deseado: {match.nombreGrupoB}
      </Typography>
      { isEstudianteA ? (<Typography variant="body1">Eres el estudiante A</Typography>) : <Typography variant="body1">Eres el estudiante B</Typography> }
      <Typography variant="body1">
        Estudiante A confirmado: {match.confirmadoPorA ? 'Sí' : 'No'}
      </Typography>
      <Typography variant="body1">
        Estudiante B confirmado: {match.confirmadoPorB ? 'Sí' : 'No'}
      </Typography>
      <Typography variant="body1">
        Estado del match: {match.estado}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleConfirmMatch}
          disabled={currentStudentConfirmed || match.estado !== 'ACTIVO'}
        >
          <RecommendIcon /> {currentStudentConfirmed ? 'Confirmación enviada' : 'Confirmar match'}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleRejectMatch}
          disabled={match.estado !== 'ACTIVO'}
        >
          Rechazar match
        </Button>
      </Stack>
    </Card>
  )

}

export default MatchCard
