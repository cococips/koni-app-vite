import { useState, useEffect } from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Beranda',     to: '/'            },
  { label: 'Berita',      to: '/berita'       },
  { label: 'Pengumuman',  to: '/pengumuman'   },
  { label: 'Kegiatan',    to: '/kegiatan'     },
  { label: 'Pengurus',    to: '/pengurus'     },
  { label: 'Galeri',      to: '/galeri'       },
]

function PublicNavbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav className={`sticky top-0 z-40 bg-white transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-lg">K</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-black text-gray-900 text-sm leading-tight">KONI</p>
            <p className="text-xs text-gray-400 leading-tight">Kab. Banyumas</p>
          </div>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => navigate('/login')}
            className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Admin
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(o => !o)}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-1 shadow-lg">
          {NAV_LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm rounded-lg ${isActive ? 'text-red-600 bg-red-50 font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-1 px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg"
          >
            Portal Admin
          </button>
        </div>
      )}
    </nav>
  )
}

function PublicFooter() {
  const navigate = useNavigate()
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
                <span className="text-white font-black text-lg">K</span>
              </div>
              <div>
                <p className="text-white font-black text-sm">KONI Kabupaten Banyumas</p>
                <p className="text-xs">Komite Olahraga Nasional Indonesia</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Membina atlet, mencetak juara, dan mengharumkan nama Kabupaten Banyumas di kancah olahraga nasional dan internasional.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Navigasi</h4>
            <div className="space-y-2 text-sm">
              {NAV_LINKS.map(l => (
                <NavLink key={l.to} to={l.to} className="block hover:text-white transition-colors">{l.label}</NavLink>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Kontak</h4>
            <div className="space-y-2 text-sm">
              <p>Sekretariat KONI Kab. Banyumas</p>
              <p>Purwokerto, Jawa Tengah</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Portal Admin
            </button>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© 2024 KONI Kabupaten Banyumas. All rights reserved.</p>
          <p>Sistem Informasi KONI · v1.0</p>
        </div>
      </div>
    </footer>
  )
}

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
