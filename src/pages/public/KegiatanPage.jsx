import { useState } from 'react'
import { useKegiatan } from '../../context/KegiatanContext'
import { formatTanggal } from '../../utils/helpers'

function ModalDetail({ item, onClose }) {
  if (!item) return null
  const isUpcoming = item.tanggal_mulai >= new Date().toISOString().split('T')[0]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className={`px-6 py-4 flex items-start justify-between gap-4 flex-shrink-0 ${isUpcoming ? 'bg-red-700' : 'bg-gray-700'}`}>
          <div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isUpcoming ? 'bg-emerald-400 text-emerald-900' : 'bg-white/20 text-white'}`}>
              {isUpcoming ? 'Upcoming' : 'Selesai'}
            </span>
            <h3 className="text-white font-bold text-lg leading-snug mt-2">{item.nama}</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white mt-1 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {/* Info singkat */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5 pb-5 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>{formatTanggal(item.tanggal_mulai)}{item.tanggal_selesai && item.tanggal_selesai !== item.tanggal_mulai ? ` – ${formatTanggal(item.tanggal_selesai)}` : ''}</span>
            </div>
            {item.lokasi && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                <span>{item.lokasi}</span>
              </div>
            )}
          </div>
          {/* Konten rich text atau deskripsi biasa */}
          {item.deskripsi_html ? (
            <div
              className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: item.deskripsi_html }}
            />
          ) : item.deskripsi ? (
            <p className="text-gray-700 text-sm leading-relaxed">{item.deskripsi}</p>
          ) : (
            <p className="text-gray-400 text-sm italic">Deskripsi belum tersedia.</p>
          )}
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
        className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
        <div className={`h-40 flex items-center justify-center relative ${isUp ? 'bg-gradient-to-br from-red-600 to-red-900' : 'bg-gradient-to-br from-gray-500 to-gray-700'}`}>
          <svg className="w-14 h-14 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isUp ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white'}`}>
              {isUp ? 'Upcoming' : 'Selesai'}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-red-600 transition-colors leading-snug">{k.nama}</h3>
          <div className="space-y-1.5 text-xs text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>{formatTanggal(k.tanggal_mulai)}{k.tanggal_selesai && k.tanggal_selesai !== k.tanggal_mulai ? ` – ${formatTanggal(k.tanggal_selesai)}` : ''}</span>
            </div>
            {k.lokasi && (
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                <span>{k.lokasi}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-red-600 font-semibold mt-3">Lihat detail →</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-2">🎉 Agenda</p>
          <h1 className="text-3xl font-black text-white">Kegiatan & Event</h1>
          <p className="text-gray-400 mt-2 text-sm">Agenda kegiatan dan event KONI Kabupaten Banyumas</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {published.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-3">📅</p>
            <p className="font-medium">Belum ada kegiatan</p>
          </div>
        ) : (
          <div className="space-y-12">
            {upcoming.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <h2 className="text-xl font-black text-gray-900">Upcoming Events</h2>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{upcoming.length} event</span>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                  {upcoming.map(k => <EventCard key={k.id} k={k} />)}
                </div>
              </div>
            )}
            {selesai.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-gray-500 mb-6">Event Selesai</h2>
                <div className="grid md:grid-cols-3 gap-5">
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
