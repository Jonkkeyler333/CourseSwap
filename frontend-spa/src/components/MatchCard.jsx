import { useMatch } from '../hooks/useMatch'
import { Card } from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { Button, Typography } from '@mui/material'
import { useActions } from '../store/notifyStore'
import RecommendIcon from '@mui/icons-material/Recommend'

// componente para mostrar tarjetas de matches en el dashboard general
const MatchCard = ({ match, user }) => {
  const { confirmMatch } = useMatch()
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

      <Button variant="contained" color="success" onClick={handleConfirmMatch}>
        <RecommendIcon /> Confirmar Match
      </Button>        
    </Card>
  )

}

export default MatchCard