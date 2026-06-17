import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_REDIRECT = {
  admin:   '/admin/dashboard',
  pelatih: '/dashboard/pelatih',
  atlet:   '/dashboard/atlet',
  wasit:   '/dashboard/wasit',
}

const ROLE_INFO = [
  { name: 'Admin', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { name: 'Pelatih', icon: 'M8 2v4M16 2v4M4 10h16' },
  { name: 'Atlet', icon: 'M12 5a2 2 0 100-4 2 2 0 000 4zm-2 7l-3-4 2 1 2-1 3 4-3 3v4' },
  { name: 'Wasit', icon: 'M16 3h5v5M8 3H3v5M12 22l4-11H8l4 11zM3 8l9 3 9-3' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const [form, setForm]         = useState({ username: '', password: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(form.username, form.password)

    if (result.success) {
      const from = location.state?.from?.pathname
      navigate(from || ROLE_REDIRECT[result.role] || '/', { replace: true })
    } else {
      setError(result.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* ── Left Side: Branding / Imagery ── */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at top right, #e11d48, transparent 50%)' }}></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-brand-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl">
            <img src="/logo_koni.png" alt="KONI" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-white font-extrabold tracking-tight">KONI Banyumas</h1>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
            Sistem Informasi <br/>
            <span className="text-brand-400">Terpadu KONI.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Portal resmi untuk pengelolaan data atlet, pelatih, wasit, cabang olahraga, dan prestasi Kabupaten Banyumas.
          </p>
        </div>

        <div className="relative z-10 text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} KONI Kabupaten Banyumas.
        </div>
      </div>

      {/* ── Right Side: Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <button onClick={() => navigate('/')} className="absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali
        </button>

        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-10 lg:hidden">
            <img src="/logo_koni.png" alt="KONI" className="w-16 h-16 object-contain mx-auto mb-4" />
            <h1 className="text-2xl font-extrabold text-slate-900">KONI Banyumas</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Selamat Datang</h2>
            <p className="text-slate-500">Silakan masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-8">
            {ROLE_INFO.map(r => (
              <div key={r.name} className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors group cursor-default">
                <svg className="w-5 h-5 mb-1.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={r.icon} /></svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">{r.name}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-100 rounded-2xl animate-shake">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm font-semibold text-red-700 leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  placeholder="Masukkan username Anda"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  placeholder="Masukkan password Anda"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-brand-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {showPass 
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      : <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    }
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 px-6 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"></path></svg>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Portal</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Koneksi Aman
          </div>
        </div>
      </div>
    </div>
  )
}
