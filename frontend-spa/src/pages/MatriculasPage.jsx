import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useAuth } from '../hooks/useAuth'
import { useMatricula } from '../hooks/useMatricula'
import materiasService from '../services/materias'
import matriculaService from '../services/matricula'
import ScheduleTable from '../components/ScheduleTable'
import { DAY_INDEX } from '../constants/constants'

const asList = (value) => {
  if (Array.isArray(value)) return value
  return value?.content || value?.items || value?.data || []
}

const getDayIndex = (schedule) => {
  const day = schedule.dia ?? schedule.day ?? schedule.diaSemana ?? schedule.dayOfWeek
  if (typeof day === 'number') return day >= 1 && day <= 7 ? day - 1 : day
  return DAY_INDEX[String(day || '').toLowerCase()] ?? 0
}

const getHour = (schedule, boundary) => {
  const value = boundary === 'start'
    ? schedule.horaInicio ?? schedule.hora_inicio ?? schedule.startTime
    : schedule.horaFin ?? schedule.hora_fin ?? schedule.endTime
  return Number.parseInt(String(value || '').split(':')[0], 10)
}

const MatriculasPage = () => {
  const { user } = useAuth()
  const {
    matriculaEstudiante,
    isLoading: isEnrollmentLoading,
    isError: isEnrollmentError,
  } = useMatricula(user?.id)
  const enrollments = asList(matriculaEstudiante)
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEnrollment, setEditingEnrollment] = useState(null)
  const [subjectId, setSubjectId] = useState('')
  const [groupId, setGroupId] = useState('')
  const [formError, setFormError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const { data: availableSubjects = [] } = useQuery({
    queryKey: ['available-subjects', user?.id],
    queryFn: async () => asList(await materiasService.getAvailableMaterias(user.id)),
    enabled: Boolean(user?.id) && dialogOpen && !editingEnrollment,
    staleTime: 5 * 60 * 1000,
  })

  const { data: groups = [], isLoading: isGroupsLoading } = useQuery({
    queryKey: ['subject-groups', subjectId],
    queryFn: async () => asList(await materiasService.getGroupsByMateria(subjectId)),
    enabled: Boolean(subjectId) && dialogOpen,
  })

  const { data: selectedSchedule = [] } = useQuery({
    queryKey: ['group-schedule', groupId],
    queryFn: async () => asList(await materiasService.getGroupSchedules(groupId)),
    enabled: Boolean(groupId) && dialogOpen,
  })

  const refreshEnrollments = () => {
    queryClient.invalidateQueries({ queryKey: ['matricula', user?.id] })
    queryClient.invalidateQueries({ queryKey: ['matricula-schedules'] })
  }

  const saveMutation = useMutation({
    mutationFn: (data) => editingEnrollment
      ? matriculaService.updateMatricula(editingEnrollment.id, { grupoId: Number(data.groupId) })
      : matriculaService.createMatricula({
        materiaId: Number(data.subjectId),
        grupoId: Number(data.groupId),
        estudianteId: Number(user.id),
      }),
    onSuccess: () => {
      refreshEnrollments()
      closeDialog()
    },
    onError: (error) => setFormError(error.response?.data?.message || 'No se pudo guardar la matrícula.'),
  })

  const deleteMutation = useMutation({
    mutationFn: matriculaService.deleteMatricula,
    onSuccess: refreshEnrollments,
    onError: (error) => setDeleteError(error.response?.data?.message || 'No se pudo eliminar la matrícula.'),
  })

  const openCreateDialog = () => {
    setEditingEnrollment(null)
    setSubjectId('')
    setGroupId('')
    setFormError('')
    setDialogOpen(true)
  }

  const openEditDialog = (enrollment) => {
    setEditingEnrollment(enrollment)
    setSubjectId(String(enrollment.materiaId || ''))
    setGroupId(String(enrollment.grupoId || ''))
    setFormError('')
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditingEnrollment(null)
    setSubjectId('')
    setGroupId('')
    setFormError('')
  }

  const handleSave = () => {
    if ((!editingEnrollment && !subjectId) || !groupId) {
      setFormError('Selecciona una materia y un grupo antes de continuar.')
      return
    }
    saveMutation.mutate({ subjectId, groupId })
  }

  const {
    data: schedulesByEnrollment = [],
    isLoading: isScheduleLoading,
    isError: isScheduleError,
  } = useQuery({
    queryKey: ['matricula-schedules', enrollments.map(({ id, grupoId }) => `${id}-${grupoId}`).join(',')],
    queryFn: async () => Promise.all(
      enrollments.map(async (enrollment) => ({
        ...enrollment,
        schedule: asList(await materiasService.getGroupSchedules(enrollment.grupoId)),
      })),
    ),
    enabled: enrollments.length > 0,
    staleTime: 5 * 60 * 1000,
  })

  const calendar = useMemo(() => {
    const cells = new Map()
    schedulesByEnrollment.forEach((enrollment) => {
      enrollment.schedule.forEach((schedule) => {
        const startHour = getHour(schedule, 'start')
        const endHour = getHour(schedule, 'end')
        const lastHour = Number.isNaN(endHour) || endHour <= startHour ? startHour + 1 : endHour
        for (let hour = startHour; hour < lastHour; hour += 1) {
          const key = `${hour}-${getDayIndex(schedule)}`
          const courses = cells.get(key) || []
          courses.push({
            enrollment,
            colorIndex: schedulesByEnrollment.indexOf(enrollment),
          })
          cells.set(key, courses)
        }
      })
    })
    return cells
  }, [schedulesByEnrollment])

  if (isEnrollmentLoading) {
    return <LoadingState message="Cargando tus matrículas..." />
  }

  if (isEnrollmentError) {
    return <Alert severity="error" sx={{ mt: 4 }}>No se pudieron cargar tus matrículas. Intenta nuevamente más tarde.</Alert>
  }

  return (
    <Stack spacing={4} sx={{ py: { xs: 3, md: 5 } }}>
      <Box>
        <Typography variant="overline" color="primary" fontWeight={700}>Gestión académica</Typography>
        <Typography variant="h3" component="h1" fontWeight={800} sx={{ mt: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
          Matrículas
        </Typography>
        <Typography color="text.secondary">Consulta tu horario semanal y las asignaturas que tienes matriculadas.</Typography>
        <Button variant="contained" onClick={openCreateDialog} sx={{ alignSelf: 'flex-start', mt: 2 }}>
          Añadir matrícula
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          borderRadius: 4,
          border: 1,
          borderColor: 'divider',
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.98))'
            : 'linear-gradient(145deg, #ffffff, #f4f8fc)',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 18px 45px rgba(0, 0, 0, 0.25)'
            : '0 18px 45px rgba(35, 75, 110, 0.12)',
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            color: 'primary.contrastText',
            background: (theme) => `linear-gradient(110deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ display: 'grid', placeItems: 'center', p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.16)' }}>
              <CalendarMonthIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800}>Tu horario de clases</Typography>
              <Typography variant="body2" sx={{ opacity: 0.78 }}>Organiza tu semana de un vistazo</Typography>
            </Box>
          </Stack>
          <AccessTimeIcon sx={{ display: { xs: 'none', sm: 'block' }, opacity: 0.7 }} />
        </Box>
        {isScheduleLoading ? (
          <Box sx={{ p: 3 }}>
            <LoadingState message="Cargando horarios..." compact />
          </Box>
        ) : isScheduleError ? (
          <Alert severity="warning" sx={{ m: 2 }}>No se pudieron cargar todos los horarios de tus grupos.</Alert>
        ) : (
          <Box sx={{ p: { xs: 1, md: 2 } }}>
            <ScheduleTable calendar={calendar} />
          </Box>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, pb: 1 }}>
          <Typography variant="h5" fontWeight={700}>Asignaturas matriculadas</Typography>
        </Box>
        {enrollments.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>No tienes asignaturas matriculadas actualmente.</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Código', 'Asignatura', 'Grupo', 'Profesor', 'Acciones'].map((heading) => (
                    <TableCell key={heading} sx={{ fontWeight: 700 }}>{heading}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id} hover>
                    <TableCell>{enrollment.materiaCodigo || '--'}</TableCell>
                    <TableCell>{enrollment.materiaNombre || 'Materia'}</TableCell>
                    <TableCell>{enrollment.grupoNombre || '--'}</TableCell>
                    <TableCell>{enrollment.grupoProfesor || '--'}</TableCell>
                    <TableCell>
                      <Button size="small" variant="contained" onClick={() => openEditDialog(enrollment)} sx={{ mr: 1 }}>Editar</Button>
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => {
                          setDeleteError('')
                          if (window.confirm('¿Deseas eliminar esta matrícula?')) deleteMutation.mutate(enrollment.id)
                        }}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {deleteError && <Alert severity="error">{deleteError}</Alert>}
      <EnrollmentDialog
        open={dialogOpen}
        editingEnrollment={editingEnrollment}
        subjects={availableSubjects}
        groups={groups}
        subjectId={subjectId}
        groupId={groupId}
        schedule={selectedSchedule}
        isGroupsLoading={isGroupsLoading}
        formError={formError}
        isSaving={saveMutation.isPending}
        onSubjectChange={(value) => {
          setSubjectId(value)
          setGroupId('')
        }}
        onGroupChange={setGroupId}
        onClose={closeDialog}
        onSave={handleSave}
      />
    </Stack>
  )
}

const EnrollmentDialog = ({
  open,
  editingEnrollment,
  subjects,
  groups,
  subjectId,
  groupId,
  schedule,
  isGroupsLoading,
  formError,
  isSaving,
  onSubjectChange,
  onGroupChange,
  onClose,
  onSave,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{editingEnrollment ? 'Editar matrícula' : 'Añadir matrícula'}</DialogTitle>
    <DialogContent>
      <Stack spacing={2} sx={{ pt: 1 }}>
        {formError && <Alert severity="error">{formError}</Alert>}
        {!editingEnrollment && (
          <Select
            value={subjectId}
            displayEmpty
            onChange={(event) => onSubjectChange(event.target.value)}
            fullWidth
          >
            <MenuItem value="" disabled>Selecciona una materia</MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject.id ?? subject.materiaId} value={subject.id ?? subject.materiaId}>
                {(subject.codigo ?? subject.materiaCodigo) || '--'} - {subject.nombre ?? subject.materiaNombre}
              </MenuItem>
            ))}
          </Select>
        )}
        {editingEnrollment && (
          <Typography color="text.secondary">
            {editingEnrollment.materiaCodigo} - {editingEnrollment.materiaNombre}
          </Typography>
        )}
        <Select
          value={groupId}
          displayEmpty
          disabled={(!editingEnrollment && !subjectId) || isGroupsLoading}
          onChange={(event) => onGroupChange(event.target.value)}
          fullWidth
        >
          <MenuItem value="" disabled>
            {isGroupsLoading ? 'Cargando grupos...' : 'Selecciona un grupo'}
          </MenuItem>
          {groups.map((group) => (
            <MenuItem key={group.id ?? group.grupoId} value={group.id ?? group.grupoId}>
              {group.nombre ?? group.nombreGrupo ?? group.grupoNombre} - {group.profesor ?? group.nombreProfesor ?? 'Profesor pendiente'}
            </MenuItem>
          ))}
        </Select>
        {groupId && (
          <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>HORARIO</Typography>
            {schedule.length > 0
              ? schedule.map((item, index) => <Typography key={`${item.dia}-${index}`} variant="body2">{item.dia || item.day}: {item.horaInicio || item.startTime} - {item.horaFin || item.endTime}</Typography>)
              : <Typography variant="body2" color="text.secondary">No hay horarios registrados para este grupo.</Typography>}
          </Box>
        )}
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="contained" onClick={onSave} disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
    </DialogActions>
  </Dialog>
)

const LoadingState = ({ message, compact = false }) => (
  <Stack alignItems="center" spacing={1} sx={{ py: compact ? 3 : 8 }}>
    <CircularProgress size={compact ? 24 : 32} />
    <Typography color="text.secondary">{message}</Typography>
  </Stack>
)

export default MatriculasPage
