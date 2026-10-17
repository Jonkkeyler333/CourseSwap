import {
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'

const statusConfig = {
  PROPUESTA: {
    label: 'Propuesta',
    color: 'warning',
    icon: <HourglassEmptyIcon fontSize="small" />,
  },
  MATCHED: {
    label: 'Match encontrado',
    color: 'info',
    icon: <SwapHorizIcon fontSize="small" />,
  },
  CONFIRMADA: {
    label: 'Confirmada',
    color: 'success',
    icon: <CheckCircleIcon fontSize="small" />,
  },
  CANCELADA: {
    label: 'Cancelada',
    color: 'error',
    icon: <CancelOutlinedIcon fontSize="small" />,
  },
}

const SolicitudCard = ({ solicitud, actions = null }) => {
  const status = statusConfig[solicitud.estado] || {
    label: solicitud.estado || 'Sin estado',
    color: 'default',
    icon: <HelpOutlineIcon fontSize="small" />,
  }
  const isConfirmed = solicitud.estado === 'CONFIRMADA'

  return (
    <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifycontent="space-between"
            alignitems={{ xs: 'flex-start', sm: 'center' }}
            gap={1}
          >
            <Chip
              icon={status.icon}
              label={status.label}
              color={status.color}
              variant="outlined"
              size="small"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1}}>
              Solicitud ID #{solicitud.id}
            </Typography>
          </Stack>

          <div>
            <Typography variant="h6" component="h3" fontWeight={700}>
              {solicitud.nombreMateria || 'Materia sin nombre'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Código: {solicitud.materiaCodigo || 'No disponible'}
            </Typography>
          </div>

          <Divider />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 3 }}
          >
            <div>
              <Typography variant="overline" color="text.secondary">
                {isConfirmed ? 'Grupo anterior' : 'Grupo actual'}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {solicitud.nombreGrupoActual || 'No disponible'}
              </Typography>
            </div>
            <SwapHorizIcon color="action" sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }} />
            <div>
              <Typography variant="overline" color="text.secondary">
                {isConfirmed ? 'Grupo actual' : 'Grupo deseado'}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {solicitud.nombreGrupoDeseado || 'No disponible'}
              </Typography>
            </div>
          </Stack>

          {actions}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default SolicitudCard
