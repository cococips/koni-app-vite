const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function seedPengurus() {
  try {
    const jsonPath = path.join(__dirname, '../src/data/pengurus.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    for (const p of data) {
      await db.query(
        `INSERT INTO pengurus (id, nama, jabatan, periode, level, parent_id, order_num)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         nama=VALUES(nama), jabatan=VALUES(jabatan), periode=VALUES(periode),
         level=VALUES(level), parent_id=VALUES(parent_id), order_num=VALUES(order_num)`,
        [p.id, p.nama, p.jabatan, p.periode || '2022-2026', p.level || 2, p.parent_id || null, p.urutan || 99]
      );
    }
    console.log('Successfully seeded pengurus data!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed pengurus data:', error);
    process.exit(1);
  }
}

seedPengurus();
