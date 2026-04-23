/**
 * seed.js — Jalankan SEKALI untuk isi database dengan dummy data
 * Cara: node seed.js
 */
require('dotenv').config()
const mysql  = require('mysql2/promise')
const bcrypt = require('bcrypt')

async function seed() {
  const db = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'koni_banyumas',
  })

  console.log('Connected. Generating password hash...')
  const hash = await bcrypt.hash('koni2024', 10)
  console.log('Hash:', hash)

  try {
    // ── CABOR ────────────────────────────────────────────────
    await db.query(`
      INSERT IGNORE INTO cabor (id,nama,induk,singkatan,status) VALUES
      ('cabor-001','Atletik','PASI','ATL','aktif'),
      ('cabor-002','Bulutangkis','PBSI','BDM','aktif'),
      ('cabor-003','Pencak Silat','IPSI','PS','aktif'),
      ('cabor-004','Taekwondo','TI','TKD','aktif'),
      ('cabor-005','Karate','FORKI','KRT','aktif'),
      ('cabor-006','Renang','PRSI','RNM','aktif'),
      ('cabor-007','Bola Voli','PBVSI','BVL','aktif'),
      ('cabor-008','Tenis Meja','PTMSI','TM','aktif'),
      ('cabor-009','Panahan','Perpani','PNH','aktif'),
      ('cabor-010','Senam','PERSANI','SNM','aktif'),
      ('cabor-011','Tinju','Pertina','TJU','aktif'),
      ('cabor-012','Judo','PJI','JDO','aktif'),
      ('cabor-013','Angkat Besi','PABSI','AB','aktif'),
      ('cabor-014','Sepak Bola','PSSI','SB','aktif'),
      ('cabor-015','Bola Basket','Perbasi','BKT','aktif'),
      ('cabor-016','Gulat','PGSI','GLT','aktif'),
      ('cabor-017','Wushu','WI','WSH','aktif'),
      ('cabor-018','Catur','Percasi','CTR','aktif'),
      ('cabor-019','Panjat Tebing','FPTI','PT','aktif'),
      ('cabor-020','Muaythai','PMT','MT','tidak_aktif'),
      ('cabor-021','Kempo','PERKEMI','KMP','tidak_aktif'),
      ('cabor-022','Biliar','PBI','BLR','tidak_aktif')
    `)
    console.log('✓ Cabor inserted')

    // ── PELATIH ──────────────────────────────────────────────
    await db.query(`
      INSERT IGNORE INTO pelatih (id,nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,kategori,grade,status) VALUES
      ('plt-001','3302018010800001','Budi Santoso, S.Pd.','Cilacap','1980-10-08','L','Jl. Sudirman No. 5, Purwokerto','081298760001','cabor-001','teknik','nasional','aktif'),
      ('plt-002','3302014507750001','Sri Wahyuni, S.Or.','Banyumas','1975-07-05','P','Jl. Pahlawan No. 18, Purwokerto','081298760002','cabor-001','fisik','nasional','aktif'),
      ('plt-003','3302011203830001','Hendra Gunawan, S.Pd.','Purwokerto','1983-03-12','L','Jl. Ahmad Yani No. 30, Purwokerto','081298760003','cabor-002','koordinator','nasional','aktif'),
      ('plt-004','3302012908780001','Agus Priyono, S.Or.','Banyumas','1978-08-29','L','Jl. Sokaraja No. 12, Sokaraja','081298760004','cabor-003','teknik','nasional','aktif'),
      ('plt-005','3302011506860001','Roni Prasetya, S.Pd.','Purbalingga','1986-06-15','L','Jl. Ajibarang No. 8, Ajibarang','081298760005','cabor-004','teknik','daerah','aktif'),
      ('plt-006','3302012203850001','Yuli Astuti, S.Or.','Banyumas','1985-03-22','P','Jl. Melati No. 4, Purwokerto','081298760006','cabor-006','teknik','nasional','aktif'),
      ('plt-007','3302010704810001','Susanto Wibowo','Banyumas','1981-04-07','L','Jl. Merdeka No. 22, Banyumas','081298760007','cabor-005','taktik','daerah','aktif'),
      ('plt-008','3302011109700001','Dwi Cahyono, S.Pd.','Cilacap','1970-09-11','L','Jl. Veteran No. 7, Purwokerto','081298760008','cabor-009','koordinator','internasional','aktif'),
      ('plt-009','3302012505900001','Andi Firmansyah, S.Or.','Purwokerto','1990-05-25','L','Jl. Kembaran No. 5, Kembaran','081298760009','cabor-010','fisik','daerah','aktif'),
      ('plt-010','3302011308880001','Nurul Hidayah, S.Pd.','Banyumas','1988-08-13','P','Jl. Anggrek No. 11, Purwokerto','081298760010','cabor-008','teknik','daerah','tidak_aktif')
    `)
    console.log('✓ Pelatih inserted')

    // ── ATLET ────────────────────────────────────────────────
    await db.query(`
      INSERT IGNORE INTO atlet (id,nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,status) VALUES
      ('atl-001','3302010201050001','Ahmad Rizki Pratama','Banyumas','2005-02-01','L','Jl. Veteran No. 12, Purwokerto','081234560001','cabor-001','aktif'),
      ('atl-002','3302016503070001','Dewi Rahayu Lestari','Cilacap','2007-03-25','P','Jl. Mawar No. 7, Sokaraja','081234560002','cabor-002','aktif'),
      ('atl-003','3302011205080001','Fajar Nugroho','Purwokerto','2008-05-12','L','Jl. Baturaden No. 3, Baturaden','081234560003','cabor-003','aktif'),
      ('atl-004','3302012808060001','Siti Nurhaliza','Banyumas','2006-08-28','P','Jl. Diponegoro No. 45, Purwokerto','081234560004','cabor-004','aktif'),
      ('atl-005','3302010110090001','Bagas Aditya Wibowo','Purbalingga','2009-10-01','L','Jl. Kembaran No. 18, Kembaran','081234560005','cabor-005','aktif'),
      ('atl-006','3302011507040001','Rina Kusuma Dewi','Banyumas','2004-07-15','P','Jl. Pahlawan No. 22, Ajibarang','081234560006','cabor-001','aktif'),
      ('atl-007','3302010903050001','Dimas Satria Prabowo','Banyumas','2005-03-09','L','Jl. Cendana No. 5, Purwokerto','081234560007','cabor-006','aktif'),
      ('atl-008','3302012206060001','Anggun Puspita Sari','Purwokerto','2006-06-22','P','Jl. Melati No. 9, Purwokerto','081234560008','cabor-003','aktif'),
      ('atl-009','3302010505070001','Rizal Hermawan','Banyumas','2007-05-05','L','Jl. Sudirman No. 33, Wangon','081234560009','cabor-010','aktif'),
      ('atl-010','3302011811030001','Nadia Febriana','Cilacap','2003-11-18','P','Jl. Kenanga No. 14, Purwokerto','081234560010','cabor-009','aktif'),
      ('atl-011','3302012704080001','Wahyu Tri Handoko','Banyumas','2008-04-27','L','Jl. Sokaraja No. 60, Sokaraja','081234560011','cabor-008','aktif'),
      ('atl-012','3302011402060001','Putri Indah Permata','Purwokerto','2006-02-14','P','Jl. Anggrek No. 3, Kembaran','081234560012','cabor-004','aktif'),
      ('atl-013','3302010807090001','Galih Setiawan','Banyumas','2009-07-08','L','Jl. Pramuka No. 11, Patikraja','081234560013','cabor-017','aktif'),
      ('atl-014','3302012209040001','Larasati Putri Hanum','Banyumas','2004-09-22','P','Jl. Bougenville No. 7, Purwokerto','081234560014','cabor-019','aktif'),
      ('atl-015','3302010301050001','Eko Prasetyo Utomo','Purwokerto','2005-01-03','L','Jl. Cilongok No. 25, Cilongok','081234560015','cabor-013','tidak_aktif'),
      ('atl-016','3302011603070001','Intan Permatasari','Banyumas','2007-03-16','P','Jl. Dahlia No. 8, Ajibarang','081234560016','cabor-018','aktif'),
      ('atl-017','3302010204060001','Rendi Kurniawan','Banyumas','2006-04-02','L','Jl. Sumpiuh No. 17, Sumpiuh','081234560017','cabor-011','aktif'),
      ('atl-018','3302012510080001','Mega Nur Cahyani','Purwokerto','2008-10-25','P','Jl. Banyumas No. 40, Banyumas','081234560018','cabor-006','aktif')
    `)
    console.log('✓ Atlet inserted')

    // ── WASIT ────────────────────────────────────────────────
    await db.query(`
      INSERT IGNORE INTO wasit (id,nik,nama,tempat_lahir,tanggal_lahir,jenis_kelamin,alamat,no_hp,cabor_id,lisensi,grade,status) VALUES
      ('was-001','3302018005750001','Hartono, S.Pd.','Banyumas','1975-05-18','L','Jl. Gatot Subroto No. 10, Purwokerto','082198760001','cabor-003','WAS-D-001','nasional','aktif'),
      ('was-002','3302014502820001','Sari Dewi Anggraini','Purwokerto','1982-02-14','P','Jl. Sokaraja No. 25, Sokaraja','082198760002','cabor-004','WAS-D-002','daerah','aktif'),
      ('was-003','3302011208780001','Bambang Setiadi','Cilacap','1978-08-12','L','Jl. Veteran No. 33, Purwokerto','082198760003','cabor-002','WAS-D-003','internasional','aktif'),
      ('was-004','3302010305850001','Dewi Kurniasih, S.Or.','Banyumas','1985-05-03','P','Jl. Merdeka No. 7, Ajibarang','082198760004','cabor-001','WAS-D-004','nasional','aktif'),
      ('was-005','3302019009900001','Rian Hidayat','Purwokerto','1990-09-19','L','Jl. Diponegoro No. 12, Purwokerto','082198760005','cabor-005','WAS-D-005','daerah','aktif')
    `)
    console.log('✓ Wasit inserted')

    // ── PRESTASI ─────────────────────────────────────────────
    await db.query(`
      INSERT IGNORE INTO prestasi (id,atlet_id,cabor_id,nama_kejuaraan,nomor_lomba,grade,tahun,hasil,medali,penyelenggara,lokasi) VALUES
      ('prs-001','atl-001','cabor-001','Kejuaraan Atletik Jawa Tengah 2024','Lari 100m Putra','daerah',2024,'Juara 1','emas','PASI Jawa Tengah','Semarang'),
      ('prs-002','atl-001','cabor-001','Pekan Olahraga Provinsi Jateng 2023','Lari 200m Putra','daerah',2023,'Juara 2','perak','KONI Jawa Tengah','Solo'),
      ('prs-003','atl-002','cabor-002','Kejuaraan Bulutangkis Nasional Junior','Tunggal Putri U-17','nasional',2024,'Juara 3','perunggu','PBSI','Jakarta'),
      ('prs-004','atl-003','cabor-003','Kejurda Pencak Silat Jawa Tengah 2024','Kelas C Putra (50-55 kg)','daerah',2024,'Juara 1','emas','IPSI Jawa Tengah','Magelang'),
      ('prs-005','atl-004','cabor-004','Open Tournament Taekwondo se-Jateng','Kyorugi Putri U-17','daerah',2024,'Juara 1','emas','TI Jawa Tengah','Purwokerto'),
      ('prs-006','atl-004','cabor-004','Kejuaraan Nasional Taekwondo Junior','Kyorugi Putri U-17','nasional',2023,'Juara 2','perak','Taekwondo Indonesia','Surabaya'),
      ('prs-007','atl-005','cabor-005','O2SN Tingkat Kabupaten Banyumas 2024','Karate Kata Putra SD','daerah',2024,'Juara 1','emas','Dinas Pendidikan','Purwokerto'),
      ('prs-008','atl-006','cabor-001','Kejuaraan Atletik Nasional 2023','Lari 400m Putri','nasional',2023,'Juara 3','perunggu','PASI','Bandung'),
      ('prs-009','atl-007','cabor-006','Kejurda Renang Jawa Tengah 2024','100m Gaya Bebas Putra','daerah',2024,'Juara 2','perak','PRSI Jawa Tengah','Semarang'),
      ('prs-010','atl-008','cabor-003','Porprov Jawa Tengah 2023','Silat Tanding Putri','daerah',2023,'Juara 1','emas','KONI Jawa Tengah','Semarang'),
      ('prs-011','atl-010','cabor-009','Kejuaraan Panahan Nasional 2024','Recurve Putri 30m','nasional',2024,'Juara 1','emas','Perpani','Yogyakarta'),
      ('prs-012','atl-010','cabor-009','SEA Games Simulation Archery 2023','Recurve Putri Individual','internasional',2023,'Juara 2','perak','World Archery','Thailand'),
      ('prs-013','atl-011','cabor-008','Kejurda Tenis Meja Jawa Tengah 2024','Tunggal Putra Kadet','daerah',2024,'Juara 2','perak','PTMSI Jawa Tengah','Purwokerto'),
      ('prs-014','atl-013','cabor-017','Kejuaraan Wushu Nasional Junior 2024','Sanda 60kg Putra','nasional',2024,'Juara 3','perunggu','Wushu Indonesia','Medan'),
      ('prs-015','atl-014','cabor-019','Kejuaraan Panjat Tebing Nasional 2024','Speed Putri','nasional',2024,'Juara 1','emas','FPTI','Bali')
    `)
    console.log('✓ Prestasi inserted')

    // ── USERS — pakai hash yang baru di-generate ──────────────
    const adminExists = await db.query("SELECT id FROM users WHERE username='admin'")
    if (adminExists[0].length === 0) {
      await db.query('INSERT INTO users (id,username,password_hash,role,ref_id) VALUES (?,?,?,?,?)',
        ['user-admin-001', 'admin', hash, 'admin', null])
    } else {
      await db.query('UPDATE users SET password_hash=? WHERE username=?', [hash, 'admin'])
    }

    // Pelatih
    const pelatihUsers = [
      ['user-plt-001','budi.santoso','pelatih','plt-001'],
      ['user-plt-002','sri.wahyuni','pelatih','plt-002'],
      ['user-plt-003','hendra.gunawan','pelatih','plt-003'],
      ['user-plt-004','agus.priyono','pelatih','plt-004'],
      ['user-plt-008','dwi.cahyono','pelatih','plt-008'],
    ]
    for (const [id, username, role, ref_id] of pelatihUsers) {
      await db.query('INSERT IGNORE INTO users (id,username,password_hash,role,ref_id) VALUES (?,?,?,?,?)',
        [id, username, hash, role, ref_id])
    }

    // Atlet
    const atletUsers = [
      ['user-atl-001','ahmad.rizki','atlet','atl-001'],
      ['user-atl-002','dewi.rahayu','atlet','atl-002'],
      ['user-atl-003','fajar.nugroho','atlet','atl-003'],
      ['user-atl-004','siti.nurhaliza','atlet','atl-004'],
      ['user-atl-010','nadia.febriana','atlet','atl-010'],
      ['user-atl-014','larasati.putri','atlet','atl-014'],
    ]
    for (const [id, username, role, ref_id] of atletUsers) {
      await db.query('INSERT IGNORE INTO users (id,username,password_hash,role,ref_id) VALUES (?,?,?,?,?)',
        [id, username, hash, role, ref_id])
    }

    // Wasit
    const wasitUsers = [
      ['user-was-001','hartono','wasit','was-001'],
      ['user-was-002','sari.dewi','wasit','was-002'],
      ['user-was-003','bambang.setiadi','wasit','was-003'],
    ]
    for (const [id, username, role, ref_id] of wasitUsers) {
      await db.query('INSERT IGNORE INTO users (id,username,password_hash,role,ref_id) VALUES (?,?,?,?,?)',
        [id, username, hash, role, ref_id])
    }

    console.log('✓ Users inserted')
    console.log('')
    console.log('====================================')
    console.log('  SEED SELESAI! Akun siap dipakai.')
    console.log('  Semua password: koni2024')
    console.log('====================================')
    console.log('  ADMIN   : admin')
    console.log('  PELATIH : budi.santoso, sri.wahyuni,')
    console.log('            hendra.gunawan, agus.priyono,')
    console.log('            dwi.cahyono')
    console.log('  ATLET   : ahmad.rizki, dewi.rahayu,')
    console.log('            fajar.nugroho, siti.nurhaliza,')
    console.log('            nadia.febriana, larasati.putri')
    console.log('  WASIT   : hartono, sari.dewi,')
    console.log('            bambang.setiadi')
    console.log('====================================')

  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await db.end()
  }
}

seed()
