const router = require('express').Router()
const { v4: uuid } = require('uuid')
const db     = require('../config/db')
const { authenticate, authorize } = require('../middleware/auth')
const upload = require('../middleware/upload')

const guard = [authenticate, authorize('wasit')]

router.get('/me', ...guard, async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT w.*, c.nama AS cabor_nama FROM wasit w
      LEFT JOIN cabor c ON w.cabor_id = c.id WHERE w.id = ?
    `, [req.user.ref_id])
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' })
    res.json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
})

router.put('/me', ...guard, async (req, res, next) => {
  try {
    const { alamat, no_hp } = req.body
    await db.query('UPDATE wasit SET alamat=?, no_hp=? WHERE id=?', [alamat, no_hp, req.user.ref_id])
    res.json({ success: true, message: 'Profil diperbarui.' })
  } catch (err) { next(err) }
})

router.get('/pertandingan', ...guard, async (req, res, next) => {
  try {
    const { bulan } = req.query
    let sql = `
      SELECT pt.*, c.nama AS cabor_nama FROM pertandingan pt
      LEFT JOIN cabor c ON pt.cabor_id = c.id WHERE pt.wasit_id = ?
    `
    const params = [req.user.ref_id]
    if (bulan) { sql += " AND DATE_FORMAT(pt.tanggal, '%Y-%m') = ?"; params.push(bulan) }
    sql += ' ORDER BY pt.tanggal DESC'
    const [rows] = await db.query(sql, params)
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

router.post('/pertandingan', ...guard, async (req, res, next) => {
  try {
    const { nama_event, tanggal, lokasi, cabor_id, keterangan } = req.body
    if (!nama_event || !tanggal)
      return res.status(400).json({ success: false, message: 'Nama event dan tanggal wajib diisi.' })
    const id = uuid()
    await db.query(
      'INSERT INTO pertandingan (id,wasit_id,cabor_id,nama_event,tanggal,lokasi,keterangan) VALUES (?,?,?,?,?,?,?)',
      [id, req.user.ref_id, cabor_id||null, nama_event, tanggal, lokasi||null, keterangan||null]
    )
    res.status(201).json({ success: true, id })
  } catch (err) { next(err) }
})

router.put('/pertandingan/:id', ...guard, async (req, res, next) => {
  try {
    const { nama_event, tanggal, lokasi, cabor_id, keterangan } = req.body
    await db.query(
      'UPDATE pertandingan SET nama_event=?,tanggal=?,lokasi=?,cabor_id=?,keterangan=? WHERE id=? AND wasit_id=?',
      [nama_event, tanggal, lokasi, cabor_id||null, keterangan||null, req.params.id, req.user.ref_id]
    )
    res.json({ success: true })
  } catch (err) { next(err) }
})

router.delete('/pertandingan/:id', ...guard, async (req, res, next) => {
  try {
    await db.query('DELETE FROM pertandingan WHERE id=? AND wasit_id=?', [req.params.id, req.user.ref_id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

router.get('/sertifikat', ...guard, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM sertifikat WHERE owner_id=? AND owner_type='wasit' ORDER BY created_at DESC",
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
      "INSERT INTO sertifikat (id,owner_id,owner_type,judul,file_url,tipe,keterangan) VALUES (?,?,'wasit',?,?,?,?)",
      [id, req.user.ref_id, judul||req.file.originalname, file_url, tipe||'lisensi', keterangan||null]
    )
    res.status(201).json({ success: true, file_url, id })
  } catch (err) { next(err) }
})

router.delete('/sertifikat/:id', ...guard, async (req, res, next) => {
  try {
    await db.query("DELETE FROM sertifikat WHERE id=? AND owner_id=? AND owner_type='wasit'", [req.params.id, req.user.ref_id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

module.exports = router
