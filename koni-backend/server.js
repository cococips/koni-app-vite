require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')

const app = express()

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files untuk akses file upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'))
app.use('/api/admin',   require('./routes/admin'))
app.use('/api/pelatih', require('./routes/pelatih'))
app.use('/api/atlet',   require('./routes/atlet'))
app.use('/api/wasit',   require('./routes/wasit'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))

// Error handler global
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
