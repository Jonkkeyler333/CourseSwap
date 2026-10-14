import { Button, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin({ email, password })
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" component="h2">
        Inicia Sesión
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
        <Button type="submit" variant="contained">
          Login
        </Button>
      </form>
    </Container>
  )
}

export default LoginForm