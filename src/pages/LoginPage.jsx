import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// [PRESENTASI: ORANG 2] Halaman LoginPage kemudian redirect berdasarkan role
const ROLE_REDIRECT = {
  admin:   '/admin/dashboard',
  pelatih: '/dashboard/pelatih',
  atlet:   '/dashboard/atlet',
  wasit:   '/dashboard/wasit',
}

// SVG icons per role
const RoleIcons = {
  Admin: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Pelatih: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 2v4M16 2v4M4 10h16" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  ),
  Atlet: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <path d="M10 22V18L7 15l3-4 2 1 2-1 3 4-3 3v4" />
      <path d="M7 12l-2-1M17 12l2-1" />
    </svg>
  ),
  Wasit: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5" />
      <path d="M8 3H3v5" />
      <path d="M12 22l4-11H8l4 11z" />
      <path d="M3 8l9 3 9-3" />
    </svg>
  ),
}

const ROLE_INFO = [
  { name: 'Admin' },
  { name: 'Pelatih' },
  { name: 'Atlet' },
  { name: 'Wasit' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const [form, setForm]         = useState({ username: '', password: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [shakeError, setShakeError] = useState(false)

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
      setShakeError(true)
      setTimeout(() => setShakeError(false), 600)
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes loginFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loginFadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loginScaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes loginFloat {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes loginPulseGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(220,38,38,0.08); }
          50%      { box-shadow: 0 0 60px rgba(220,38,38,0.18); }
        }
        @keyframes loginGradient {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes loginParticle {
          0%   { transform: translateY(0) scale(1); opacity: 0.3; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }
        @keyframes loginShimmer {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes loginShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes loginSpinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(-45deg, #111827, #1f2937, #1a1a2e, #0f172a)',
          backgroundSize: '400% 400%',
          animation: 'loginGradient 15s ease infinite',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >

        {/* ── Particles ── */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: `${(i / 15) * 100 + Math.random() * 5}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              borderRadius: '50%',
              background: `rgba(220, 38, 38, ${Math.random() * 0.25 + 0.1})`,
              animation: `loginParticle ${Math.random() * 12 + 10}s linear ${Math.random() * 8}s infinite`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* ── Decorative orbs ── */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-150px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220,38,38,0.1) 0%, transparent 70%)',
            animation: 'loginFloat 8s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)',
            animation: 'loginFloat 10s ease-in-out 2s infinite',
            pointerEvents: 'none',
          }}
        />

        {/* ── Spinning rings ── */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '40px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.04)',
            animation: 'loginSpinSlow 30s linear infinite',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '60px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '1px solid rgba(220,38,38,0.08)',
            animation: 'loginSpinSlow 20s linear reverse infinite',
            pointerEvents: 'none',
          }}
        />

        {/* ── Main content ── */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '420px', zIndex: 10 }}>

          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.35)',
              fontSize: '14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '28px',
              padding: 0,
              transition: 'color 0.3s, transform 0.3s',
              animation: 'loginFadeDown 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(-4px)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.transform = 'translateX(0)' }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </button>

          {/* ── Glass Card ── */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '24px',
              padding: '40px 32px',
              animation: 'loginFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards, loginPulseGlow 4s ease-in-out infinite',
              opacity: 0,
            }}
          >

            {/* ── Logo + Title ── */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '28px',
                animation: 'loginScaleIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s forwards',
                opacity: 0,
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  marginBottom: '16px',
                  animation: 'loginFloat 6s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 20px rgba(220,38,38,0.25))',
                }}
              >
                <img
                  src="/logo_koni.png"
                  alt="KONI"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: 'white', fontWeight: 900, fontSize: '28px' }}>K</span>
                </div>
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'white', margin: 0, letterSpacing: '-0.3px' }}>
                Portal KONI Banyumas
              </h1>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
                Masuk ke akun Anda untuk melanjutkan
              </p>
            </div>

            {/* ── Role Badges ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '24px',
                animation: 'loginFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s forwards',
                opacity: 0,
              }}
            >
              {ROLE_INFO.map(r => (
                <RoleBadge key={r.name} name={r.name} />
              ))}
            </div>

            {/* ── Error Alert ── */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(220,38,38,0.1)',
                  border: '1px solid rgba(220,38,38,0.2)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  animation: shakeError ? 'loginShake 0.5s ease-in-out' : 'loginFadeUp 0.3s ease forwards',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(220,38,38,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span style={{ color: '#fca5a5', fontSize: '13px', flex: 1 }}>{error}</span>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div
                style={{
                  marginBottom: '16px',
                  animation: 'loginFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s forwards',
                  opacity: 0,
                }}
              >
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '14px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.2)" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <LoginInput
                    type="text"
                    value={form.username}
                    autoFocus
                    required
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    placeholder="Masukkan username"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div
                style={{
                  marginBottom: '20px',
                  animation: 'loginFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.45s forwards',
                  opacity: 0,
                }}
              >
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '14px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.2)" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <LoginInput
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    required
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Masukkan password"
                    style={{ paddingLeft: '40px', paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      right: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      color: 'rgba(255,255,255,0.2)',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {showPass
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      }
                    </svg>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div
                style={{
                  animation: 'loginFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.55s forwards',
                  opacity: 0,
                }}
              >
                <SubmitButton loading={loading} />
              </div>
            </form>

            {/* ── Divider ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '24px 0',
                animation: 'loginFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.6s forwards',
                opacity: 0,
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', fontWeight: 600, letterSpacing: '1px' }}>
                KONI KAB. BANYUMAS
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
            </div>

            {/* ── Footer ── */}
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.15)',
                textAlign: 'center',
                margin: 0,
                animation: 'loginFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.65s forwards',
                opacity: 0,
              }}
            >
              Sistem Informasi KONI · {new Date().getFullYear()}
            </p>
          </div>

          {/* ── Security note ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '24px',
              animation: 'loginFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.7s forwards',
              opacity: 0,
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.12)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.12)' }}>
              Koneksi aman &amp; terenkripsi
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Subcomponents ──────────────────────────────────────────────────────── */

function RoleBadge({ name }) {
  const [hovered, setHovered] = useState(false)
  const iconColor = hovered ? 'rgba(220,38,38,0.9)' : 'rgba(255,255,255,0.35)'
  const renderIcon = RoleIcons[name]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: 'center',
        padding: '12px 4px',
        borderRadius: '12px',
        border: `1px solid ${hovered ? 'rgba(220,38,38,0.3)' : 'rgba(255,255,255,0.05)'}`,
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
        cursor: 'default',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px', transition: 'all 0.3s ease' }}>
        {renderIcon ? renderIcon(iconColor) : null}
      </div>
      <p style={{ fontSize: '11px', fontWeight: 500, color: hovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)', margin: 0, transition: 'color 0.3s ease' }}>{name}</p>
    </div>
  )
}

function LoginInput({ style = {}, ...props }) {
  const [focused, setFocused] = useState(false)

  return (
    <input
      {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e) }}
      onBlur={e => { setFocused(false); props.onBlur?.(e) }}
      style={{
        width: '100%',
        padding: '12px 16px',
        fontSize: '14px',
        borderRadius: '12px',
        border: `1px solid ${focused ? 'rgba(220,38,38,0.5)' : 'rgba(255,255,255,0.1)'}`,
        background: focused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
        color: 'white',
        outline: 'none',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: focused ? '0 0 0 3px rgba(220,38,38,0.12), 0 0 20px rgba(220,38,38,0.08)' : 'none',
        transform: focused ? 'translateY(-1px)' : 'translateY(0)',
        boxSizing: 'border-box',
        ...style,
      }}
    />
  )
}

function SubmitButton({ loading }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        padding: '14px 20px',
        fontSize: '14px',
        fontWeight: 700,
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        background: loading
          ? 'rgba(220,38,38,0.4)'
          : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
        backgroundSize: '200% 200%',
        backgroundPosition: hovered && !loading ? '100% 0' : '0% 0',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered && !loading ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered && !loading
          ? '0 10px 40px rgba(220,38,38,0.35)'
          : '0 4px 16px rgba(220,38,38,0.15)',
        opacity: loading ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Shimmer overlay */}
      {!loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            width: '60%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
            animation: 'loginShimmer 3s ease infinite',
            pointerEvents: 'none',
          }}
        />
      )}
      {loading ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
            <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Memverifikasi...
        </>
      ) : (
        <>
          Masuk
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </>
      )}
    </button>
  )
}
