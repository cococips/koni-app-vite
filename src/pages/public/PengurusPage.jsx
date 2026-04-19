import { usePengurus } from '../../context/PengurusContext'

/* ── Kartu satu pengurus ───────────────────────────────────────────────────── */
function Card({ p, size = 'md' }) {
  const inisial = p.nama.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  const isKetua = p.level === 1

  if (size === 'lg') {
    return (
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-red-600 border-4 border-red-100 flex items-center justify-center shadow-lg">
          {p.foto
            ? <img src={p.foto} alt={p.nama} className="w-full h-full object-cover rounded-full" />
            : <span className="text-white font-black text-xl">{inisial}</span>
          }
        </div>
        <div className="mt-3 bg-white border-2 border-red-200 rounded-xl px-5 py-3 text-center shadow-sm min-w-[180px]">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wide">{p.jabatan}</p>
          <p className="text-sm font-bold text-gray-900 mt-1 leading-snug">{p.nama}</p>
          <p className="text-xs text-gray-400 mt-0.5">{p.periode}</p>
        </div>
      </div>
    )
  }

  if (size === 'sm') {
    return (
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-gray-700 border-2 border-gray-200 flex items-center justify-center">
          {p.foto
            ? <img src={p.foto} alt={p.nama} className="w-full h-full object-cover rounded-full" />
            : <span className="text-white font-bold text-sm">{inisial}</span>
          }
        </div>
        <div className="mt-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-center shadow-sm min-w-[140px]">
          <p className="text-xs font-semibold text-gray-600">{p.jabatan}</p>
          <p className="text-xs font-bold text-gray-800 mt-0.5 leading-snug">{p.nama}</p>
        </div>
      </div>
    )
  }

  // md
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-full bg-blue-800 border-2 border-blue-100 flex items-center justify-center">
        {p.foto
          ? <img src={p.foto} alt={p.nama} className="w-full h-full object-cover rounded-full" />
          : <span className="text-white font-bold">{inisial}</span>
        }
      </div>
      <div className="mt-2 bg-white border border-blue-100 rounded-xl px-4 py-2.5 text-center shadow-sm min-w-[150px]">
        <p className="text-xs font-bold text-blue-700">{p.jabatan}</p>
        <p className="text-xs font-semibold text-gray-800 mt-0.5 leading-snug">{p.nama}</p>
        <p className="text-xs text-gray-400 mt-0.5">{p.periode}</p>
      </div>
    </div>
  )
}

/* ── Garis konektor vertikal ───────────────────────────────────────────────── */
function VLine({ h = 10 }) {
  return <div className={`w-px bg-gray-300 mx-auto`} style={{ height: h }} />
}

/* ── Bagan Organisasi ──────────────────────────────────────────────────────── */
function OrgChart({ published }) {
  const level1 = published.filter(p => p.level === 1)
  const level2 = published.filter(p => p.level === 2)
  const level3 = published.filter(p => p.level === 3)
  const level4 = published.filter(p => p.level === 4)

  return (
    <div className="overflow-x-auto pb-8">
      <div className="min-w-max mx-auto px-4">

        {/* Level 1 — Ketua Umum */}
        {level1.map(p => (
          <div key={p.id} className="flex justify-center">
            <Card p={p} size="lg" />
          </div>
        ))}

        {/* Garis ke level 2 */}
        {(level2.length > 0 || level3.length > 0) && (
          <>
            <VLine h={24} />
            {/* Garis horizontal atas */}
            <div className="flex justify-center">
              <div className="h-px bg-gray-300 w-full max-w-2xl" />
            </div>
          </>
        )}

        {/* Level 2 — Wakil Ketua */}
        {level2.length > 0 && (
          <>
            <div className="flex justify-center gap-24 mt-0">
              {level2.map(p => (
                <div key={p.id} className="flex flex-col items-center">
                  <VLine h={24} />
                  <Card p={p} size="md" />
                </div>
              ))}
            </div>
            <VLine h={24} />
          </>
        )}

        {/* Level 3 — Sekretaris, Bendahara */}
        {level3.length > 0 && (
          <>
            {/* Garis horizontal */}
            <div className="flex justify-center">
              <div className="h-px bg-gray-300" style={{ width: `${Math.min(level3.length * 200, 700)}px` }} />
            </div>
            <div className="flex justify-center gap-8 mt-0">
              {level3.map(p => (
                <div key={p.id} className="flex flex-col items-center">
                  <VLine h={24} />
                  <Card p={p} size="md" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Level 4 — Kabid */}
        {level4.length > 0 && (
          <>
            <VLine h={24} />
            <div className="flex justify-center">
              <div className="h-px bg-gray-300" style={{ width: `${Math.min(level4.length * 170, 900)}px` }} />
            </div>
            <div className="flex justify-center gap-5 mt-0 flex-wrap">
              {level4.map(p => (
                <div key={p.id} className="flex flex-col items-center">
                  <VLine h={24} />
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
  const { published } = usePengurus()

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white">Pengurus KONI Banyumas</h1>
          <p className="text-gray-400 mt-2 text-sm">Struktur kepengurusan KONI Kabupaten Banyumas Periode 2022 – 2026</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        {/* Header section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-red-50 border border-red-100 rounded-full px-4 py-1.5 text-xs font-semibold text-red-700 uppercase tracking-widest mb-3">
            Struktur Organisasi
          </div>
          <h2 className="text-2xl font-black text-gray-900">Bagan Kepengurusan</h2>
          <p className="text-gray-500 text-sm mt-2">KONI Kabupaten Banyumas — Periode 2022 s.d. 2026</p>
        </div>

        {published.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="font-medium">Data pengurus belum tersedia</p>
          </div>
        ) : (
          <OrgChart published={published} />
        )}

        {/* Keterangan level */}
        <div className="mt-14 border-t border-gray-100 pt-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 text-center">Keterangan</p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { color: 'bg-red-600 border-red-100',  label: 'Ketua Umum'           },
              { color: 'bg-blue-800 border-blue-100', label: 'Wakil Ketua / Setara' },
              { color: 'bg-gray-700 border-gray-200', label: 'Kabid / Setara'       },
            ].map(k => (
              <div key={k.label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full border-2 ${k.color}`} />
                <span className="text-xs text-gray-600">{k.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
