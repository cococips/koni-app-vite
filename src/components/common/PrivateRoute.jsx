import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function PrivateRoute({ children, allowedRoles }) {
  const { isLoggedIn, user } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const redirect = {
      admin:   '/admin/dashboard',
      pelatih: '/dashboard/pelatih',
      atlet:   '/dashboard/atlet',
      wasit:   '/dashboard/wasit',
    }
    return <Navigate to={redirect[user?.role] || '/'} replace />
  }

  return children
}
