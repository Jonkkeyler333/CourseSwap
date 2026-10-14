import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

const ProtectedRoute = ({ user, isLoading, isError, children }) => {
  const location = useLocation()
  if (isLoading) {
    return (
      <Box sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress/>
      </Box>
    )
  }

  if (isError) {
    return <div>Error loading user data</div>
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }
  return children
}

export default ProtectedRoute