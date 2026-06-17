import { useState, useEffect } from 'react'
import api from '../../api/axios'
/* ── Kartu satu pengurus ───────────────────────────────────────────────────── */
function Card({ p, size = 'md' }) {
  const inisial = p.nama.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  const isKetua = p.level === 1

  if (size === 'lg') {
    return (
      <div className="flex flex-col items-center group">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-rose-700 border-4 border-white flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform duration-300 z-10 overflow-hidden">
          {p.foto_url
            ? <img src={p.foto_url} alt={p.nama} className="w-full h-full object-cover" />
            : <span className="text-white font-black text-2xl">{inisial}</span>
          }
        </div>
        <div className="mt-4 bg-white/90 backdrop-blur-md border border-brand-100 rounded-2xl px-6 py-4 text-center shadow-soft min-w-[200px] group-hover:-translate-y-2 transition-transform duration-300">
          <p className="text-[10px] font-extrabold text-brand-600 uppercase tracking-widest bg-brand-50 inline-block px-2 py-1 rounded-full mb-2">{p.jabatan}</p>
          <p className="text-base font-extrabold text-slate-900 leading-snug">{p.nama}</p>
          <p className="text-xs font-bold text-slate-400 mt-1">{p.periode}</p>
        </div>
      </div>
    )
  }

  if (size === 'sm') {
    return (
      <div className="flex flex-col items-center group">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 border-2 border-white flex items-center justify-center shadow-md shadow-slate-500/20 group-hover:scale-110 transition-transform duration-300 z-10 overflow-hidden">
          {p.foto_url
            ? <img src={p.foto_url} alt={p.nama} className="w-full h-full object-cover" />
            : <span className="text-white font-bold text-sm">{inisial}</span>
          }
        </div>
        <div className="mt-3 bg-white/90 backdrop-blur-md border border-slate-100 rounded-xl px-4 py-3 text-center shadow-sm min-w-[150px] group-hover:-translate-y-1 transition-transform duration-300">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 line-clamp-1">{p.jabatan}</p>
          <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">{p.nama}</p>
        </div>
      </div>
    )
  }

  // md
  return (
    <div className="flex flex-col items-center group">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 border-2 border-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300 z-10 overflow-hidden">
        {p.foto_url
          ? <img src={p.foto_url} alt={p.nama} className="w-full h-full object-cover" />
          : <span className="text-white font-bold text-lg">{inisial}</span>
        }
      </div>
      <div className="mt-3 bg-white/90 backdrop-blur-md border border-blue-50 rounded-xl px-5 py-3 text-center shadow-sm min-w-[170px] group-hover:-translate-y-1 transition-transform duration-300">
        <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider mb-1 bg-blue-50 inline-block px-2 py-0.5 rounded-full">{p.jabatan}</p>
        <p className="text-sm font-bold text-slate-900 leading-snug">{p.nama}</p>
        <p className="text-xs font-medium text-slate-400 mt-1">{p.periode}</p>
      </div>
    </div>
  )
}

/* ── Garis konektor vertikal ───────────────────────────────────────────────── */
function VLine({ h = 10 }) {
  return <div className={`w-0.5 bg-gradient-to-b from-slate-200 to-slate-300 mx-auto rounded-full`} style={{ height: h }} />
}

function HLine({ w }) {
  return <div className="h-0.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full" style={{ width: w }} />
}

/* ── Bagan Organisasi ──────────────────────────────────────────────────────── */
function OrgChart({ published }) {
  const level1 = published.filter(p => p.level === 1)
  const level2 = published.filter(p => p.level === 2)
  const level3 = published.filter(p => p.level === 3)
  const level4 = published.filter(p => p.level === 4)

  return (
    <div className="overflow-x-auto pb-12 pt-4 hide-scrollbar">
      <div className="min-w-max mx-auto px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none -z-10"></div>

        {/* Level 1 — Ketua Umum */}
        {level1.map(p => (
          <div key={p.id} className="flex justify-center">
            <Card p={p} size="lg" />
          </div>
        ))}

        {/* Garis ke level 2 */}
        {(level2.length > 0 || level3.length > 0) && (
          <>
            <VLine h={32} />
            {/* Garis horizontal atas */}
            <div className="flex justify-center">
              <HLine w="min(100%, 42rem)" />
            </div>
          </>
        )}

        {/* Level 2 — Wakil Ketua */}
        {level2.length > 0 && (
          <>
            <div className="flex justify-center gap-16 md:gap-32 mt-0">
              {level2.map(p => (
                <div key={p.id} className="flex flex-col items-center">
                  <VLine h={32} />
                  <Card p={p} size="md" />
                </div>
              ))}
            </div>
            <VLine h={32} />
          </>
        )}

        {/* Level 3 — Sekretaris, Bendahara */}
        {level3.length > 0 && (
          <>
            {/* Garis horizontal */}
            <div className="flex justify-center">
              <HLine w={`${Math.min(level3.length * 250, 800)}px`} />
            </div>
            <div className="flex justify-center gap-12 mt-0">
              {level3.map(p => (
                <div key={p.id} className="flex flex-col items-center">
                  <VLine h={32} />
                  <Card p={p} size="md" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Level 4 — Kabid */}
        {level4.length > 0 && (
          <>
            <VLine h={32} />
            <div className="flex justify-center">
              <HLine w={`${Math.min(level4.length * 200, 1000)}px`} />
            </div>
            <div className="flex justify-center gap-6 md:gap-8 mt-0 flex-wrap max-w-5xl mx-auto">
              {level4.map(p => (
                <div key={p.id} className="flex flex-col items-center">
                  <VLine h={32} />
                  <Card p={p} size="sm" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Halaman ───────────────────────────────────────────────────────────────── */
export default function PengurusPage() {
  const [published, setPublished] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/public/pengurus')
      .then(res => {
        if (res.data.success) setPublished(res.data.data)
      })
      .catch(err => console.error("Gagal load pengurus:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 font-sans">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-slate-100 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase mb-4 shadow-sm border border-blue-100">
              👥 Struktur Organisasi
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Susunan Pengurus
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Struktur kepengurusan KONI Kabupaten Banyumas Periode 2022 – 2026 yang berdedikasi untuk kemajuan olahraga daerah.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
          
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-2xl font-extrabold text-slate-900">Bagan Kepengurusan</h2>
            <div className="w-16 h-1 bg-brand-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {published.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl">👥</span>
              </div>
              <p className="font-bold text-slate-500">Data pengurus belum tersedia</p>
            </div>
          ) : (
            <OrgChart published={published} />
          )}

          {/* Keterangan level */}
          <div className="mt-16 pt-8 border-t border-slate-100 relative z-10 bg-slate-50/50 -mx-6 md:-mx-10 -mb-6 md:-mb-10 px-6 md:px-10 pb-6 md:pb-10">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6 text-center">Keterangan Hierarki</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { color: 'from-brand-500 to-rose-700 shadow-brand-500/20',  label: 'Ketua Umum'           },
                { color: 'from-blue-600 to-indigo-800 shadow-blue-500/20', label: 'Wakil Ketua / Setara' },
                { color: 'from-slate-500 to-slate-700 shadow-slate-500/20', label: 'Ketua Bidang / Setara'       },
              ].map(k => (
                <div key={k.label} className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${k.color} shadow-sm border-2 border-white`} />
                  <span className="text-xs font-bold text-slate-600">{k.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
