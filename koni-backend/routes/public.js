const router = require('express').Router()
const db     = require('../config/db')

/**
 * GET /api/public/stats
 * Statistik untuk landing page — tidak butuh login
 */
router.get('/stats', async (req, res, next) => {
  try {
    const [[{ totalAtlet }]]    = await db.query("SELECT COUNT(*) AS totalAtlet FROM atlet WHERE status='aktif'")
    const [[{ totalPelatih }]]  = await db.query("SELECT COUNT(*) AS totalPelatih FROM pelatih WHERE status='aktif'")
    const [[{ totalWasit }]]    = await db.query("SELECT COUNT(*) AS totalWasit FROM wasit WHERE status='aktif'")
    const [[{ totalPrestasi }]] = await db.query("SELECT COUNT(*) AS totalPrestasi FROM prestasi")
    const [[{ medaliEmas }]]    = await db.query("SELECT COUNT(*) AS medaliEmas FROM prestasi WHERE medali='emas'")
    const [caborAktif]          = await db.query("SELECT id, nama, induk, singkatan FROM cabor WHERE status='aktif' ORDER BY nama")

    res.json({
      success: true,
      data: {
        totalAtlet, totalPelatih, totalWasit, totalPrestasi, medaliEmas,
        totalCabor: caborAktif.length,
        caborAktif,
      }
    })
  } catch (err) { next(err) }
})

/**
 * GET /api/public/pengurus
 * Ambil daftar pengurus publik
 */
router.get('/pengurus', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM pengurus ORDER BY order_num ASC');
    res.json({ success: true, data: rows })
  } catch(err){next(err)}
})

module.exports = router
