import { useMemo } from 'react'
import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, Grid, Paper, Stack, Typography,
} from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useMatch } from '../hooks/useMatch'
import { useSolicitudes } from '../hooks/useSolicitudes'
import Notification from '../components/Notification'
import ErrorIcon from '@mui/icons-material/Error'
import MatchCard from '../components/MatchCard'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Link } from 'react-router-dom'
import WavingHandIcon from '@mui/icons-material/WavingHand'

const DashboardPage = () => {
  const { user, isLoading, isError } = useAuth()
  const { matches = [], isLoading: isMatchesLoading } = useMatch()
  const { solicitudesEstudiante = [], isLoading: isSolicitudesLoading } = useSolicitudes(user?.id)

  const stats = useMemo(() => ({
    total: solicitudesEstudiante.length,
    propuestas: solicitudesEstudiante.filter(({ estado }) => estado === 'PROPUESTA').length,
    confirmadas: solicitudesEstudiante.filter(({ estado }) => estado === 'CONFIRMADA').length,
    canceladas: solicitudesEstudiante.filter(({ estado }) => estado === 'CANCELADA').length,
    matchesActivos: matches.filter(({ estado }) => estado === 'ACTIVO').length,
  }), [matches, solicitudesEstudiante])

  if (isLoading) {
    return (
      <Stack alignItems="center" spacing={2} sx={{ py: 10 }}>
        <CircularProgress />
        <Typography color="text.secondary">Preparando tu panel...</Typography>
      </Stack>
    )
  }

  if (isError) {
    return (
      <Alert severity="error" icon={<ErrorIcon />} sx={{ mt: 4 }}>
        Error al cargar la información del usuario. Refresca la página.
      </Alert>
    )
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={3} sx={{ py: { xs: 3, md: 5 } }}>
        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            color: 'common.white',
            backgroundColor: 'primary.main',
          }}
        >
          <Typography variant="overline" sx={{ opacity: 0.8 }}>
            Panel de estudiante · {user?.codigo || 'Sin código'}
          </Typography>
          <Typography variant="h3" component="h1" fontWeight={800} sx={{ mt: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
            Hola, {user?.nombre || 'estudiante'} <WavingHandIcon sx={{ fontSize: '2rem' }} />
          </Typography>
          <Typography sx={{ mt: 1, maxWidth: 680, opacity: 0.9 }}>
            Gestiona tus solicitudes y encuentra intercambios de grupo compatibles desde un mismo lugar.
          </Typography>
          <Button
            component={Link}
            to="/solicitudes"
            variant="contained"
            color="secondary"
            startIcon={<AddCircleIcon />}
            sx={{ mt: 3, color: 'common.white' }}
          >
            Crear solicitud
          </Button>
        </Paper>

        <Grid container spacing={2}>
          {[
            { label: 'Solicitudes totales', value: stats.total, icon: <AssignmentOutlinedIcon />, color: 'primary.main' },
            { label: 'En búsqueda', value: stats.propuestas, icon: <HourglassEmptyIcon />, color: 'warning.main' },
            { label: 'Matches activos', value: stats.matchesActivos, icon: <SwapHorizIcon />, color: 'info.main' },
            { label: 'Intercambios completados', value: stats.confirmadas, icon: <CheckCircleIcon />, color: 'success.main' },
          ].map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
                  <Typography variant="h4" fontWeight={800}>{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h5" fontWeight={700}>Matches disponibles</Typography>
                  <Typography variant="body2" color="text.secondary">Revisa y confirma tus intercambios pendientes.</Typography>
                </Box>
              </Stack>
              {isMatchesLoading ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">Cargando matches...</Typography>
                </Stack>
              ) : stats.matchesActivos === 0 ? (
                <>
                  <Alert severity="info">No tienes matches activos por ahora.</Alert>
                  <Button component={Link} variant="contained" to="/solicitudes" sx={{ mt: 2 }}>Ver solicitudes</Button>
                </>
              ) : (
                <Stack spacing={2}>
                  {matches.filter(({ estado }) => estado === 'ACTIVO').map((match) => (
                    <MatchCard key={match.matchId} match={match} user={user} />
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, height: '100%' }}>
              <Typography variant="h5" fontWeight={700}>Resumen de actividad</Typography>
              <Stack spacing={2.5} sx={{ mt: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Solicitudes canceladas: {stats.canceladas}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Solicitudes confirmadas: {stats.confirmadas}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Estado de solicitudes: </Typography>
                  <Typography fontWeight={700}>
                    {isSolicitudesLoading ? 'Cargando...' : stats.total ? 'Activo' : 'Sin actividad'}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
      <Notification />
    </Container>
  )
}

export default DashboardPage