import { useState } from 'react'
import { useKegiatan } from '../../context/KegiatanContext'
import { formatTanggal } from '../../utils/helpers'

function ModalDetail({ item, onClose }) {
  if (!item) return null
  const isUpcoming = item.tanggal_mulai >= new Date().toISOString().split('T')[0]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in animate-scale-in">
        <div className={`px-6 py-5 flex items-start justify-between gap-4 flex-shrink-0 ${isUpcoming ? 'bg-brand-600' : 'bg-slate-800'}`}>
          <div>
            <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest mb-3 ${isUpcoming ? 'bg-brand-100 text-brand-700' : 'bg-slate-700 text-slate-300'}`}>
              {isUpcoming ? '✨ Upcoming Event' : '✓ Event Selesai'}
            </span>
            <h3 className="text-white font-extrabold text-xl leading-snug">{item.nama}</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white mt-1 flex-shrink-0 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-8 bg-slate-50">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <div className="flex flex-wrap gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <span className="font-bold">{formatTanggal(item.tanggal_mulai)}{item.tanggal_selesai && item.tanggal_selesai !== item.tanggal_mulai ? ` – ${formatTanggal(item.tanggal_selesai)}` : ''}</span>
              </div>
              {item.lokasi && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                  </div>
                  <span className="font-bold">{item.lokasi}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Deskripsi Kegiatan</h4>
            {item.deskripsi_html ? (
              <div
                className="prose prose-slate max-w-none prose-headings:font-extrabold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-brand-600 prose-a:font-bold hover:prose-a:underline prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: item.deskripsi_html }}
              />
            ) : item.deskripsi ? (
              <p className="text-slate-600 text-base leading-relaxed">{item.deskripsi}</p>
            ) : (
              <p className="text-slate-400 text-sm italic">Deskripsi lengkap belum tersedia untuk kegiatan ini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function KegiatanPage() {
  const { published } = useKegiatan()
  const [selected, setSelected] = useState(null)
  const today = new Date().toISOString().split('T')[0]

  const upcoming = published.filter(k => k.tanggal_mulai >= today || k.tanggal_selesai >= today)
  const selesai  = published.filter(k => k.tanggal_mulai < today && (!k.tanggal_selesai || k.tanggal_selesai < today))

  function EventCard({ k }) {
    const isUp = k.tanggal_mulai >= today || (k.tanggal_selesai && k.tanggal_selesai >= today)
    return (
      <div onClick={() => setSelected(k)}
        className="group flex flex-col cursor-pointer bg-white rounded-3xl p-3 shadow-soft border border-slate-100 hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
        <div className={`relative h-48 rounded-2xl overflow-hidden mb-4 ${isUp ? 'bg-gradient-to-br from-brand-600 to-rose-900' : 'bg-gradient-to-br from-slate-600 to-slate-800'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform duration-500 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div className="absolute top-3 left-3">
            <span className={`bg-white/90 backdrop-blur-md text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${isUp ? 'text-brand-600' : 'text-slate-600'}`}>
              {isUp ? 'Upcoming' : 'Selesai'}
            </span>
          </div>
        </div>
        <div className="px-3 pb-3 flex flex-col flex-1">
          <h3 className="font-extrabold text-slate-900 text-lg mb-3 group-hover:text-brand-600 transition-colors leading-snug line-clamp-2">{k.nama}</h3>
          
          <div className="space-y-2 text-sm font-medium text-slate-500 mt-auto">
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>{formatTanggal(k.tanggal_mulai)}{k.tanggal_selesai && k.tanggal_selesai !== k.tanggal_mulai ? ` – ${formatTanggal(k.tanggal_selesai)}` : ''}</span>
            </div>
            {k.lokasi && (
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                <span className="line-clamp-1">{k.lokasi}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex items-center text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
            Lihat Detail Kegiatan
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 font-sans">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -ml-20 -mt-20 opacity-50"></div>
          <div className="relative z-10 text-center md:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold tracking-wider uppercase mb-4">
              🎉 Agenda & Kalender
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Kegiatan & Event.
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto md:mx-0">
              Ikuti terus jadwal kegiatan, kejuaraan, dan event olahraga yang diselenggarakan atau didukung oleh KONI Kabupaten Banyumas.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {published.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-soft border border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Belum Ada Kegiatan</h3>
            <p className="text-slate-500">Saat ini belum ada agenda kegiatan yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {upcoming.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900">Upcoming Events</h2>
                  </div>
                  <span className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">{upcoming.length} Event</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.map(k => <EventCard key={k.id} k={k} />)}
                </div>
              </div>
            )}
            
            {selesai.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="text-2xl font-extrabold text-slate-400">Event Selesai</h2>
                  <div className="flex-1 h-px bg-slate-200 ml-4"></div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selesai.map(k => <EventCard key={k.id} k={k} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ModalDetail item={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
