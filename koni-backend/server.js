require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ⬇️ Pastikan baris ini ADA dan pathnya benar
app.use('/api/auth',    require('./routes/auth'))
app.use('/api/admin',   require('./routes/admin'))
app.use('/api/pelatih', require('./routes/pelatih'))
app.use('/api/atlet',   require('./routes/atlet'))
app.use('/api/wasit',   require('./routes/wasit'))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))