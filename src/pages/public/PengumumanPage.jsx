import { useState } from 'react'
import { usePengumuman } from '../../context/PengumumanContext'
import { formatTanggal } from '../../utils/helpers'

function ModalDetail({ item, onClose }) {
  if (!item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 flex items-start justify-between gap-4 flex-shrink-0 ${item.tipe === 'penting' ? 'bg-red-600' : 'bg-gray-800'}`}>
          <div>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">
              {item.tipe === 'penting' ? '⚠ Pengumuman Penting' : 'ℹ Informasi'}
            </p>
            <h3 className="text-white font-bold leading-snug text-lg">{item.judul}</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white mt-1 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Body scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {item.isi_html ? (
            <div
              className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: item.isi_html }}
            />
          ) : (
            <p className="text-gray-700 text-sm leading-relaxed">{item.isi || 'Tidak ada isi pengumuman.'}</p>
          )}

          {item.file_url && (
            <div className="mt-6">
              <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex w-max">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Unduh Lampiran PDF
              </a>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
            Diumumkan: {formatTanggal(item.created_at)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PengumumanPage() {
  const { published } = usePengumuman()
  const [selected, setSelected] = useState(null)

  // Pisah penting vs info
  const penting = published.filter(p => p.tipe === 'penting')
  const info    = published.filter(p => p.tipe !== 'penting')

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-2">📢 Informasi Resmi</p>
          <h1 className="text-3xl font-black text-white">Pengumuman</h1>
          <p className="text-gray-400 mt-2 text-sm">Pengumuman dan informasi resmi dari KONI Kabupaten Banyumas</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {published.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-3">📭</p>
            <p className="font-medium">Belum ada pengumuman</p>
          </div>
        ) : (
          <>
            {/* Pengumuman Penting */}
            {penting.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 text-base font-black text-red-700 mb-4">
                  <span className="w-1 h-5 bg-red-600 rounded-full" />
                  Pengumuman Penting
                </h2>
                <div className="space-y-3">
                  {penting.map(p => (
                    <div key={p.id} onClick={() => setSelected(p)}
                      className="group cursor-pointer rounded-2xl border-2 border-red-200 bg-red-50 p-5 hover:border-red-400 hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0 text-white text-lg">⚠</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Penting</span>
                            <span className="text-xs text-gray-400">{formatTanggal(p.created_at)}</span>
                          </div>
                          <h3 className="font-bold text-red-900 group-hover:text-red-600 transition-colors">{p.judul}</h3>
                          <p className="text-xs text-red-600 font-semibold mt-2">Klik untuk baca selengkapnya →</p>
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
                <h2 className="flex items-center gap-2 text-base font-black text-gray-800 mb-4">
                  <span className="w-1 h-5 bg-gray-400 rounded-full" />
                  Informasi Umum
                </h2>
                <div className="space-y-3">
                  {info.map(p => (
                    <div key={p.id} onClick={() => setSelected(p)}
                      className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 hover:border-blue-200 hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 text-white text-lg">ℹ</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Informasi</span>
                            <span className="text-xs text-gray-400">{formatTanggal(p.created_at)}</span>
                          </div>
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{p.judul}</h3>
                          <p className="text-xs text-blue-600 font-semibold mt-2">Klik untuk baca selengkapnya →</p>
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
