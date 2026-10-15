import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import { Typography, Button, TextField} from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const FormDialog = ({ user }) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formJson = Object.fromEntries(formData.entries())
    const email = formJson.email
    console.log(email)
    handleClose()
  }

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body2" color="text.secondary">
              Ingresa los datos para crear una nueva solicitud de cambio de grupo
            </Typography>
          </DialogContentText>
          <form onSubmit={handleSubmit} id="new-solicitud-form">

          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="new-solicitud-form" variant="contained">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FormDialog