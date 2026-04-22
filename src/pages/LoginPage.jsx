import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Redirect berdasarkan role setelah login
const ROLE_REDIRECT = {
  admin:   '/admin/dashboard',
  pelatih: '/dashboard/pelatih',
  atlet:   '/dashboard/atlet',
  wasit:   '/dashboard/wasit',
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(form.username, form.password)

    if (result.success) {
      // Redirect ke halaman sebelumnya atau ke dashboard sesuai role
      const from = location.state?.from?.pathname
      navigate(from || ROLE_REDIRECT[result.role] || '/', { replace: true })
    } else {
      setError(result.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to landing */}
        <button onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 mb-4">
              <img src="/logo.png" alt="KONI" className="w-full h-full object-contain"
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
              <div className="w-16 h-16 rounded-2xl bg-blue-700 items-center justify-center hidden">
                <span className="text-white font-bold text-2xl">K</span>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Portal KONI Banyumas</h1>
            <p className="text-sm text-gray-400 mt-1">Masuk ke akun Anda</p>
          </div>

          {/* Info role */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {['Admin','Pelatih','Atlet','Wasit'].map(r => (
              <div key={r} className="text-center py-2 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-medium text-gray-500">{r}</p>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-field">Username</label>
              <input className="input-field" type="text" value={form.username} autoFocus required
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="Masukkan username" />
            </div>
            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <input className="input-field pr-10" type={showPass ? 'text' : 'password'}
                  value={form.password} required
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Masukkan password" />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {showPass
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      : <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    }
                  </svg>
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Memverifikasi...
                </>
              ) : 'Masuk'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            Sistem Informasi KONI Kab. Banyumas · 2024
          </p>
        </div>
      </div>
    </div>
  )
}
