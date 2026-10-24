import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AppBar,  Container, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useMediaQuery, } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/CourseSwap_transparent.png'

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Solicitudes', to: '/solicitudes' },
  { label: 'Matrícula', to: '/horario' },
  { label: 'Buscar intercambios', to: '/buscar' },
]

const MainLayout = ({ user }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/auth')
    setDrawerOpen(false)
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'primary.dark',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Container maxWidth="lg" disableGutters={false}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              <Box component="img" src={logo} alt="CourseSwap logo" sx={{ height: { xs: 36, sm: 50 } }} />
              <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.25rem', sm: '2rem' } }}>
                CourseSwap
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton color="inherit" edge="end" onClick={() => setDrawerOpen(true)} aria-label="abrir menú">
                <MenuIcon />
              </IconButton>
            ) : (
              <>
                {navLinks.map((link) => (
                  <Button
                    key={link.to}
                    color="inherit"
                    component={NavLink}
                    to={link.to}
                    sx={{
                      ml: 1,
                      px: 1.5,
                      borderRadius: 2,
                      color: 'inherit',
                      '&.active': {
                        color: 'common.white',
                        bgcolor: 'rgba(255, 255, 255, 0.16)',
                        fontWeight: 700,
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}

                <Typography variant="body1" component="span" sx={{ ml: 2, mr: 2 }}>
                  {user ? `Bienvenido, ${user.nombre}` : 'No has iniciado sesión'}
                </Typography>

                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    ml: 1,
                    borderRadius: 2,
                    borderColor: 'rgba(255, 255, 255, 0.55)',
                    '&:hover': {
                      borderColor: 'common.white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Salir
                </Button>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <Typography variant="body2" sx={{ p: 2 }}>
            {user ? `Bienvenido, ${user.nombre}` : 'No has iniciado sesión'}
          </Typography>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={link.to}
                  onClick={() => setDrawerOpen(false)}
                  selected={location.pathname === link.to}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    '&.Mui-selected': {
                      color: 'primary.main',
                      bgcolor: 'action.selected',
                    },
                  }}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Salir" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="lg">
        <main>
          <Outlet />
        </main>
      </Container>
    </>
  )
}

export default MainLayout