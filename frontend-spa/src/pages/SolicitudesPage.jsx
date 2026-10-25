import { Alert, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import SolicitudCard from '../components/SolicitudCard'
import SolicitudForm from '../components/SolicitudForm'
import { useAuth } from '../hooks/useAuth'
import { useMatch } from '../hooks/useMatch'
import { useSolicitudes } from '../hooks/useSolicitudes'
import Notification from '../components/Notification'
import {useActions } from '../store/notifyStore'
import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

const SolicitudesPage = () => {
  const { user } = useAuth()
  const { solicitudesEstudiante, isLoading, isError, deleteSolicitud } = useSolicitudes(user?.id)
  const { matches: matchesEstudiante, confirmMatch, cancelMatch } = useMatch()
  const { notify } = useActions()
  const queryClient = useQueryClient()

  const matchSolicitudes = useMemo( () => {
    const mapa = new Map()
    matchesEstudiante?.forEach( match => {
      mapa.set(match.solicitudAId, match)
      mapa.set(match.solicitudBId, match)
    })
    return mapa
  }, [matchesEstudiante])


  const handleConfirmMatch = async (matchId, solicitudId) => {
    const match = matchesEstudiante.find(
      ({ matchId: currentMatchId }) => String(currentMatchId) === String(matchId),
    )
    if (!match) {
      notify('No se encontró el match que intentas confirmar.', 'error')
      return
    }
    const isEstudianteA = String(match.solicitudAId) === String(solicitudId)
    const confirmationField = isEstudianteA ? 'confirmadoPorA' : 'confirmadoPorB'

    if (match[confirmationField]) {
      notify('Ya has confirmado este match. Espera al otro estudiante.', 'info')
      return
    }
    try {
      const updatedMatch = await confirmMatch(match.matchId)
      // se cual sea el que confirmo, se debe forzar el refresh de las solicitudes para reflejar el cambio de grupo
      await queryClient.invalidateQueries({ queryKey: ['solicitudes', user?.id] })
      if (updatedMatch?.estado === 'CONFIRMADO') {        
        notify('¡Match confirmado! El cambio de grupo se realizó correctamente.', 'success') 
        return
      }
      notify('Tu confirmación fue registrada. Ahora debes esperar al otro estudiante.', 'success')
    } catch {
      notify('No se pudo confirmar el match. Intenta nuevamente.', 'error')
    }
  }

  const handleCancelSolicitud = async (solicitudId) => {
    try {
      const confirm = window.confirm('¿Estás seguro de que deseas cancelar esta solicitud? Esta acción no se puede deshacer.')
      if (!confirm) return
      await deleteSolicitud(solicitudId)
      notify('Se ha cancelado correctamente tu solicitud', 'success')
    } catch (error) {
      notify('Ha ocurrido un error al cancelar la solicitud, intentalo otra vez', 'error')
      console.error(error)
    }
  }

  const handleRejectMatch = async (matchId) => {
    const confirm = window.confirm('¿Rechazar este match? El match y las dos solicitudes quedarán cancelados.')
    if (!confirm) return
    try {
      await cancelMatch(matchId)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['match'] }),
        queryClient.invalidateQueries({ queryKey: ['solicitudes', user?.id] }),
      ])
      notify('Has rechazado el match. Ambas solicitudes quedaron canceladas.', 'success')
    } catch (error) {
      notify(error.response?.data?.message || 'No se pudo rechazar el match. Intenta nuevamente.', 'error')
    }
  }

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
      <Notification/>

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
          {
            [...solicitudesEstudiante].sort((a, b) => b.id - a.id).map((solicitud) =>
            {
              const match = matchSolicitudes.get(solicitud.id) ?? null
              const isStudentA = match?.solicitudAId === solicitud.id
              return (
                <Grid key={solicitud.id} size={{ xs: 12, md: 6 }}>
                  <SolicitudCard
                    solicitud={solicitud}
                    match={match}
                    isStudentA={isStudentA}
                    actions={{
                      onConfirmMatch: handleConfirmMatch,
                      onCancelSolicitud: handleCancelSolicitud,
                      onRejectMatch: handleRejectMatch,
                    }}
                  />
                </Grid>
              )
            })
          }
        </Grid>
      )}
    </Container>
  )
}

export default SolicitudesPage


//Ejemplo de respuesta del endpoint de matches del estudiante
//   {
//     "matchId": 1,
//     "solicitudAId": 4,
//     "solicitudBId": 3,
//     "estado": "CONFIRMADO",
//     "codigoMateria": "22955",
//     "confirmadoPorA": true,
//     "confirmadoPorB": true,
//     "nombreMateria": "Estruc. de datos y análisis de alg.",
//     "nombreGrupoA": "E2",
//     "nombreGrupoB": "E1",
//     "nombreEstudianteA": null,
//     "nombreEstudianteB": null
//   },
//   {
//     "matchId": 2,
//     "solicitudAId": 9,
//     "solicitudBId": 8,
//     "estado": "ACTIVO",
//     "codigoMateria": "22960",
//     "confirmadoPorA": false,
//     "confirmadoPorB": false,
//     "nombreMateria": "Base de Datos II",
//     "nombreGrupoA": "G2",
//     "nombreGrupoB": "G1",
//     "nombreEstudianteA": null,
//     "nombreEstudianteB": null
//   }
