import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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

const SolicitudForm = ({ user, solicitudes }) => {
  const [open, setOpen] = useState(false)
  const [materiaId, setMateriaId] = useState('')
  const [grupoNuevoId, setGrupoNuevoId] = useState('')
  const [codigo, setCodigo] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('error')
  const { matriculaEstudiante, isLoading: isLoadingMatricula } = useMatricula(user?.id)
  const { addSolicitud } = useSolicitudes(user?.id)

  console.log(matriculaEstudiante, 'matriculaEstudiante')

  const activeSubjectCodes = useMemo(
    () => new Set(
      (solicitudes || [])
        .filter(({ estado }) => ['PROPUESTA', 'MATCHED'].includes(estado))
        .map(({ materiaCodigo }) => String(materiaCodigo)),
    ),
    [solicitudes],
  )

  // const availableMatriculas = useMemo(
  //   () => (matriculaEstudiante || []).filter(
  //     ({ materiaCodigo }) => !activeSubjectCodes.has(String(materiaCodigo)),
  //   ),
  //   [activeSubjectCodes, matriculaEstudiante],
  // )
  const availableMatriculas = useMemo( () => {
    const rawData = matriculaEstudiante || []
    const data = Array.isArray(rawData) ? rawData : []
    return data.filter(
      ({ materiaCodigo }) => !activeSubjectCodes.has(String(materiaCodigo)),
    )
  }, [matriculaEstudiante, activeSubjectCodes])

  const selectedMatricula = availableMatriculas.find(
    (matricula) => String(matricula.materiaId) === String(materiaId),
  )

  const { horarios, isLoading: isLoadingHorarios, isError: isErrorHorarios } = useMateriaHorarios(selectedMatricula?.materiaCodigo)

  const targetGroups = useMemo(() => {
    const groups = new Map()
    horarios
      .filter((horario) => String(horario.idGrupo) !== String(selectedMatricula?.grupoId))
      .forEach((horario) => {
        if (!groups.has(horario.idGrupo)) {
          groups.set(horario.idGrupo, horario)
        }
      })
    return [...groups.values()]
  }, [horarios, selectedMatricula?.grupoId])

  const handleClickOpen = () => {
    setMessage(null)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setMateriaId('')
    setGrupoNuevoId('')
    setCodigo('')
    setMessage(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedMatricula || !grupoNuevoId || !codigo.trim()) {
      setMessageType('error')
      setMessage('Completa el código, la materia y el grupo deseado.')
      return
    }
    if (codigo.trim() !== user?.codigo) {
      setMessageType('error')
      setMessage('El código ingresado no coincide con tu código de estudiante.')
      return
    }

    try {
      const solicitud = await addSolicitud({
        codigo: codigo.trim(),
        grupoActualId: Number(selectedMatricula.grupoId),
        grupoNuevoId: Number(grupoNuevoId),
        materiaId: Number(selectedMatricula.materiaId),
      })
      setMessageType('success')
      setMessage(
        `Solicitud creada exitosamente. ID: ${solicitud.id}. Estado: ${solicitud.estado}.`,
      )
      if (solicitud.estado === 'MATCHED') {
        setMessage(
          `¡Match encontrado! Tu solicitud #${solicitud.id} ya tiene una coincidencia. Revisa la sección de solicitudes para confirmar el intercambio.`,
        )
      }
      setMateriaId('')
      setGrupoNuevoId('')
      setCodigo('')
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
        Nueva solicitud
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nueva solicitud de cambio</DialogTitle>
        <DialogContent sx={{ minWidth: { sm: 520 } }}>
          <DialogContentText>
            <Typography variant="body2" color="text.secondary">
              Ingresa los datos para crear una nueva solicitud de cambio de grupo
            </Typography>
          </DialogContentText>
          <form onSubmit={handleSubmit} id="new-solicitud-form">
            <Stack spacing={2} sx={{ mt: 3 }}>
              {message && <Alert severity={messageType}>{message}</Alert>}
              <TextField
                label="Código de estudiante"
                value={codigo}
                onChange={(event) => setCodigo(event.target.value)}
                required
                inputProps={{ maxLength: 7 }}
              />
              {isLoadingMatricula ? (
                <CircularProgress size={24} />
              ) : !matriculaEstudiante ? (
                <Alert severity="error">
                  No se pudieron cargar tus matrículas.
                </Alert>
              ) : (
                <FormControl fullWidth required>
                  <InputLabel id="solicitud-materia-label">Materia</InputLabel>
                  <Select
                    labelId="solicitud-materia-label"
                    label="Materia"
                    value={materiaId}
                    onChange={(event) => {
                      setMateriaId(event.target.value)
                      setGrupoNuevoId('')
                      setMessage(null)
                    }}
                  >
                    {availableMatriculas.map((matricula) => (
                      <MenuItem key={matricula.materiaId} value={matricula.materiaId}>
                        {matricula.materiaCodigo}: {matricula.materiaNombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {selectedMatricula && (
                <TextField
                  label="Grupo actual"
                  value={selectedMatricula.grupoNombre}
                  InputProps={{ readOnly: true }}
                />
              )}
              {isLoadingHorarios && <CircularProgress size={24} />}
              {isErrorHorarios && (
                <Alert severity="error">No se pudieron cargar los grupos disponibles.</Alert>
              )}
              {selectedMatricula && !isLoadingHorarios && !isErrorHorarios && (
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
                        {horario.grupo} · {horario.dia} · {horario.horaInicio}-{horario.horaFin} · {horario.profesor}
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
            Crear solicitud
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SolicitudForm