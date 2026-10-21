import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useMessage, useType, useOpen, useActions } from '../store/notifyStore'

const Notification = () => {
  const message = useMessage()
  const type = useType()
  const open = useOpen()
  const { clear } = useActions()

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return
    clear()
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000} // Cierra automáticamente a los 4 segundos
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Posición flotante
    >
      <Alert
        onClose={handleClose}
        severity={type || 'info'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Notification