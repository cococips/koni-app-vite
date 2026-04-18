import { useAtlet }   from '../context/AtletContext'
import { usePelatih } from '../context/PelatihContext'
import { useCabor }   from '../context/CaborContext'
import { usePrestasi } from '../context/PrestasiContext'

function StatCard({ label, value, sub, color = 'blue', icon }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-700 border-blue-100',
    green:  'bg-emerald-50 text-emerald-700 border-emerald-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    gold:   'bg-yellow-50 text-yellow-700 border-yellow-100',
  }
  return (
    <div className={`card p-5 border ${colors[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  )
}

function MedaliRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${color}`}>{value}</span>
    </div>
  )
}

export default function Dashboard() {
  const { atlet, atletAktif, totalL, totalP } = useAtlet()
  const { pelatih, pelatihAktif }             = usePelatih()
  const { cabor, caborAktif }                 = useCabor()
  const { prestasi, statMedali, statGrade }   = usePrestasi()

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Atlet"
          value={atlet.length}
          sub={`${atletAktif.length} aktif · ${totalL}L ${totalP}P`}
          color="blue"
          icon="🏃"
        />
        <StatCard
          label="Total Pelatih"
          value={pelatih.length}
          sub={`${pelatihAktif.length} aktif`}
          color="green"
          icon="👨‍🏫"
        />
        <StatCard
          label="Cabang Olahraga"
          value={cabor.length}
          sub={`${caborAktif.length} aktif`}
          color="purple"
          icon="🏅"
        />
        <StatCard
          label="Total Prestasi"
          value={prestasi.length}
          sub={`${statGrade.nasional} nasional · ${statGrade.internasional} int'l`}
          color="gold"
          icon="🏆"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Perolehan Medali */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Perolehan Medali</h2>
          <MedaliRow label="🥇 Emas"     value={statMedali.emas}     color="text-yellow-600" />
          <MedaliRow label="🥈 Perak"    value={statMedali.perak}    color="text-gray-500" />
          <MedaliRow label="🥉 Perunggu" value={statMedali.perunggu} color="text-orange-600" />
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-400">Total prestasi</span>
            <span className="font-semibold text-gray-700">{prestasi.length}</span>
          </div>
        </div>

        {/* Level Prestasi */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Level Prestasi</h2>
          <MedaliRow label="🌍 Internasional" value={statGrade.internasional} color="text-purple-600" />
          <MedaliRow label="🇮🇩 Nasional"     value={statGrade.nasional}      color="text-blue-600" />
          <MedaliRow label="📍 Daerah"        value={statGrade.daerah}        color="text-green-600" />
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-400">Cabor aktif</span>
            <span className="font-semibold text-gray-700">{caborAktif.length} cabor</span>
          </div>
        </div>
      </div>

      {/* Prestasi terbaru */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Prestasi Terbaru</h2>
        <div className="table-wrapper">
          <table className="tbl">
            <thead>
              <tr>
                <th>Kejuaraan</th>
                <th>Nomor Lomba</th>
                <th>Hasil</th>
                <th>Grade</th>
                <th>Tahun</th>
              </tr>
            </thead>
            <tbody>
              {[...prestasi]
                .sort((a, b) => b.tahun - a.tahun)
                .slice(0, 5)
                .map(p => (
                  <tr key={p.id}>
                    <td className="max-w-xs truncate">{p.nama_kejuaraan}</td>
                    <td>{p.nomor_lomba}</td>
                    <td>{p.hasil}</td>
                    <td>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        ${p.grade === 'internasional' ? 'bg-purple-100 text-purple-800'
                          : p.grade === 'nasional' ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'}`}>
                        {p.grade}
                      </span>
                    </td>
                    <td>{p.tahun}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
