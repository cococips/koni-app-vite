/**
 * Generate ID unik dengan prefix.
 * Contoh: generateId('atl') → 'atl-1718234500000-a3f'
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`
}

/**
 * Format tanggal ke format Indonesia.
 * '2005-02-01' → '1 Februari 2005'
 */
export function formatTanggal(dateStr) {
  if (!dateStr) return '-'
  const bulan = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember'
  ]
  const d = new Date(dateStr)
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * Hitung umur dari tanggal lahir.
 */
export function hitungUmur(dateStr) {
  if (!dateStr) return '-'
  const today = new Date()
  const lahir = new Date(dateStr)
  let umur = today.getFullYear() - lahir.getFullYear()
  const bulanBeda = today.getMonth() - lahir.getMonth()
  if (bulanBeda < 0 || (bulanBeda === 0 && today.getDate() < lahir.getDate())) {
    umur--
  }
  return umur
}

/**
 * Label kategori pelatih.
 */
export const LABEL_KATEGORI = {
  koordinator: 'Koordinator',
  fisik:       'Fisik',
  teknik:      'Teknik',
  taktik:      'Taktik',
}

/**
 * Label grade prestasi / pelatih.
 */
export const LABEL_GRADE = {
  daerah:        'Daerah',
  nasional:      'Nasional',
  internasional: 'Internasional',
}

/**
 * Label medali.
 */
export const LABEL_MEDALI = {
  emas:     '🥇 Emas',
  perak:    '🥈 Perak',
  perunggu: '🥉 Perunggu',
}

/**
 * Filter array berdasarkan query string (case-insensitive, multi-field).
 * Contoh: filterData(atlet, query, ['nama', 'nik'])
 */
export function filterData(data, query, fields) {
  if (!query.trim()) return data
  const q = query.toLowerCase()
  return data.filter(item =>
    fields.some(field =>
      String(item[field] ?? '').toLowerCase().includes(q)
    )
  )
}

/**
 * Tanggal hari ini dalam format 'YYYY-MM-DD' untuk value default input date.
 */
export function todayStr() {
  return new Date().toISOString().split('T')[0]
}
