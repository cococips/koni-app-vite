const jwt = require('jsonwebtoken')

/**
 * Verifikasi JWT token dari header Authorization.
 * Menyimpan payload ke req.user.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kedaluwarsa.' })
  }
}

/**
 * Guard berdasarkan role.
 * Contoh: authorize('admin', 'pelatih')
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Belum terautentikasi.' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Diperlukan role: ${roles.join(' atau ')}.`
      })
    }
    next()
  }
}

module.exports = { authenticate, authorize }
