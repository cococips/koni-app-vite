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
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <p className="text-5xl mb-4">📰</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Berita tidak ditemukan</h2>
        <p className="text-gray-500 text-sm mb-6">Berita mungkin telah dihapus atau belum dipublikasikan.</p>
        <button onClick={() => navigate('/berita')} className="btn-primary">← Kembali ke Berita</button>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className={`w-full h-64 md:h-80 ${berita.foto_url ? '' : 'bg-gradient-to-br from-red-700 to-red-900'} relative`}>
        {berita.foto_url && (
          <img src={berita.foto_url} alt={berita.judul} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-3xl mx-auto px-4 w-full pb-8">
            <span className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-full">{berita.kategori}</span>
          </div>
        </div>
      </div>

      {/* Konten */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button onClick={() => navigate('/berita')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Kembali ke Berita
        </button>

        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4">
          {berita.judul}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <span>✍️ {berita.penulis}</span>
          <span>📅 {formatTanggal(berita.created_at)}</span>
        </div>

        {/* Ringkasan */}
        <p className="text-base text-gray-600 leading-relaxed mb-6 font-medium italic border-l-4 border-red-600 pl-4 bg-red-50 py-3 rounded-r-lg">
          {berita.ringkasan}
        </p>

        {/* Isi dari Quill — render HTML */}
        {berita.isi_html ? (
          <div
            className="prose prose-sm max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-red-600 prose-img:rounded-xl prose-blockquote:border-red-600 prose-blockquote:bg-red-50 prose-blockquote:py-1"
            dangerouslySetInnerHTML={{ __html: berita.isi_html }}
          />
        ) : (
          <p className="text-gray-500 text-sm italic">Konten berita belum tersedia.</p>
        )}
      </div>
    </div>
  )
}
