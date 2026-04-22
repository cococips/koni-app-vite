const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Sesuaikan path jika berbeda

// Endpoint POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
    }

    // --- BYPASS SEMENTARA UNTUK ADMIN UTS ---
    // Karena mungkin kamu belum input data admin ke database MySQL,
    // kita buatkan "jalur khusus" untuk admin:koni2024 agar langsung sukses.
    if (username === 'admin' && password === 'koni2024') {
      const payload = { id: 'admin-123', username: 'admin', role: 'admin' };
      // Pastikan di file .env backend kamu ada JWT_SECRET=bebas_apa_saja
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'rahasia_uts_koni', { expiresIn: '1d' });
      
      return res.json({ 
        success: true, 
        token: token, 
        user: payload 
      });
    }
    // ----------------------------------------

    // Logika asli untuk user lain (Pelatih, Atlet, Wasit) yang ngecek ke Database:
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Username tidak ditemukan.' });
    }

    // Cek kecocokan password yang di-hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password salah.' });
    }

    // Buat token JWT jika sukses
    const payload = { 
      id: user.id, 
      username: user.username, 
      role: user.role, 
      ref_id: user.ref_id 
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'rahasia_uts_koni', { expiresIn: '1d' });

    res.json({ 
      success: true, 
      token: token, 
      user: payload 
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;