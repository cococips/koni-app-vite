const router = require('express').Router()
const { v4: uuid } = require('uuid')
const db     = require('../config/db')
const { authenticate, authorize } = require('../middleware/auth')
const upload = require('../middleware/upload')

const guard = [authenticate, authorize('pelatih')]

router.get('/me', ...guard, async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.nama AS cabor_nama, c.induk AS cabor_induk
      FROM pelatih p LEFT JOIN cabor c ON p.cabor_id = c.id
      WHERE p.id = ?
    `, [req.user.ref_id])
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' })
    res.json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
})

router.put('/me', ...guard, async (req, res, next) => {
  try {
    const { alamat, no_hp } = req.body
    await db.query('UPDATE pelatih SET alamat=?, no_hp=? WHERE id=?', [alamat, no_hp, req.user.ref_id])
    res.json({ success: true, message: 'Profil diperbarui.' })
  } catch (err) { next(err) }
})

router.get('/program-latihan', ...guard, async (req, res, next) => {
  try {
    const { bulan } = req.query
    let sql = `
      SELECT pl.*, c.nama AS cabor_nama,
        (SELECT COUNT(*) FROM presensi pr WHERE pr.program_latihan_id = pl.id AND pr.status = 'hadir') AS total_hadir
      FROM program_latihan pl LEFT JOIN cabor c ON pl.cabor_id = c.id
      WHERE pl.pelatih_id = ?
    `
    const params = [req.user.ref_id]
    if (bulan) { sql += " AND DATE_FORMAT(pl.tanggal, '%Y-%m') = ?"; params.push(bulan) }
    sql += ' ORDER BY pl.tanggal DESC'
    const [rows] = await db.query(sql, params)
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

router.post('/program-latihan', ...guard, async (req, res, next) => {
  try {
    const { judul, deskripsi, tanggal, durasi_menit, lokasi } = req.body
    if (!judul || !tanggal) return res.status(400).json({ success: false, message: 'Judul dan tanggal wajib diisi.' })
    const [pRows] = await db.query('SELECT cabor_id FROM pelatih WHERE id = ?', [req.user.ref_id])
    const cabor_id = pRows[0]?.cabor_id || null
    const id = uuid()
    await db.query(
      'INSERT INTO program_latihan (id,pelatih_id,cabor_id,judul,deskripsi,tanggal,durasi_menit,lokasi) VALUES (?,?,?,?,?,?,?,?)',
      [id, req.user.ref_id, cabor_id, judul, deskripsi||null, tanggal, durasi_menit||90, lokasi||null]
    )
    res.status(201).json({ success: true, id })
  } catch (err) { next(err) }
})

router.put('/program-latihan/:id', ...guard, async (req, res, next) => {
  try {
    const { judul, deskripsi, tanggal, durasi_menit, lokasi } = req.body
    await db.query(
      'UPDATE program_latihan SET judul=?,deskripsi=?,tanggal=?,durasi_menit=?,lokasi=? WHERE id=? AND pelatih_id=?',
      [judul, deskripsi, tanggal, durasi_menit, lokasi, req.params.id, req.user.ref_id]
    )
    res.json({ success: true })
  } catch (err) { next(err) }
})

router.delete('/program-latihan/:id', ...guard, async (req, res, next) => {
  try {
    await db.query('DELETE FROM program_latihan WHERE id=? AND pelatih_id=?', [req.params.id, req.user.ref_id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

router.get('/presensi/:program_id', ...guard, async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT a.id AS atlet_id, a.nama, a.foto,
        COALESCE(pr.status, 'alpha') AS status, pr.keterangan, pr.id AS presensi_id
      FROM atlet a
      LEFT JOIN presensi pr ON pr.atlet_id = a.id AND pr.program_latihan_id = ?
      WHERE a.cabor_id = (SELECT cabor_id FROM pelatih WHERE id = ?) AND a.status = 'aktif'
      ORDER BY a.nama
    `, [req.params.program_id, req.user.ref_id])
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

router.post('/presensi', ...guard, async (req, res, next) => {
  try {
    const { program_latihan_id, data } = req.body
    if (!program_latihan_id || !Array.isArray(data))
      return res.status(400).json({ success: false, message: 'Data tidak valid.' })
    // [PRESENTASI: ORANG 4] Upsert presensi — update kalau sudah ada, insert kalau belum
    for (const item of data) {
      const [existing] = await db.query(
        'SELECT id FROM presensi WHERE program_latihan_id=? AND atlet_id=?',
        [program_latihan_id, item.atlet_id]
      )
      if (existing.length > 0) {
        await db.query(
          'UPDATE presensi SET status=?, keterangan=? WHERE program_latihan_id=? AND atlet_id=?',
          [item.status, item.keterangan||null, program_latihan_id, item.atlet_id]
        )
      } else {
        await db.query(
          'INSERT INTO presensi (id,program_latihan_id,atlet_id,status,keterangan) VALUES (?,?,?,?,?)',
          [uuid(), program_latihan_id, item.atlet_id, item.status, item.keterangan||null]
        )
      }
    }
    res.json({ success: true, message: 'Presensi disimpan.' })
  } catch (err) { next(err) }
})

router.get('/sertifikat', ...guard, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM sertifikat WHERE owner_id=? AND owner_type='pelatih' ORDER BY created_at DESC",
      [req.user.ref_id]
    )
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

router.post('/sertifikat', ...guard, (req, res, next) => {
  req.uploadSubdir = 'sertifikat'; next()
}, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'File tidak ditemukan.' })
    const { judul, tipe, keterangan } = req.body
    const file_url = `/uploads/sertifikat/${req.file.filename}`
    const id = uuid()
    await db.query(
      "INSERT INTO sertifikat (id,owner_id,owner_type,judul,file_url,tipe,keterangan) VALUES (?,?,'pelatih',?,?,?,?)",
      [id, req.user.ref_id, judul||req.file.originalname, file_url, tipe||'lainnya', keterangan||null]
    )
    res.status(201).json({ success: true, file_url, id })
  } catch (err) { next(err) }
})

router.delete('/sertifikat/:id', ...guard, async (req, res, next) => {
  try {
    await db.query("DELETE FROM sertifikat WHERE id=? AND owner_id=? AND owner_type='pelatih'", [req.params.id, req.user.ref_id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

router.get('/atlet-cabor', ...guard, async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, c.nama AS cabor_nama FROM atlet a
      LEFT JOIN cabor c ON a.cabor_id = c.id
      WHERE a.cabor_id = (SELECT cabor_id FROM pelatih WHERE id = ?) AND a.status = 'aktif'
      ORDER BY a.nama
    `, [req.user.ref_id])
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

module.exports = router
