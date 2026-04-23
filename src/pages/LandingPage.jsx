import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
// Konten publik tetap dari Context (localStorage dikelola admin)
import { useBerita }     from '../context/BeritaContext'
import { usePengumuman } from '../context/PengumumanContext'
import { useKegiatan }   from '../context/KegiatanContext'
import { useGaleri }     from '../context/GaleriContext'
import { formatTanggal } from '../utils/helpers'

/* ─── Ticker CSS ─────────────────────────────────────────────────────────── */
const TICKER_CSS = `
  @keyframes ticker-move { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .ticker-track { animation: ticker-move 35s linear infinite; }
  .ticker-wrap:hover .ticker-track { animation-play-state: paused; }
`

/* ─── Ticker Pengumuman ──────────────────────────────────────────────────── */
function PengumumanTicker({ items }) {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  if (!items.length) return null

  return (
    <>
      <div className="bg-red-600 text-white flex items-stretch overflow-hidden" style={{ minHeight: 38 }}>
        <div className="flex-shrink-0 bg-red-800 px-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest z-10 whitespace-nowrap">
          <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" />
          Pengumuman
        </div>
        <div className="flex-1 overflow-hidden ticker-wrap cursor-pointer">
          <div className="ticker-track flex items-center h-full whitespace-nowrap">
            {[0, 1].map(n => (
              <span key={n} className="inline-flex items-center gap-8 px-8 py-2 text-sm">
                {items.map((p, i) => (
                  <span key={`${n}-${p.id}`} className="inline-flex items-center gap-6">
                    <button onClick={() => setSelected(p)} className="hover:text-yellow-200 hover:underline transition-colors">
                      {p.judul}
                    </button>
                    {i < items.length - 1 && <span className="text-red-400">·</span>}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <button onClick={() => navigate('/pengumuman')}
          className="flex-shrink-0 bg-red-800 hover:bg-red-900 px-4 text-xs font-semibold whitespace-nowrap transition-colors">
          Lihat semua
        </button>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className={`px-6 py-4 flex items-start justify-between gap-4 ${selected.tipe === 'penting' ? 'bg-red-600' : 'bg-gray-800'}`}>
              <div>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">
                  {selected.tipe === 'penting' ? 'Penting' : 'Informasi'}
                </p>
                <h3 className="text-white font-bold leading-snug">{selected.judul}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/60 hover:text-white mt-0.5 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5">
              {selected.isi_html
                ? <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selected.isi_html }} />
                : <p className="text-gray-700 text-sm leading-relaxed">{selected.isi}</p>
              }
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">{formatTanggal(selected.created_at)}</p>
                <Link to="/pengumuman" className="text-xs text-red-600 font-semibold hover:underline">Lihat semua</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ─── Section Header ─────────────────────────────────────────────────────── */
function SectionHeader({ tag, title, to }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-1">{tag}</p>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900">{title}</h2>
      </div>
      {to && <Link to={to} className="text-sm text-red-600 font-semibold hover:underline whitespace-nowrap">Lihat semua</Link>}
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()

  // ── Data statistik dari API/database ──────────────────────────────────────
  const [stats, setStats] = useState({
    totalAtlet: 0, totalCabor: 0, totalMedali: 0, medaliEmas: 0,
    caborAktif: []
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [rAtlet, rCabor, rPrestasi] = await Promise.all([
          api.get('/admin/atlet'),
          api.get('/admin/cabor'),
          api.get('/admin/prestasi').catch(() => ({ data: { data: [] } })),
        ])

        const atlet   = rAtlet.data.data   || []
        const cabor   = rCabor.data.data   || []
        const prestasi = rPrestasi.data.data || []
        const caborAktif = cabor.filter(c => c.status === 'aktif')

        setStats({
          totalAtlet:  atlet.length,
          totalCabor:  caborAktif.length,
          totalMedali: prestasi.length,
          medaliEmas:  prestasi.filter(p => p.medali === 'emas').length,
          caborAktif,
        })
      } catch {
        // Kalau backend mati, tampilkan 0 — tidak crash
      }
      setLoadingStats(false)
    }
    loadStats()
  }, [])

  // ── Konten publik dari Context (dikelola admin lewat localStorage) ─────────
  const { beritaPublished }       = useBerita()
  const { published: pengumuman } = usePengumuman()
  const { published: kegiatan }   = useKegiatan()
  const { published: galeri }     = useGaleri()

  return (
    <div className="bg-white">
      <style>{TICKER_CSS}</style>
      <PengumumanTicker items={pengumuman} />

      {/* ── HERO ── */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-red-950" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #ef4444 0%, transparent 60%)' }} />

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-white/20 text-white/70 text-xs px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              Komite Olahraga Nasional Indonesia
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Membina Atlet,<br />
              Mencetak Juara,<br />
              <span className="text-red-500">Harumkan Banyumas.</span>
            </h1>
            <p className="text-gray-300 leading-relaxed mb-8 max-w-md text-sm">
              KONI Kabupaten Banyumas hadir untuk membina dan mengembangkan olahraga prestasi menuju kejayaan di tingkat regional dan nasional.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/kegiatan" className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors">Lihat Event</Link>
              <Link to="/berita"   className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors">Berita Terkini</Link>
            </div>
          </div>

          {/* Stats — dari API */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
              Statistik KONI Banyumas {loadingStats && <span className="text-white/30">(memuat...)</span>}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: stats.totalAtlet,  label: 'Total Atlet',     sub: 'terdaftar'  },
                { value: stats.totalCabor,  label: 'Cabang Olahraga', sub: 'aktif'      },
                { value: stats.totalMedali, label: 'Total Prestasi',  sub: 'tercatat'   },
                { value: stats.medaliEmas,  label: 'Medali Emas',     sub: 'bergengsi'  },
              ].map(s => (
                <div key={s.label} className="text-center py-4 border border-white/10 rounded-xl">
                  <p className="text-3xl font-black text-white">{s.value}</p>
                  <p className="text-sm text-white/70 font-semibold mt-0.5">{s.label}</p>
                  <p className="text-xs text-white/40">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TENTANG ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-2">Mengenal KONI lebih jauh</p>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Tentang KONI<br />Kabupaten Banyumas</h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                Komite Olahraga Nasional Indonesia (KONI) Kabupaten Banyumas merupakan induk organisasi pembinaan olahraga prestasi di tingkat kabupaten yang bertugas melakukan pengelolaan dan pengembangan olahraga daerah.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                Bersama {stats.totalCabor} cabang olahraga aktif, KONI Banyumas berkomitmen mencetak atlet-atlet berprestasi yang siap bersaing di Porprov, PON, hingga ajang internasional.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">Visi</p>
                  <p className="text-xs text-gray-700 leading-relaxed">KONI Banyumas profesional dalam pembinaan olahraga prestasi.</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Misi</p>
                  <p className="text-xs text-gray-700 leading-relaxed">Meningkatkan kualitas pembinaan atlet secara terpadu dan berkesinambungan.</p>
                </div>
              </div>
              <Link to="/pengurus" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors">
                Lihat Struktur Pengurus
              </Link>
            </div>

            {/* Stat boxes + cabor */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { value: stats.totalCabor,  label: 'Cabang Olahraga' },
                { value: stats.totalAtlet,  label: 'Atlet Terdaftar'  },
                { value: stats.totalMedali, label: 'Total Prestasi'   },
              ].map(s => (
                <div key={s.label} className="py-6 border border-gray-100 rounded-2xl hover:border-red-200 hover:shadow-sm transition-all">
                  <p className="text-4xl font-black text-red-600">{s.value}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
              <div className="col-span-3 bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Beberapa Cabor Unggulan</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {stats.caborAktif.slice(0, 10).map(c => (
                    <span key={c.id} className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full font-medium">{c.nama}</span>
                  ))}
                  {stats.caborAktif.length > 10 && (
                    <span className="text-xs bg-red-600 text-white px-2.5 py-1 rounded-full font-medium">+{stats.caborAktif.length - 10} lainnya</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENT ── */}
      {kegiatan.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader tag="Event Olahraga" title="Event KONI" to="/kegiatan" />
            <div className="grid md:grid-cols-3 gap-5">
              {kegiatan.slice(0, 3).map(k => {
                const today = new Date().toISOString().split('T')[0]
                const isUpcoming = k.tanggal_mulai >= today || (k.tanggal_selesai && k.tanggal_selesai >= today)
                return (
                  <div key={k.id} onClick={() => navigate('/kegiatan')}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className={`h-44 relative flex items-center justify-center bg-gradient-to-br ${isUpcoming ? 'from-red-600 to-red-900' : 'from-gray-500 to-gray-700'}`}>
                      <svg className="w-16 h-16 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isUpcoming ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white'}`}>
                          {isUpcoming ? 'Upcoming' : 'Selesai'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-red-600 transition-colors leading-snug">{k.nama}</h3>
                      <p className="text-xs text-gray-500 mb-1">{formatTanggal(k.tanggal_mulai)}</p>
                      {k.lokasi && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                          <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {k.lokasi}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BERITA ── */}
      {beritaPublished.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader tag="Informasi Terbaru" title="Berita Terkini" to="/berita" />
            <div className="space-y-3">
              {beritaPublished.slice(0, 4).map((b, i) => (
                <Link key={b.id} to={`/berita/${b.id}`}
                  className={`flex gap-4 items-start p-4 rounded-xl border hover:border-red-200 hover:shadow-sm transition-all group ${i === 0 ? 'border-red-100 bg-red-50' : 'border-gray-100 bg-white'}`}>
                  <div className={`w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden ${i === 0 ? 'bg-red-600' : 'bg-gray-200'}`}>
                    {b.foto_url
                      ? <img src={b.foto_url} alt={b.judul} className="w-full h-full object-cover" />
                      : <svg className={`w-6 h-6 ${i === 0 ? 'text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                        </svg>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${i === 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{b.kategori}</span>
                      <span className="text-xs text-gray-400">{formatTanggal(b.created_at)}</span>
                    </div>
                    <h3 className={`font-bold text-sm leading-snug group-hover:text-red-600 transition-colors ${i === 0 ? 'text-red-800' : 'text-gray-800'}`}>{b.judul}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{b.ringkasan}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-red-400 transition-colors flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GALERI ── */}
      {galeri.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader tag="Dokumentasi" title="Galeri KONI" to="/galeri" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {galeri.slice(0, 8).map((g, i) => (
                <div key={g.id} onClick={() => navigate('/galeri')}
                  className={`group relative overflow-hidden rounded-2xl bg-gray-200 cursor-pointer ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                  style={{ aspectRatio: i === 0 ? '1/1' : '4/3' }}>
                  {g.url_foto
                    ? <img src={g.url_foto} alt={g.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    : <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                  }
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-xs font-semibold">{g.judul}</p>
                    <p className="text-white/70 text-xs">{g.kategori}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
