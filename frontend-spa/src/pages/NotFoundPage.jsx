import { Container, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const NotFoundPage = () => {
  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        404 - Página no encontrada
        <SearchIcon />
      </Typography>
      <Typography variant="body1">
        Lo sentimos, la página que estás buscando no existe.
      </Typography>
    </Container>
  )
}

export default NotFoundPage