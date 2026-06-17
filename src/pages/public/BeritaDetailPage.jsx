import { useParams, useNavigate } from 'react-router-dom'
import { useBerita } from '../../context/BeritaContext'
import { formatTanggal } from '../../utils/helpers'

export default function BeritaDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { beritaPublished } = useBerita()

  const berita = beritaPublished.find(b => b.id === id)

  if (!berita) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-slate-50 font-sans">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-soft mb-6">
          <span className="text-4xl">📰</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Berita Tidak Ditemukan</h2>
        <p className="text-slate-500 max-w-md mb-8">Berita yang Anda cari mungkin telah dihapus, dipindahkan, atau belum dipublikasikan.</p>
        <button onClick={() => navigate('/berita')} className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-sm hover:shadow-glow transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Kembali ke Berita
        </button>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-20 pb-20 font-sans">
      {/* Floating Back Button & Header Image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-slate-900">
        {berita.foto_url ? (
          <img src={berita.foto_url} alt={berita.judul} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/10 to-transparent"></div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        {/* Tombol Kembali */}
        <div className="mb-4">
          <button onClick={() => navigate('/berita')} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-xl text-sm font-bold transition-all border border-white/20 w-fit">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Kembali
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-soft border border-slate-100">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-brand-50 text-brand-600 text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
              {berita.kategori}
            </span>
            <span className="text-slate-400 font-medium text-sm flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {formatTanggal(berita.created_at)}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
            {berita.judul}
          </h1>

          <div className="flex items-center gap-4 py-4 border-y border-slate-100 mb-8">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Penulis</p>
              <p className="text-sm font-bold text-slate-900">{berita.penulis || 'Admin KONI'}</p>
            </div>
          </div>

          {/* Highlight / Ringkasan */}
          {berita.ringkasan && (
            <div className="bg-slate-50 border-l-4 border-brand-500 p-6 rounded-r-2xl mb-8">
              <p className="text-lg text-slate-700 font-medium italic leading-relaxed">
                {berita.ringkasan}
              </p>
            </div>
          )}

          {/* HTML Content (Quill Render) */}
          <div className="prose prose-slate prose-lg max-w-none 
            prose-headings:font-extrabold prose-headings:text-slate-900 
            prose-p:text-slate-600 prose-p:leading-relaxed 
            prose-a:text-brand-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl prose-img:shadow-soft
            prose-blockquote:border-brand-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-slate-700
            prose-strong:text-slate-900 prose-strong:font-extrabold"
          >
            {berita.isi_html ? (
              <div dangerouslySetInnerHTML={{ __html: berita.isi_html }} />
            ) : (
              <p className="text-slate-400 italic text-center py-12">Konten berita belum tersedia atau sedang dalam proses pembaruan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
