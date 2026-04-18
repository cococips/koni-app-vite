import { useState } from 'react'
import { useGaleri } from '../../context/GaleriContext'

// Lightbox
function Lightbox({ item, onClose, onPrev, onNext }) {
  if (!item) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={e => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full">
        {item.url_foto ? (
          <img src={item.url_foto} alt={item.judul} className="w-full max-h-[75vh] object-contain rounded-xl"/>
        ) : (
          <div className="w-full h-80 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">Tidak ada foto</div>
        )}
        <div className="mt-4 text-center">
          <p className="text-white font-semibold">{item.judul}</p>
          <p className="text-gray-400 text-sm mt-1">{item.deskripsi}</p>
          <span className="inline-block mt-2 text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full">{item.kategori}</span>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onNext() }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    <div className="bg-white min-h-screen">
      <div className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-2">🖼️ Dokumentasi</p>
          <h1 className="text-3xl font-black text-white">Galeri Foto</h1>
          <p className="text-gray-400 mt-2 text-sm">Dokumentasi kegiatan dan prestasi KONI Kabupaten Banyumas</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Filter kategori */}
        <div className="flex gap-2 flex-wrap mb-8">
          {kategori.map(k => (
            <button key={k} onClick={() => setFilterKat(k)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-colors ${filterKat === k ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600'}`}>
              {k}
            </button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🖼️</p>
            <p className="font-medium">Belum ada foto</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayed.map((g, i) => (
              <div key={g.id}
                onClick={() => setLightboxIdx(i)}
                className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-100 cursor-pointer border border-gray-100 hover:border-red-200">
                {g.url_foto ? (
                  <img src={g.url_foto} alt={g.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-xs font-semibold truncate">{g.judul}</p>
                  <span className="text-xs bg-white/20 text-white/80 px-1.5 py-0.5 rounded">{g.kategori}</span>
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
