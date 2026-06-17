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
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 font-sans">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
          <div className="relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-wider uppercase mb-4">
              Berita & Update
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Informasi Terkini KONI.
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl">
              Dapatkan berita terbaru, pengumuman penting, dan update seputar kegiatan olahraga di Kabupaten Banyumas.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-4 rounded-2xl shadow-soft border border-slate-100">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-400" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="Cari berita atau kata kunci..."
            />
          </div>
          <div className="flex gap-2 flex-wrap pb-2 md:pb-0 overflow-x-auto hide-scrollbar">
            {kategori.map(k => (
              <button key={k} onClick={() => setFilterKat(k)}
                className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${filterKat === k ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
                {k}
              </button>
            ))}
          </div>
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-soft border border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Belum Ada Berita</h3>
            <p className="text-slate-500">Silakan periksa kembali nanti untuk informasi terbaru.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Berita */}
            {displayed[0] && (
              <div
                onClick={() => navigate(`/berita/${displayed[0].id}`)}
                className="group cursor-pointer grid lg:grid-cols-2 gap-8 bg-white rounded-3xl p-4 md:p-6 shadow-soft border border-slate-100 hover:shadow-glow transition-all duration-500"
              >
                <div className={`relative h-64 lg:h-full min-h-[300px] rounded-2xl overflow-hidden ${displayed[0].foto_url ? '' : 'bg-gradient-to-br from-brand-600 to-rose-900'}`}>
                  {displayed[0].foto_url ? (
                    <img src={displayed[0].foto_url} alt={displayed[0].judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-20 h-20 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-brand-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      ✨ Unggulan
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center py-4 lg:py-8 lg:pr-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-extrabold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider">{displayed[0].kategori}</span>
                    <span className="text-sm font-medium text-slate-400">{formatTanggal(displayed[0].created_at)}</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-4 group-hover:text-brand-600 transition-colors">
                    {displayed[0].judul}
                  </h2>
                  <p className="text-slate-500 leading-relaxed mb-8 text-lg">
                    {displayed[0].ringkasan}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-brand-600 font-bold group-hover:translate-x-2 transition-transform">
                    Baca Selengkapnya
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </div>
            )}

            {/* Other Berita Grid */}
            {displayed.length > 1 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayed.slice(1).map(b => (
                  <article key={b.id}
                    onClick={() => navigate(`/berita/${b.id}`)}
                    className="group flex flex-col cursor-pointer bg-white rounded-3xl p-3 shadow-soft border border-slate-100 hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
                    <div className={`relative h-48 rounded-2xl overflow-hidden mb-4 ${b.foto_url ? '' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}>
                      {b.foto_url ? (
                        <img src={b.foto_url} alt={b.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"/>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-md text-brand-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          {b.kategori}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 pb-3 flex flex-col flex-1">
                      <div className="text-xs font-medium text-slate-400 mb-2">
                        {formatTanggal(b.created_at)}
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg leading-snug mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                        {b.judul}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mt-auto">
                        {b.ringkasan}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
