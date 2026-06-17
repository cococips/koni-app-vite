import { useState, useEffect } from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { usePengumuman } from '../../context/PengumumanContext'

const NAV_LINKS = [
  { label: 'Beranda',    to: '/'           },
  { label: 'Berita',     to: '/berita'      },
  { label: 'Pengumuman', to: '/pengumuman'  },
  { label: 'Kegiatan',   to: '/kegiatan'   },
  { label: 'Pengurus',   to: '/pengurus'   },
  { label: 'Galeri',     to: '/galeri'     },
]

function Logo({ size = 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-16 h-16'
  return (
    <img
      src="../../../public/logo_koni.png"
      alt="Logo KONI Kabupaten Banyumas"
      className={`${dim} object-contain`}
      onError={e => {
        // Fallback jika logo.png belum ada
        e.target.style.display = 'none'
        e.target.nextSibling.style.display = 'flex'
      }}
    />
  )
}

function LogoFallback({ size = 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8 text-base' : 'w-10 h-10 text-lg'
  return (
    <div className={`${dim} rounded-xl bg-red-600 items-center justify-center flex-shrink-0 hidden`}>
      <span className="text-white font-black">K</span>
    </div>
  )
}

import { formatTanggal } from '../../utils/helpers'
import { createPortal } from 'react-dom'

const TICKER_CSS = `
  @keyframes ticker-move { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .ticker-track { animation: ticker-move 35s linear infinite; }
  .ticker-wrap:hover .ticker-track { animation-play-state: paused; }
`

function PengumumanTicker({ items }) {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  if (!items || !items.length) return null

  return (
    <>
      <style>{TICKER_CSS}</style>
      <div className="bg-brand-600 text-white flex items-stretch overflow-hidden border-b border-brand-700" style={{ minHeight: 38 }}>
        <div className="flex-shrink-0 bg-brand-700 px-4 flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest z-10 whitespace-nowrap shadow-[4px_0_10px_rgba(225,29,72,0.5)]">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          Pengumuman
        </div>
        <div className="flex-1 overflow-hidden ticker-wrap cursor-pointer">
          <div className="ticker-track flex items-center h-full whitespace-nowrap">
            {[0, 1].map(n => (
              <span key={n} className="inline-flex items-center gap-8 px-8 py-2 text-xs sm:text-sm font-semibold tracking-wide">
                {items.map((p, i) => (
                  <span key={`${n}-${p.id}`} className="inline-flex items-center gap-6">
                    <button onClick={() => setSelected(p)} className="hover:text-brand-200 hover:underline transition-colors focus:outline-none">
                      <span className="opacity-70 mr-1.5">⚠</span>{p.judul}
                    </button>
                    {i < items.length - 1 && <span className="text-brand-400">·</span>}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <button onClick={() => navigate('/pengumuman')}
          className="flex-shrink-0 bg-brand-700 hover:bg-brand-800 px-4 text-[10px] sm:text-xs font-bold whitespace-nowrap transition-colors border-l border-brand-600 focus:outline-none">
          Lihat semua
        </button>
      </div>

      {selected && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className={`px-6 py-5 flex items-start justify-between gap-4 ${selected.tipe === 'penting' ? 'bg-brand-600' : 'bg-slate-900'}`}>
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${selected.tipe === 'penting' ? 'text-brand-100' : 'text-slate-400'}`}>
                  {selected.tipe === 'penting' ? 'Penting' : 'Informasi'}
                </p>
                <h3 className="text-white font-extrabold leading-snug">{selected.judul}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/60 hover:text-white mt-0.5 flex-shrink-0 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-6 bg-slate-50">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-5">
                {selected.isi_html
                  ? <div className="prose prose-sm prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: selected.isi_html }} />
                  : <p className="text-slate-600 text-sm leading-relaxed">{selected.isi}</p>
                }
              </div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-400">{formatTanggal(selected.created_at)}</span>
                <button onClick={() => { setSelected(null); navigate('/pengumuman'); }} className="text-brand-600 hover:text-brand-700 transition-colors">
                  Baca Selengkapnya
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

function PublicNavbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { published } = usePengumuman()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-soft' : 'bg-transparent'}`}>
      <div className={`transition-all duration-300 ${scrolled ? 'py-1' : 'py-3'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="flex-shrink-0 relative overflow-hidden rounded-xl bg-white shadow-sm p-1">
                <Logo size="sm" />
                <LogoFallback size="sm" />
              </div>
              <div className="hidden sm:block">
                <p className={`font-extrabold text-sm leading-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-900 md:text-white'}`}>KONI</p>
                <p className={`text-xs font-medium leading-tight transition-colors ${scrolled ? 'text-brand-600' : 'text-brand-600 md:text-white/80'}`}>Kab. Banyumas</p>
              </div>
            </NavLink>

            <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-2xl px-2 py-1.5 border border-white/20">
              {NAV_LINKS.map(l => (
                <NavLink key={l.to} to={l.to} end={l.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${isActive ? 'bg-brand-50 text-brand-600 shadow-sm' : scrolled ? 'text-gray-600 hover:text-brand-600 hover:bg-brand-50/50' : 'text-white hover:text-brand-100 hover:bg-white/10'}`
                  }>
                  {l.label}
                </NavLink>
              ))}
            </div>
            
            <div className="hidden md:block">
              <button onClick={() => navigate('/login')}
                className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 shadow-sm hover:-translate-y-0.5 ${scrolled ? 'bg-brand-600 text-white hover:bg-brand-500 hover:shadow-glow' : 'bg-white text-brand-600 hover:bg-brand-50'}`}>
                Login Portal
              </button>
            </div>

            <button className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-900 hover:bg-white/20'}`} onClick={() => setOpen(o => !o)}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <PengumumanTicker items={published} />

      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-4 space-y-1 shadow-2xl">
          {NAV_LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 text-sm rounded-xl font-semibold transition-colors ${isActive ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'}`
              }>
              {l.label}
            </NavLink>
          ))}
          <div className="pt-2">
            <button onClick={() => navigate('/login')}
              className="w-full px-4 py-3 bg-brand-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-brand-500 transition-colors">
              Login Portal
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

function PublicFooter() {
  const navigate = useNavigate()
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 relative bg-white p-1.5 rounded-xl">
                <Logo />
                <LogoFallback />
              </div>
              <div>
                <p className="text-white font-extrabold text-lg tracking-tight">KONI Kab. Banyumas</p>
                <p className="text-sm text-brand-500 font-semibold tracking-wide uppercase">Komite Olahraga Nasional Indonesia</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              Membina atlet, mencetak juara, dan mengharumkan nama Kabupaten Banyumas di kancah olahraga nasional dan internasional dengan semangat sportivitas dan dedikasi.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-5">Navigasi Utama</h4>
            <div className="flex flex-col space-y-3 text-sm">
              {NAV_LINKS.map(l => (
                <NavLink key={l.to} to={l.to} className="hover:text-brand-400 transition-colors w-fit font-medium">{l.label}</NavLink>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-5">Portal & Kontak</h4>
            <div className="space-y-3 text-sm text-slate-400 mb-6">
              <p className="flex items-start gap-2">
                <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Sekretariat KONI Kab. Banyumas<br/>Purwokerto, Jawa Tengah</span>
              </p>
            </div>
            <button onClick={() => navigate('/login')}
              className="w-full px-5 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-semibold rounded-xl transition-all duration-300">
              Masuk Portal Admin
            </button>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} KONI Kabupaten Banyumas. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Sistem Informasi KONI v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-brand-200 selection:text-brand-900">
      <PublicNavbar />
      <main className="flex-1"><Outlet /></main>
      <PublicFooter />
    </div>
  )
}
