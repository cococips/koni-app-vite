import { usePengurus } from '../../context/PengurusContext'

export default function PengurusPage() {
  const { published } = usePengurus()

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-2">👥 Kepengurusan</p>
          <h1 className="text-3xl font-black text-white">Pengurus KONI Banyumas</h1>
          <p className="text-gray-400 mt-2 text-sm">Struktur kepengurusan KONI Kabupaten Banyumas Periode 2022 – 2026</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {published.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">👥</p>
            <p className="font-medium">Data pengurus belum tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {published.map((p, i) => (
              <div key={p.id} className="text-center group">
                <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-4 transition-all ${i === 0 ? 'bg-red-600 border-red-100 group-hover:border-red-300 shadow-lg shadow-red-100' : 'bg-gray-800 border-gray-100 group-hover:border-gray-300'}`}>
                  <span className="text-white font-black text-2xl">
                    {p.nama.split(' ').map(w => w[0]).filter(Boolean).slice(0,2).join('').toUpperCase()}
                  </span>
                </div>
                <p className="font-bold text-gray-900 text-sm leading-snug">{p.nama}</p>
                <p className={`text-xs font-semibold mt-1 ${i === 0 ? 'text-red-600' : 'text-gray-500'}`}>{p.jabatan}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.periode}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
