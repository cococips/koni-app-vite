const router = require('express').Router()
const { v4: uuid } = require('uuid')
const bcrypt = require('bcrypt')
const db     = require('../config/db')
const { authenticate, authorize } = require('../middleware/auth')

const guard = [authenticate, authorize('admin')]

async function createUserAccount(ref_id, role, username, password) {
  const hash = await bcrypt.hash(password, 10)
  await db.query(
    'INSERT IGNORE INTO users (id,username,password_hash,role,ref_id) VALUES (?,?,?,?,?)',
    [uuid(), username, hash, role, ref_id]
  )
}

// CABOR
router.get('/cabor', ...guard, async (req, res, next) => {
  try { const [rows] = await db.query('SELECT * FROM cabor ORDER BY nama'); res.json({ success: true, data: rows }) } catch(err){next(err)}
})
router.post('/cabor', ...guard, async (req, res, next) => {
  try {
    const { nama, induk, singkatan, status } = req.body
    if (!nama || !induk) return res.status(400).json({ success: false, message: 'Nama dan induk wajib.' })
    const id = uuid()
    await db.query('INSERT INTO cabor (id,nama,induk,singkatan,status) VALUES (?,?,?,?,?)', [id,nama,induk,singkatan||null,status||'aktif'])
    res.status(201).json({ success: true, id })
  } catch(err){next(err)}
})
router.put('/cabor/:id', ...guard, async (req, res, next) => {
  try { const{nama,induk,singkatan,status}=req.body; await db.query('UPDATE cabor SET nama=?,induk=?,singkatan=?,status=? WHERE id=?',[nama,induk,singkatan,status,req.params.id]); res.json({success:true}) } catch(err){next(err)}
})
router.delete('/cabor/:id', ...guard, async (req, res, next) => {
  try { await db.query('DELETE FROM cabor WHERE id=?',[req.params.id]); res.json({success:true}) } catch(err){next(err)}
})

