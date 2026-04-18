import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/dashboard': { title: 'Dashboard',         sub: 'Ringkasan data KONI Kab. Banyumas' },
  '/atlet':     { title: 'Data Atlet',         sub: 'Kelola biodata dan data atlet' },
  '/pelatih':   { title: 'Data Pelatih',       sub: 'Kelola data pelatih olahraga' },
  '/cabor':     { title: 'Cabang Olahraga',    sub: 'Daftar cabang olahraga KONI' },
  '/prestasi':  { title: 'Prestasi & Piagam',  sub: 'Rekap pencapaian atlet' },
}

export default function Navbar() {
  const { pathname } = useLocation()
  const page = pageTitles[pathname] ?? { title: 'KONI', sub: '' }

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
      {/* Judul halaman */}
      <div>
        <h1 className="text-base font-semibold text-gray-800">{page.title}</h1>
        {page.sub && (
          <p className="text-xs text-gray-400 mt-0.5">{page.sub}</p>
        )}
      </div>

      {/* Info user (statis untuk UTS) */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-700">Admin KONI</p>
          <p className="text-xs text-gray-400">Kab. Banyumas</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">A</span>
        </div>
      </div>
    </header>
  )
}
