import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    // Simpan halaman tujuan agar setelah login bisa redirect ke sana
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
