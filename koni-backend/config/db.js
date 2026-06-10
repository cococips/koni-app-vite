const mysql = require('mysql2/promise')

// [PRESENTASI: ORANG 1] Koneksi database menggunakan connection pool dari mysql2
// Connection pool lebih efisien karena bisa menangani banyak request
// secara bersamaan tanpa membuka koneksi baru setiap request.
const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               process.env.DB_PORT     || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'koni_banyumas',
  waitForConnections: true,
  connectionLimit:    10,
  timezone:           '+07:00',
})

pool.getConnection()
  .then(conn => {
    console.log('MySQL connected successfully')
    conn.release()
  })
  .catch(err => {
    console.error('MySQL connection failed:', err.message)
    process.exit(1)
  })

module.exports = pool
