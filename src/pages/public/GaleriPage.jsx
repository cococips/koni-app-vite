import { useState } from 'react'
import { useGaleri } from '../../context/GaleriContext'

// Lightbox
function Lightbox({ item, onClose, onPrev, onNext }) {
  if (!item) return null
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 font-sans animate-fade-in" onClick={onClose}>
      <button onClick={e => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm z-10">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <div onClick={e => e.stopPropagation()} className="max-w-5xl w-full flex flex-col items-center animate-scale-in">
        <div className="relative w-full rounded-2xl overflow-hidden bg-slate-800/50 shadow-2xl ring-1 ring-white/10">
          {item.url_foto ? (
            <img src={item.url_foto} alt={item.judul} className="w-full max-h-[70vh] object-contain"/>
          ) : (
            <div className="w-full h-80 flex flex-col items-center justify-center text-slate-500">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>Tidak ada foto tersedia</span>
            </div>
          )}
        </div>
        <div className="mt-6 text-center max-w-2xl px-4">
          <span className="inline-block text-[10px] font-extrabold bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full uppercase tracking-widest mb-3 ring-1 ring-brand-500/30">
            {item.kategori || 'Tak Berkategori'}
          </span>
          <p className="text-white font-extrabold text-2xl leading-tight mb-2">{item.judul}</p>
          {item.deskripsi && <p className="text-slate-300 text-sm leading-relaxed">{item.deskripsi}</p>}
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onNext() }}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm z-10">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
      <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm z-10">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  )
}

export default function GaleriPage() {
  const { published } = useGaleri()
  const [filterKat, setFilterKat] = useState('Semua')
  const [lightboxIdx, setLightboxIdx] = useState(null)

  const kategori = ['Semua', ...new Set(published.map(g => g.kategori).filter(Boolean))]
  const displayed = filterKat === 'Semua' ? published : published.filter(g => g.kategori === filterKat)

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 font-sans">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -ml-20 -mb-20 opacity-60 pointer-events-none"></div>
          
          <div className="relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-wider uppercase mb-4 shadow-sm border border-brand-100">
              🖼️ Dokumentasi
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Galeri Foto
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Kumpulan memori, momen berharga, dan dokumentasi berbagai kegiatan serta prestasi KONI Kabupaten Banyumas.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter kategori */}
        <div className="flex gap-3 flex-wrap justify-center mb-10">
          {kategori.map(k => (
            <button key={k} onClick={() => setFilterKat(k)}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all duration-300 shadow-sm ${filterKat === k ? 'bg-brand-600 text-white shadow-brand-500/30 scale-105 ring-2 ring-brand-200 ring-offset-1' : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:shadow-soft'}`}>
              {k}
            </button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-soft border border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🖼️</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Belum Ada Foto</h3>
            <p className="text-slate-500 font-medium">Kategori ini belum memiliki dokumentasi foto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayed.map((g, i) => (
              <div key={g.id}
                onClick={() => setLightboxIdx(i)}
                className="group relative overflow-hidden rounded-3xl aspect-square bg-white shadow-soft cursor-pointer border border-slate-100 hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
                {g.url_foto ? (
                  <img src={g.url_foto} alt={g.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block text-[10px] font-extrabold bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 backdrop-blur-md">
                      {g.kategori || 'Galeri'}
                    </span>
                    <p className="text-white text-sm font-bold leading-snug line-clamp-2">{g.judul}</p>
                  </div>
                </div>
                
                {/* Expand icon */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          item={displayed[lightboxIdx]}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx(i => (i - 1 + displayed.length) % displayed.length)}
          onNext={() => setLightboxIdx(i => (i + 1) % displayed.length)}
        />
      )}
    </div>
  )
}
