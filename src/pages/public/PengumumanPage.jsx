import { useState } from 'react'
import { usePengumuman } from '../../context/PengumumanContext'
import { formatTanggal } from '../../utils/helpers'

function ModalDetail({ item, onClose }) {
  if (!item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in animate-scale-in">
        {/* Header */}
        <div className={`px-6 py-5 flex items-start justify-between gap-4 flex-shrink-0 ${item.tipe === 'penting' ? 'bg-brand-600' : 'bg-slate-900'}`}>
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${item.tipe === 'penting' ? 'text-brand-100' : 'text-slate-400'}`}>
              {item.tipe === 'penting' ? '⚠ Pengumuman Penting' : 'ℹ Informasi Umum'}
            </p>
            <h3 className="text-white font-extrabold leading-snug text-xl">{item.judul}</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white mt-1 flex-shrink-0 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-8 bg-slate-50">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            {item.isi_html ? (
              <div
                className="prose prose-slate max-w-none prose-headings:font-extrabold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-brand-600 prose-a:font-bold hover:prose-a:underline prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: item.isi_html }}
              />
            ) : (
              <p className="text-slate-600 text-base leading-relaxed">{item.isi || 'Tidak ada isi pengumuman yang tersedia.'}</p>
            )}

            {item.file_url && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                  <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Unduh Lampiran
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Diterbitkan: {formatTanggal(item.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PengumumanPage() {
  const { published } = usePengumuman()
  const [selected, setSelected] = useState(null)

  const penting = published.filter(p => p.tipe === 'penting')
  const info    = published.filter(p => p.tipe !== 'penting')

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 font-sans">
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-slate-100 relative overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-slate-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-amber-50 text-amber-600 text-xs font-bold tracking-wider uppercase mb-4">
              📢 Papan Informasi
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Pengumuman Resmi
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Segala bentuk pengumuman penting dan informasi umum yang dikeluarkan oleh KONI Kabupaten Banyumas.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {published.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-soft border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Belum Ada Pengumuman</h3>
            <p className="text-slate-500">Saat ini belum ada pengumuman resmi yang dipublikasikan.</p>
          </div>
        ) : (
          <>
            {/* Pengumuman Penting */}
            {penting.length > 0 && (
              <div>
                <h2 className="flex items-center gap-3 text-xl font-extrabold text-brand-700 mb-6">
                  <span className="w-1.5 h-6 bg-brand-600 rounded-full" />
                  Pengumuman Penting
                </h2>
                <div className="grid gap-4">
                  {penting.map(p => (
                    <div key={p.id} onClick={() => setSelected(p)}
                      className="group cursor-pointer rounded-2xl border-2 border-brand-100 bg-brand-50/50 p-6 hover:bg-brand-50 hover:border-brand-300 hover:shadow-soft transition-all duration-300">
                      <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-brand-500/20 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-extrabold bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full uppercase tracking-widest">Penting</span>
                            <span className="text-xs font-bold text-slate-400">{formatTanggal(p.created_at)}</span>
                          </div>
                          <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-brand-600 transition-colors mb-2 leading-snug">{p.judul}</h3>
                          <div className="flex items-center text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                            Baca Selengkapnya
                            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Informasi Umum */}
            {info.length > 0 && (
              <div>
                <h2 className="flex items-center gap-3 text-xl font-extrabold text-slate-800 mb-6">
                  <span className="w-1.5 h-6 bg-slate-300 rounded-full" />
                  Informasi Umum
                </h2>
                <div className="grid gap-4">
                  {info.map(p => (
                    <div key={p.id} onClick={() => setSelected(p)}
                      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300 hover:shadow-soft transition-all duration-300">
                      <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700 group-hover:scale-110 transition-all">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full uppercase tracking-widest">Informasi</span>
                            <span className="text-xs font-bold text-slate-400">{formatTanggal(p.created_at)}</span>
                          </div>
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-slate-600 transition-colors mb-2 leading-snug">{p.judul}</h3>
                          <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all">
                            Baca Selengkapnya
                            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ModalDetail item={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
