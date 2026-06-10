import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('koni_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  // [PRESENTASI: ORANG 2] Fungsi login yang menghubungkan frontend dan backend
  async function login(username, password) {
    try {
      const res = await api.post('/auth/login', { username, password })
      const { token, user: userData } = res.data

      localStorage.setItem('koni_token', token)
      localStorage.setItem('koni_user', JSON.stringify(userData))
      // [PRESENTASI: ORANG 2] Setelah login sukses, token dan data user disimpan di localStorage
      setUser(userData)

      return { success: true, role: userData.role }
    } catch (err) {
      const message = err.response?.data?.message || 'Login gagal, coba lagi.'
      return { success: false, message }
    }
  }

  function logout() {
    localStorage.removeItem('koni_token')
    localStorage.removeItem('koni_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
