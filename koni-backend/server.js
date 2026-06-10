require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')

const app = express()

// [PRESENTASI: ORANG 1] 1. CORS dikonfigurasi agar hanya menerima request dari frontend di port 5173
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// [PRESENTASI: ORANG 1] 2. File upload diakses secara statis dari folder /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// [PRESENTASI: ORANG 1] 3. Setiap kelompok route dipisah per file agar kode lebih terorganisir
app.use('/api/auth',    require('./routes/auth'))
app.use('/api/admin',   require('./routes/admin'))
app.use('/api/pelatih', require('./routes/pelatih'))
app.use('/api/atlet',   require('./routes/atlet'))
app.use('/api/wasit',   require('./routes/wasit'))
app.use('/api/public',  require('./routes/public')) // Tambahkan route public untuk stats landing page

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message })
})

const PORT = process.env.PORT || 5000
// [PRESENTASI: ORANG 1] 4. Server berjalan di port 5000 terpisah dari frontend
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))