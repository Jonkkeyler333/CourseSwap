import { Alert, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import SolicitudCard from '../components/SolicitudCard'
import SolicitudForm from '../components/SolicitudForm'
import { useAuth } from '../hooks/useAuth'
import { useSolicitudes } from '../hooks/useSolicitudes'

const SolicitudesPage = () => {
  const { user } = useAuth()
  const { solicitudesEstudiante, isLoading, isError } = useSolicitudes(user?.id)

  return (
    <Container maxWidth="lg">
      <Stack spacing={1} sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="overline" color="primary" fontWeight={700}>
          Gestión de intercambios
        </Typography>
        <Typography variant="h3" component="h1" fontWeight={700}>
          Mis solicitudes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Consulta tus solicitudes activas o publica una nueva búsqueda de cambio de grupo.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Recuerda que solo puedes tener una solicitud activa por materia.
        </Typography>
        { user && <SolicitudForm user={user} solicitudes={solicitudesEstudiante}/>}
      </Stack>

      {isLoading && (
        <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
          <CircularProgress />
          <Typography color="text.secondary">Cargando tus solicitudes...</Typography>
        </Stack>
      )}

      {isError && (
        <Alert severity="error">
          No se pudieron cargar tus solicitudes. Intenta nuevamente más tarde.
        </Alert>
      )}

      {!isLoading && !isError && solicitudesEstudiante?.length === 0 && (
        <Alert
          icon={<AssignmentOutlinedIcon />}
          severity="info"
          sx={{ borderRadius: 3 }}
        >
          Aún no tienes solicitudes. Cuando publiques una búsqueda de cambio,
          aparecerá aquí.
        </Alert>
      )}

      {!isLoading && !isError && solicitudesEstudiante?.length > 0 && (
        <Grid container spacing={3} sx={{ pb: 5 }}>
          {solicitudesEstudiante.sort((a, b) => b.id - a.id).map((solicitud) => (
            <Grid key={solicitud.id} size={{ xs: 12, md: 6 }}>
              <SolicitudCard solicitud={solicitud} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default SolicitudesPage