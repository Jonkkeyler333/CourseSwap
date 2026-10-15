import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import AuthPage from './pages/AuthPage'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './components/MainLayout'
import NotFoundPage from './pages/NotFoundPage'
import DashboardPage from './pages/DashboardPage'


const RootRoute = () => {
  const { user, isLoading, isError } = useAuth()
  return (
    <ProtectedRoute user={user} isLoading={isLoading} isError={isError}>
      <MainLayout user={user} />
    </ProtectedRoute>
  )
}

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/',
    element: <RootRoute />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'solicitudes',
        element: <h1>Mis Solicitudes</h1>
      },
      {
        path: 'horario',
        element: <h1>Ajustar matrícula</h1>
      },
      {
        path: 'buscar',
        element: <h1>Buscar intercambios</h1>
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App