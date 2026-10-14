import { Button, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [codigo, setCodigo] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onRegister({ email, password, confirmPassword, nombre, apellido, codigo })
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" component="h2">
        Registrate
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          variant="filled"
          label="correo institucional"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          variant="filled"
          label="contraseña"
          type="password"
          value={password}
          required
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          variant="filled"
          label="confirmar contraseña"
          type="password"
          value={confirmPassword}
          required
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          variant="filled"
          label="nombres"
          type="text"
          value={nombre}
          required
          onChange={(event) => setNombre(event.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          variant="filled"
          label="apellidos"
          type="text"
          value={apellido}
          required
          onChange={(event) => setApellido(event.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          variant="filled"
          label="código"
          type="number"
          value={codigo}
          required
          onChange={(event) => setCodigo(event.target.value)}
        />
        <Button type="submit" variant="contained">
          Register
        </Button>
      </form>
    </Container>
  )
}

export default RegisterForm