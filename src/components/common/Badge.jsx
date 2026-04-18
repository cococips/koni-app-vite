/**
 * Badge komponen reusable.
 *
 * Penggunaan:
 *   <Badge type="grade"  value="nasional" />
 *   <Badge type="medali" value="emas" />
 *   <Badge type="status" value="aktif" />
 *   <Badge type="kategori" value="teknik" />
 */

const config = {
  status: {
    aktif:       { label: 'Aktif',       cls: 'bg-emerald-100 text-emerald-800' },
    tidak_aktif: { label: 'Tidak Aktif', cls: 'bg-gray-100 text-gray-500' },
  },
  grade: {
    daerah:        { label: 'Daerah',        cls: 'bg-green-100 text-green-800' },
    nasional:      { label: 'Nasional',      cls: 'bg-blue-100 text-blue-800' },
    internasional: { label: 'Internasional', cls: 'bg-purple-100 text-purple-800' },
  },
  medali: {
    emas:     { label: '🥇 Emas',     cls: 'bg-yellow-100 text-yellow-800' },
    perak:    { label: '🥈 Perak',    cls: 'bg-gray-200 text-gray-700' },
    perunggu: { label: '🥉 Perunggu', cls: 'bg-orange-100 text-orange-800' },
  },
  kategori: {
    koordinator: { label: 'Koordinator', cls: 'bg-indigo-100 text-indigo-800' },
    fisik:       { label: 'Fisik',       cls: 'bg-red-100 text-red-800' },
    teknik:      { label: 'Teknik',      cls: 'bg-cyan-100 text-cyan-800' },
    taktik:      { label: 'Taktik',      cls: 'bg-amber-100 text-amber-800' },
  },
  jk: {
    L: { label: 'Laki-laki',  cls: 'bg-blue-100 text-blue-800' },
    P: { label: 'Perempuan',  cls: 'bg-pink-100 text-pink-800' },
  },
}

export default function Badge({ type, value }) {
  const item = config[type]?.[value]
  if (!item) return <span className="text-xs text-gray-400">-</span>

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.cls}`}>
      {item.label}
    </span>
  )
}