// PELATIH
router.get('/pelatih', ...guard, async (req, res, next) => {
  try { const[rows]=await db.query('SELECT p.*,c.nama AS cabor_nama FROM pelatih p LEFT JOIN cabor c ON p.cabor_id=c.id ORDER BY p.nama'); res.json({success:true,data:rows}) } catch(err){next(err)}
})
router.post('/pelatih', ...guard, async (req, res, next) => {
  try {
    const{nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,kategori,grade,status,username,password}=req.body
    if (!nama||!cabor_id) return res.status(400).json({success:false,message:'Nama dan cabor wajib.'})
    const id=uuid()
    await db.query('INSERT INTO pelatih (id,nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,kategori,grade,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [id,nik||null,nama,tempat_lahir||null,tanggal_lahir||null,jenis_kelamin||'L',alamat||null,no_hp||null,cabor_id,kategori||'teknik',grade||'daerah',status||'aktif'])
    if (username&&password) await createUserAccount(id,'pelatih',username,password)
    res.status(201).json({success:true,id})
  } catch(err){next(err)}
})
router.put('/pelatih/:id', ...guard, async (req, res, next) => {
  try {
    const{nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,kategori,grade,status}=req.body
    await db.query('UPDATE pelatih SET nik=?,nama=?,tempat_lahir=?,tanggal_lahir=?,jenis_kelamin=?,alamat=?,no_hp=?,cabor_id=?,kategori=?,grade=?,status=? WHERE id=?',
      [nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,kategori,grade,status,req.params.id])
    res.json({success:true})
  } catch(err){next(err)}
})
router.delete('/pelatih/:id', ...guard, async (req, res, next) => {
  try { await db.query('DELETE FROM pelatih WHERE id=?',[req.params.id]); res.json({success:true}) } catch(err){next(err)}
})

// ATLET
// [PRESENTASI: ORANG 3] GET semua atlet dengan join ke tabel cabor
router.get('/atlet', ...guard, async (req, res, next) => {
  try { const[rows]=await db.query('SELECT a.*,c.nama AS cabor_nama FROM atlet a LEFT JOIN cabor c ON a.cabor_id=c.id ORDER BY a.nama'); res.json({success:true,data:rows}) } catch(err){next(err)}
})
// [PRESENTASI: ORANG 3] POST tambah atlet + buat akun user otomatis kalau ada username
router.post('/atlet', ...guard, async (req, res, next) => {
  try {
    const{nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,status,username,password}=req.body
    if (!nama||!cabor_id) return res.status(400).json({success:false,message:'Nama dan cabor wajib.'})
    const id=uuid()
    await db.query('INSERT INTO atlet (id,nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,status) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [id,nik||null,nama,tempat_lahir||null,tanggal_lahir||null,jenis_kelamin||'L',alamat||null,no_hp||null,cabor_id,status||'aktif'])
    // [PRESENTASI: ORANG 3] Buat akun login atlet otomatis jika username diisi
    if (username&&password) await createUserAccount(id,'atlet',username,password)
    res.status(201).json({success:true,id})
  } catch(err){next(err)}
})
router.put('/atlet/:id', ...guard, async (req, res, next) => {
  try {
    const{nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,status}=req.body
    await db.query('UPDATE atlet SET nik=?,nama=?,tempat_lahir=?,tanggal_lahir=?,jenis_kelamin=?,alamat=?,no_hp=?,cabor_id=?,status=? WHERE id=?',
      [nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,status,req.params.id])
    res.json({success:true})
  } catch(err){next(err)}
})
router.delete('/atlet/:id', ...guard, async (req, res, next) => {
  try { await db.query('DELETE FROM atlet WHERE id=?',[req.params.id]); res.json({success:true}) } catch(err){next(err)}
})

// WASIT
router.get('/wasit', ...guard, async (req, res, next) => {
  try { const[rows]=await db.query('SELECT w.*,c.nama AS cabor_nama FROM wasit w LEFT JOIN cabor c ON w.cabor_id=c.id ORDER BY w.nama'); res.json({success:true,data:rows}) } catch(err){next(err)}
})
router.post('/wasit', ...guard, async (req, res, next) => {
  try {
    const{nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,lisensi,grade,status,username,password}=req.body
    if (!nama) return res.status(400).json({success:false,message:'Nama wajib.'})
    const id=uuid()
    await db.query('INSERT INTO wasit (id,nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,lisensi,grade,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [id,nik||null,nama,tempat_lahir||null,tanggal_lahir||null,jenis_kelamin||'L',alamat||null,no_hp||null,cabor_id||null,lisensi||null,grade||'daerah',status||'aktif'])
    if (username&&password) await createUserAccount(id,'wasit',username,password)
    res.status(201).json({success:true,id})
  } catch(err){next(err)}
})
router.put('/wasit/:id', ...guard, async (req, res, next) => {
  try {
    const{nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,lisensi,grade,status}=req.body
    await db.query('UPDATE wasit SET nik=?,nama=?,tempat_lahir=?,tanggal_lahir=?,jenis_kelamin=?,alamat=?,no_hp=?,cabor_id=?,lisensi=?,grade=?,status=? WHERE id=?',
      [nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,lisensi,grade,status,req.params.id])
    res.json({success:true})
  } catch(err){next(err)}
})
router.delete('/wasit/:id', ...guard, async (req, res, next) => {
  try { await db.query('DELETE FROM wasit WHERE id=?',[req.params.id]); res.json({success:true}) } catch(err){next(err)}
})

// Buat akun
router.post('/create-account', ...guard, async (req, res, next) => {
  try {
    const{ref_id,role,username,password}=req.body
    if (!ref_id||!role||!username||!password) return res.status(400).json({success:false,message:'Semua field wajib.'})
    await createUserAccount(ref_id,role,username,password)
    res.json({success:true,message:`Akun ${role} berhasil dibuat.`})
  } catch(err){next(err)}
})


router.get('/prestasi', ...guard, async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT pr.*, a.nama AS atlet_nama, c.nama AS cabor_nama
      FROM prestasi pr
      LEFT JOIN atlet a ON pr.atlet_id = a.id
      LEFT JOIN cabor c ON pr.cabor_id = c.id
      ORDER BY pr.tahun DESC, pr.created_at DESC
    `)
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

// GET /api/admin/stats — ringkasan untuk dashboard admin
router.get('/stats', ...guard, async (req, res, next) => {
  try {
    const [[{ totalAtlet }]]   = await db.query("SELECT COUNT(*) AS totalAtlet FROM atlet WHERE status='aktif'")
    const [[{ totalPelatih }]] = await db.query("SELECT COUNT(*) AS totalPelatih FROM pelatih WHERE status='aktif'")
    const [[{ totalCabor }]]   = await db.query("SELECT COUNT(*) AS totalCabor FROM cabor WHERE status='aktif'")
    const [[{ totalWasit }]]   = await db.query("SELECT COUNT(*) AS totalWasit FROM wasit WHERE status='aktif'")
    const [[{ totalPrestasi }]] = await db.query("SELECT COUNT(*) AS totalPrestasi FROM prestasi")
    const [[{ medaliEmas }]]   = await db.query("SELECT COUNT(*) AS medaliEmas FROM prestasi WHERE medali='emas'")
    const [[{ medaliPerak }]]  = await db.query("SELECT COUNT(*) AS medaliPerak FROM prestasi WHERE medali='perak'")
    const [[{ medaliPerunggu }]] = await db.query("SELECT COUNT(*) AS medaliPerunggu FROM prestasi WHERE medali='perunggu'")
    res.json({
      success: true,
      data: { totalAtlet, totalPelatih, totalCabor, totalWasit, totalPrestasi, medaliEmas, medaliPerak, medaliPerunggu }
    })
  } catch (err) { next(err) }
})


module.exports = router
