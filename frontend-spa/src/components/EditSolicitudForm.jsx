import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMatricula } from '../hooks/useMatricula'
import { useMateriaHorarios } from '../hooks/useMateriaHorarios'
import { useSolicitudes } from '../hooks/useSolicitudes'
import EditIcon from '@mui/icons-material/Edit'

const EditSolicitudForm = ({ user, solicitud }) => {
  const [open, setOpen] = useState(false)
  const [grupoNuevoId, setGrupoNuevoId] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('error')
  const { matriculaEstudiante, isLoading: isLoadingMatricula } = useMatricula(user?.id)
  const { updateSolicitud } = useSolicitudes(user?.id)

  // como voy a actualizar el grupo de una solicitud cuando esta propuesta, basta con obtener los horarios a partir del codigo de la materia de la solicitud, y filtrar los grupos que no sean el grupo actual de la solicitud

  const { horarios, isLoading: isLoadingHorarios, isError: isErrorHorarios } = useMateriaHorarios(solicitud?.materiaCodigo)
  console.log(horarios, 'horarios')
  console.log(solicitud, 'solicitud')

  const targetGroups = useMemo(() => {
    const groups = new Map()
    horarios
      .filter((horario) => ( String(horario.idGrupo) !== String(solicitud.grupoActual) && String(horario.idGrupo) !== String(solicitud.grupoDeseado) )) // no tiene sentido que se quiera cambiar a un grupo que ya es el actual o al que ya se propuso
      .forEach((horario) => {
        if (!groups.has(horario.idGrupo)) {
          groups.set(horario.idGrupo, horario)
        }
      })
    return [...groups.values()]
  }, [horarios, solicitud.grupoActual, solicitud.grupoDeseado])


  const handleClickOpen = () => {
    setMessage(null)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setGrupoNuevoId('')
    setMessage(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!grupoNuevoId ) {
      setMessageType('error')
      setMessage('Completa el código, la materia y el grupo deseado.')
      return
    }

    try {
      const updatedSolicitud = await updateSolicitud(
        solicitud.id,
        Number(grupoNuevoId),
      )
      setMessageType('success')
      setMessage(
        `Solicitud actualizada exitosamente. ID: ${updatedSolicitud.id}. Estado: ${updatedSolicitud.estado}.`,
      )
      if (updatedSolicitud.estado === 'MATCHED') {
        setMessage(
          `¡Match encontrado! Tu solicitud #${updatedSolicitud.id} ya tiene una coincidencia. Revisa la sección de solicitudes para confirmar el intercambio.`,
        )
      }
      setGrupoNuevoId('')
    } catch (error) {
      setMessageType('error')
      setMessage(
        error.response?.data?.message ||
        error.message ||
        'No se pudo crear la solicitud. Intenta nuevamente.',
      )
    }
  }

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} sx={{ mb: 4 }}>
        Actualizar <EditIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Actualizar solicitud con ID {solicitud?.id}</DialogTitle>
        <DialogContent sx={{ minWidth: { sm: 520 } }}>
          <Typography variant="body2" color="text.secondary">
            Ingresa el nuevo grupo al que deseas cambiarte para la materia {solicitud?.materiaCodigo} - {solicitud?.nombreMateria}. El grupo actual de tu solicitud es {solicitud?.nombreGrupoActual}.
          </Typography>
          <form onSubmit={handleSubmit} id="new-solicitud-form">
            <Stack spacing={2} sx={{ mt: 3 }}>
              {message && <Alert severity={messageType}>{message}</Alert>}
              {isLoadingMatricula ? (
                <CircularProgress size={24} />
              ) : !matriculaEstudiante ? (
                <Alert severity="error">
                  No se pudieron cargar tus matrículas.
                </Alert>
              ) : (
                <FormControl fullWidth required>
                  {/* <InputLabel id="solicitud-materia-label">Materia</InputLabel> */}
                  <TextField
                    label="Materia"
                    value={`${solicitud?.materiaCodigo}: ${solicitud?.nombreMateria}`}
                    InputProps={{ readOnly: true }}
                  />
                </FormControl>
              )}
              { !isLoadingHorarios && !isErrorHorarios && targetGroups.length === 0 && (
                <Alert severity="info">
                  No hay mas grupos disponibles para esta materia.
                </Alert>
              )}
              {!isLoadingHorarios && !isErrorHorarios && targetGroups.length > 0 && (
                <FormControl fullWidth required>
                  <InputLabel id="solicitud-grupo-label">Grupo deseado</InputLabel>
                  <Select
                    labelId="solicitud-grupo-label"
                    label="Grupo deseado"
                    value={grupoNuevoId}
                    onChange={(event) => setGrupoNuevoId(event.target.value)}
                  >
                    {targetGroups.map((horario) => (
                      <MenuItem key={horario.idGrupo} value={horario.idGrupo}>
                        Grupo {horario.grupo} . El {horario.dia} de {horario.horaInicio}-{horario.horaFin} . Profesor : {horario.profesor}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" form="new-solicitud-form" variant="contained">
            Actualizar solicitud
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditSolicitudForm