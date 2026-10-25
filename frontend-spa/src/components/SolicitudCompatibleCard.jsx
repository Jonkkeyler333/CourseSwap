import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import SwapHoriz from '@mui/icons-material/SwapHoriz'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'

const formatDate = (value) => {
  if (!value) return 'Fecha no disponible'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : date.toLocaleDateString()
}

const SolicitudCompatibleCard = ({ solicitud, onAccept, isAccepting }) => (
  <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
          <Chip label="Propuesta compatible" color="info" variant="outlined" size="small" />
          <Typography variant="body2" color="text.secondary">
            Solicitud ID #{solicitud.id}
          </Typography>
        </Stack>

        <div>
          <Typography variant="h6" component="h2" fontWeight={700}>
            {solicitud.nombreMateria || 'Materia sin nombre'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Código: {solicitud.codigoMateria || 'No disponible'}
          </Typography>
        </div>

        <Divider />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 3 }} alignItems={{ sm: 'center' }}>
          <div>
            <Typography variant="overline" color="text.secondary">Grupo actual</Typography>
            <Typography fontWeight={600}>{solicitud.nombreGrupoActual || 'No disponible'}</Typography>
          </div>
          <SwapHoriz sx={{ color: 'text.secondary' }} />
          <div>
            <Typography variant="overline" color="text.secondary">Grupo deseado</Typography>
            <Typography fontWeight={600}>{solicitud.nombreGrupoDeseado || 'No disponible'}</Typography>
          </div>
        </Stack>

        <Divider />

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonSearchIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Publicada por {solicitud.nombreEstudiante || 'estudiante'}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {formatDate(solicitud.fechaSolicitud)}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          startIcon={<SwapHoriz />}
          onClick={() => onAccept(solicitud)}
          disabled={isAccepting}
          sx={{ alignSelf: { sm: 'flex-end' }, borderRadius: 2 }}
        >
          Hacer match
        </Button>
      </Stack>
    </CardContent>
  </Card>
)

export default SolicitudCompatibleCard
