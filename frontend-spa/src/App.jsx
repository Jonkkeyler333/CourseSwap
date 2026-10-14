import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import AuthPage from './pages/AuthPage'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './components/MainLayout'


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
    children: [
      {
        index: true,
        element: <h1>Bienvenido a la aplicación CourseSwap</h1>
      },
    ]
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App