import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBerita } from '../../context/BeritaContext'
import { formatTanggal } from '../../utils/helpers'

export default function BeritaPage() {
  const { beritaPublished } = useBerita()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filterKat, setFilterKat] = useState('Semua')

  const kategori = ['Semua', ...new Set(beritaPublished.map(b => b.kategori).filter(Boolean))]

  const displayed = beritaPublished.filter(b => {
    const matchQ = b.judul.toLowerCase().includes(query.toLowerCase()) || b.ringkasan?.toLowerCase().includes(query.toLowerCase())
    const matchK = filterKat === 'Semua' || b.kategori === filterKat
    return matchQ && matchK
  })

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-2">📰 Info Terbaru</p>
          <h1 className="text-3xl font-black text-white">Berita & Informasi</h1>
          <p className="text-gray-400 mt-2 text-sm">Informasi terkini seputar KONI Kabupaten Banyumas</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input className="input-field pl-9" value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari berita..."/>
          </div>
          <div className="flex gap-2 flex-wrap">
            {kategori.map(k => (
              <button key={k} onClick={() => setFilterKat(k)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${filterKat === k ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}>
                {k}
              </button>
            ))}
          </div>
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">Belum ada berita yang dipublikasikan</p>
          </div>
        ) : (
          <>
            {/* Berita utama (featured) */}
            {displayed[0] && (
              <div
                onClick={() => navigate(`/berita/${displayed[0].id}`)}
                className="group cursor-pointer mb-8 grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className={`h-60 md:h-full ${displayed[0].foto_url ? '' : 'bg-gradient-to-br from-red-600 to-red-900'} relative`}>
                  {displayed[0].foto_url ? (
                    <img src={displayed[0].foto_url} alt={displayed[0].judul} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded-lg">Unggulan</span>
                  </div>
                </div>
                <div className="p-6 bg-white flex flex-col justify-center">
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full w-fit mb-3">{displayed[0].kategori}</span>
                  <h2 className="text-xl font-black text-gray-900 leading-snug mb-3 group-hover:text-red-600 transition-colors">{displayed[0].judul}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{displayed[0].ringkasan}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
                    <span>{formatTanggal(displayed[0].created_at)}</span>
                    <span className="text-red-600 font-semibold group-hover:underline">Baca selengkapnya →</span>
                  </div>
                </div>
              </div>
            )}

            {/* List berita lainnya */}
            {displayed.length > 1 && (
              <div className="grid md:grid-cols-3 gap-5">
                {displayed.slice(1).map(b => (
                  <article key={b.id}
                    onClick={() => navigate(`/berita/${b.id}`)}
                    className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className={`h-36 ${b.foto_url ? '' : 'bg-gradient-to-br from-gray-700 to-gray-900'}`}>
                      {b.foto_url && <img src={b.foto_url} alt={b.judul} className="w-full h-full object-cover"/>}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{b.kategori}</span>
                        <span className="text-xs text-gray-400">{formatTanggal(b.created_at)}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-red-600 transition-colors">{b.judul}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{b.ringkasan}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
