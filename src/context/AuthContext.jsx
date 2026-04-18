import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Kredensial hardcoded untuk UTS
const VALID_USER = { username: 'admin', password: 'koni2024', nama: 'Admin KONI' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('koni_auth')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  function login(username, password) {
    if (username === VALID_USER.username && password === VALID_USER.password) {
      const userData = { username, nama: VALID_USER.nama }
      setUser(userData)
      sessionStorage.setItem('koni_auth', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, message: 'Username atau password salah.' }
  }

  function logout() {
    setUser(null)
    sessionStorage.removeItem('koni_auth')
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
