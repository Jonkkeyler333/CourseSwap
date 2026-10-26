import { useState } from 'react'
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import { Link } from 'react-router-dom'
import Notification from '../components/Notification'
import SolicitudCompatibleCard from '../components/SolicitudCompatibleCard'
import { useAuth } from '../hooks/useAuth'
import { useSolicitudBusqueda } from '../hooks/useSolicitudBusqueda'
import { useActions } from '../store/notifyStore'

const BuscarSolicitudesPage = () => {
  const { user } = useAuth()
  const {
    solicitudesCompatibles,
    isLoading,
    isError,
    acceptMatchManual,
    isAccepting,
  } = useSolicitudBusqueda(user?.id)
  const { notify } = useActions()
  const [selectedSolicitud, setSelectedSolicitud] = useState(null)
  const [createdMatch, setCreatedMatch] = useState(null)

  const handleAccept = async () => {
    if (!selectedSolicitud) return
    try {
      const match = await acceptMatchManual(selectedSolicitud.id)
      setCreatedMatch(match)
      setSelectedSolicitud(null)
      notify('Match manual creado. Los dos estudiantes pueden revisarlo en Mis solicitudes.', 'success')
    } catch (error) {
      notify(
        error.response?.data?.message || error.message || 'No se pudo crear el match. Intenta nuevamente.',
        'error',
      )
    }
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={1} sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="overline" color="primary" fontWeight={700}>
          Intercambios compatibles
        </Typography>
        <Typography variant="h3" component="h1" fontWeight={700}>
          Buscar solicitudes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Encuentra solicitudes de las materias de tu matrícula que coinciden con tu grupo actual.
          Al hacer match, ambos podrán revisar y confirmar o rechazar el intercambio desde Mis solicitudes.
        </Typography>
      </Stack>

      <Notification />

      {createdMatch && (
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: 3 }}
          action={(
            <Button color="inherit" component={Link} to="/solicitudes" size="small">
              Ir a Mis solicitudes
            </Button>
          )}
        >
          Match creado para la materia {createdMatch.codigoMateria}. Ya puedes confirmarlo o rechazarlo.
        </Alert>
      )}

      {isLoading && (
        <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
          <CircularProgress />
          <Typography color="text.secondary">Buscando solicitudes compatibles...</Typography>
        </Stack>
      )}

      {isError && !isLoading && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          No se pudieron cargar las solicitudes compatibles. Intenta nuevamente más tarde.
        </Alert>
      )}

      {!isLoading && !isError && solicitudesCompatibles.length === 0 && (
        <Alert icon={<SearchOffIcon />} severity="info" sx={{ borderRadius: 3 }}>
          No hay solicitudes compatibles con tu matrícula en este momento.
        </Alert>
      )}

      {!isLoading && !isError && solicitudesCompatibles.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {solicitudesCompatibles.length} {solicitudesCompatibles.length === 1 ? 'solicitud compatible' : 'solicitudes compatibles'}
          </Typography>
          <Grid container spacing={3} sx={{ pb: 5 }}>
            {solicitudesCompatibles.map((solicitud) => (
              <Grid key={solicitud.id} size={{ xs: 12, md: 6 }}>
                <SolicitudCompatibleCard
                  solicitud={solicitud}
                  onAccept={setSelectedSolicitud}
                  isAccepting={isAccepting}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Dialog open={Boolean(selectedSolicitud)} onClose={() => !isAccepting && setSelectedSolicitud(null)}>
        <DialogTitle>Crear match manual</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Quieres hacer match con la solicitud de {selectedSolicitud?.nombreEstudiante || 'este estudiante'} para {selectedSolicitud?.nombreMateria || 'esta materia'}?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Se creará tu solicitud complementaria. Ambos podrán confirmar o rechazar el match desde Mis solicitudes.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedSolicitud(null)} disabled={isAccepting}>
            Volver
          </Button>
          <Button variant="contained" onClick={handleAccept} disabled={isAccepting}>
            {isAccepting ? 'Creando match...' : 'Hacer match'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default BuscarSolicitudesPage
