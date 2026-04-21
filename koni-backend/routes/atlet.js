const router = require('express').Router()
const { v4: uuid } = require('uuid')
const db     = require('../config/db')
const { authenticate, authorize } = require('../middleware/auth')
const upload = require('../middleware/upload')

const guard = [authenticate, authorize('atlet')]

router.get('/me', ...guard, async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, c.nama AS cabor_nama, c.induk AS cabor_induk
      FROM atlet a LEFT JOIN cabor c ON a.cabor_id = c.id WHERE a.id = ?
    `, [req.user.ref_id])
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' })
    res.json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
})

router.put('/me', ...guard, async (req, res, next) => {
  try {
    const { alamat, no_hp } = req.body
    await db.query('UPDATE atlet SET alamat=?, no_hp=? WHERE id=?', [alamat, no_hp, req.user.ref_id])
    res.json({ success: true, message: 'Profil diperbarui.' })
  } catch (err) { next(err) }
})

router.get('/jadwal-latihan', ...guard, async (req, res, next) => {
  try {
    const { bulan } = req.query
    let sql = `
      SELECT pl.*, p.nama AS pelatih_nama, c.nama AS cabor_nama
      FROM program_latihan pl
      JOIN pelatih p ON pl.pelatih_id = p.id
      LEFT JOIN cabor c ON pl.cabor_id = c.id
      WHERE pl.cabor_id = (SELECT cabor_id FROM atlet WHERE id = ?)
    `
    const params = [req.user.ref_id]
    if (bulan) { sql += " AND DATE_FORMAT(pl.tanggal, '%Y-%m') = ?"; params.push(bulan) }
    sql += ' ORDER BY pl.tanggal DESC'
    const [rows] = await db.query(sql, params)
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

router.get('/presensi', ...guard, async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT pr.*, pl.judul AS latihan_judul, pl.tanggal, pl.lokasi, p.nama AS pelatih_nama
      FROM presensi pr
      JOIN program_latihan pl ON pr.program_latihan_id = pl.id
      LEFT JOIN pelatih p ON pl.pelatih_id = p.id
      WHERE pr.atlet_id = ? ORDER BY pl.tanggal DESC
    `, [req.user.ref_id])
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

router.get('/prestasi', ...guard, async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT pr.*, c.nama AS cabor_nama FROM prestasi pr
      LEFT JOIN cabor c ON pr.cabor_id = c.id
      WHERE pr.atlet_id = ? ORDER BY pr.tahun DESC, pr.created_at DESC
    `, [req.user.ref_id])
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

router.get('/sertifikat', ...guard, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM sertifikat WHERE owner_id=? AND owner_type='atlet' ORDER BY created_at DESC",
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
      "INSERT INTO sertifikat (id,owner_id,owner_type,judul,file_url,tipe,keterangan) VALUES (?,?,'atlet',?,?,?,?)",
      [id, req.user.ref_id, judul||req.file.originalname, file_url, tipe||'kejuaraan', keterangan||null]
    )
    res.status(201).json({ success: true, file_url, id })
  } catch (err) { next(err) }
})

router.delete('/sertifikat/:id', ...guard, async (req, res, next) => {
  try {
    await db.query("DELETE FROM sertifikat WHERE id=? AND owner_id=? AND owner_type='atlet'", [req.params.id, req.user.ref_id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

module.exports = router
