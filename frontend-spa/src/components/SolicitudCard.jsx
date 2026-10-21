import {
  Button,
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
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'

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

const statusActions = {
  PROPUESTA: [
    {
      label: 'Editar solicitud',
      color: 'primary',
    },
    {
      label: 'Cancelar solicitud',
      color: 'error',
    }
  ],
  MATCHED: [
    {
      label: 'Confirmar Match',
      color: 'success',
    },
    {
      label: 'Rechazar Match',
      color: 'error',
    }
  ]
}

const SolicitudCard = ({ solicitud, match = null, isStudentA, onConfirmMatch }) => {
  const status = statusConfig[solicitud.estado] || {
    label: solicitud.estado || 'Sin estado',
    color: 'default',
    icon: <HelpOutlineIcon fontSize="small" />,
  }
  const isConfirmed = solicitud.estado === 'CONFIRMADA'
  const actions = statusActions[solicitud.estado] || []
  const matchStatus = match ? match.estado : null

  // if (match) {
  //   console.log(`Solicitud ID ${solicitud.id} tiene un match con ID ${match.matchId}`)
  //   console.log('Estado del match:', match.estado)
  // }
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
            <Typography variant="h6" component="h3">
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
          {
            match && match.estado === 'ACTIVO' && (
              <>
                <Divider />
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Match ID #{match.matchId} <PersonSearchIcon/>
                </Typography>
                <Typography variant="body1">
                  Estado del match: {matchStatus || 'No disponible'}
                </Typography>
                <Typography variant="body2">
                  {isStudentA ? `Tu confirmación: ${match.confirmadoPorA ? 'Confirmado' : 'Pendiente'}` : `Tu confirmación: ${match.confirmadoPorB ? 'Confirmado' : 'Pendiente'}` }
                </Typography>
                <Typography variant="body2">
                  {isStudentA ? `Confirmación de ${match.nombreEstudianteB} : ${match.confirmadoPorB ? 'Confirmado' : 'Pendiente'}` : `Confirmación de ${match.nombreEstudianteA} : ${match.confirmadoPorA ? 'Confirmado' : 'Pendiente'}` }
                </Typography>
              </>
            )
          }
          <Divider />
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 3 }}
          >
            {actions.map(({ label, color }) => (
              <Button
                key={label}
                variant="contained"
                color={color}
                fullWidth
                onClick={label === 'Confirmar Match'
                  ? () => onConfirmMatch?.(match.matchId, solicitud.id)
                  : undefined}
              >
                {label} {label === 'Confirmar Match' && <ThumbUpIcon sx={{ ml: 1 }} />} {label === 'Rechazar Match' && <ThumbDownIcon sx={{ ml: 1 }} />}
              </Button>
            ))}
          </Stack>

        </Stack>
      </CardContent>
    </Card>
  )
}

export default SolicitudCard
