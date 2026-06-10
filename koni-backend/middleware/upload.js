const multer  = require('multer')
const path    = require('path')
const fs      = require('fs')

// Pastikan folder uploads ada
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

// [PRESENTASI: ORANG 4] Konfigurasi Multer untuk menyimpan file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Subfolder per tipe: sertifikat, foto
    const sub  = req.uploadSubdir || 'sertifikat'
    const dest = path.join(UPLOAD_DIR, sub)
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    const ext      = path.extname(file.originalname).toLowerCase()
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`
    cb(null, safeName)
  },
})

// Filter: hanya izinkan gambar dan PDF
const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
  const ext     = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
})

module.exports = upload
