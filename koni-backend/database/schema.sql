-- ============================================================
-- DATABASE: koni_banyumas  (MySQL)
-- Jalankan di phpMyAdmin atau MySQL Workbench
-- ============================================================

CREATE DATABASE IF NOT EXISTS koni_banyumas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE koni_banyumas;

-- ── CABOR ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cabor (
  id          VARCHAR(36)  PRIMARY KEY,
  nama        VARCHAR(100) NOT NULL,
  induk       VARCHAR(100) NOT NULL,
  singkatan   VARCHAR(10),
  status      ENUM('aktif','tidak_aktif') DEFAULT 'aktif',
  created_at  DATE DEFAULT (CURDATE())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── PELATIH ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pelatih (
  id              VARCHAR(36)  PRIMARY KEY,
  nik             VARCHAR(16),
  nama            VARCHAR(150) NOT NULL,
  tempat_lahir    VARCHAR(100),
  tanggal_lahir   DATE,
  jenis_kelamin   ENUM('L','P'),
  alamat          TEXT,
  no_hp           VARCHAR(20),
  foto            VARCHAR(255),
  cabor_id        VARCHAR(36),
  kategori        ENUM('koordinator','fisik','teknik','taktik') DEFAULT 'teknik',
  grade           ENUM('daerah','nasional','internasional') DEFAULT 'daerah',
  status          ENUM('aktif','tidak_aktif') DEFAULT 'aktif',
  created_at      DATE DEFAULT (CURDATE()),
  FOREIGN KEY (cabor_id) REFERENCES cabor(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── ATLET ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS atlet (
  id              VARCHAR(36)  PRIMARY KEY,
  nik             VARCHAR(16),
  nama            VARCHAR(150) NOT NULL,
  tempat_lahir    VARCHAR(100),
  tanggal_lahir   DATE,
  jenis_kelamin   ENUM('L','P'),
  alamat          TEXT,
  no_hp           VARCHAR(20),
  foto            VARCHAR(255),
  cabor_id        VARCHAR(36),
  status          ENUM('aktif','tidak_aktif') DEFAULT 'aktif',
  created_at      DATE DEFAULT (CURDATE()),
  FOREIGN KEY (cabor_id) REFERENCES cabor(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── WASIT ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wasit (
  id              VARCHAR(36)  PRIMARY KEY,
  nik             VARCHAR(16),
  nama            VARCHAR(150) NOT NULL,
  tempat_lahir    VARCHAR(100),
  tanggal_lahir   DATE,
  jenis_kelamin   ENUM('L','P'),
  alamat          TEXT,
  no_hp           VARCHAR(20),
  foto            VARCHAR(255),
  cabor_id        VARCHAR(36),
  lisensi         VARCHAR(50),
  grade           ENUM('daerah','nasional','internasional') DEFAULT 'daerah',
  status          ENUM('aktif','tidak_aktif') DEFAULT 'aktif',
  created_at      DATE DEFAULT (CURDATE()),
  FOREIGN KEY (cabor_id) REFERENCES cabor(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(36)  PRIMARY KEY,
  username      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','pelatih','atlet','wasit') NOT NULL,
  ref_id        VARCHAR(36),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── PROGRAM LATIHAN ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS program_latihan (
  id            VARCHAR(36)  PRIMARY KEY,
  pelatih_id    VARCHAR(36)  NOT NULL,
  cabor_id      VARCHAR(36),
  judul         VARCHAR(200) NOT NULL,
  deskripsi     TEXT,
  tanggal       DATE         NOT NULL,
  durasi_menit  INT          DEFAULT 90,
  lokasi        VARCHAR(200),
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pelatih_id) REFERENCES pelatih(id) ON DELETE CASCADE,
  FOREIGN KEY (cabor_id)   REFERENCES cabor(id)   ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── PRESENSI ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS presensi (
  id                  VARCHAR(36) PRIMARY KEY,
  program_latihan_id  VARCHAR(36) NOT NULL,
  atlet_id            VARCHAR(36) NOT NULL,
  status              ENUM('hadir','izin','sakit','alpha') DEFAULT 'hadir',
  keterangan          TEXT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_presensi (program_latihan_id, atlet_id),
  FOREIGN KEY (program_latihan_id) REFERENCES program_latihan(id) ON DELETE CASCADE,
  FOREIGN KEY (atlet_id)           REFERENCES atlet(id)           ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── PERTANDINGAN ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pertandingan (
  id          VARCHAR(36)  PRIMARY KEY,
  wasit_id    VARCHAR(36)  NOT NULL,
  cabor_id    VARCHAR(36),
  nama_event  VARCHAR(200) NOT NULL,
  tanggal     DATE         NOT NULL,
  lokasi      VARCHAR(200),
  keterangan  TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wasit_id) REFERENCES wasit(id) ON DELETE CASCADE,
  FOREIGN KEY (cabor_id) REFERENCES cabor(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── SERTIFIKAT ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sertifikat (
  id          VARCHAR(36)  PRIMARY KEY,
  owner_id    VARCHAR(36)  NOT NULL,
  owner_type  ENUM('atlet','pelatih','wasit') NOT NULL,
  judul       VARCHAR(200) NOT NULL,
  file_url    VARCHAR(500) NOT NULL,
  tipe        ENUM('kejuaraan','lisensi','pelatihan','lainnya') DEFAULT 'lainnya',
  keterangan  TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sertifikat_owner (owner_id, owner_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── PRESTASI ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prestasi (
  id              VARCHAR(36)  PRIMARY KEY,
  atlet_id        VARCHAR(36)  NOT NULL,
  cabor_id        VARCHAR(36),
  nama_kejuaraan  VARCHAR(200) NOT NULL,
  nomor_lomba     VARCHAR(100),
  grade           ENUM('daerah','nasional','internasional') DEFAULT 'daerah',
  tahun           YEAR,
  hasil           VARCHAR(100),
  medali          ENUM('emas','perak','perunggu'),
  penyelenggara   VARCHAR(200),
  lokasi          VARCHAR(200),
  foto_piagam     VARCHAR(500),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (atlet_id) REFERENCES atlet(id) ON DELETE CASCADE,
  FOREIGN KEY (cabor_id) REFERENCES cabor(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── INDEX ─────────────────────────────────────────────────────
CREATE INDEX idx_program_pelatih    ON program_latihan(pelatih_id);
CREATE INDEX idx_program_tanggal    ON program_latihan(tanggal);
CREATE INDEX idx_presensi_program   ON presensi(program_latihan_id);
CREATE INDEX idx_presensi_atlet     ON presensi(atlet_id);
CREATE INDEX idx_pertandingan_wasit ON pertandingan(wasit_id);
CREATE INDEX idx_pertandingan_tgl   ON pertandingan(tanggal);
CREATE INDEX idx_prestasi_atlet     ON prestasi(atlet_id);

-- ── SEED: Admin user ──────────────────────────────────────────
-- LANGKAH:
-- 1. Install dulu: npm install
-- 2. Jalankan di terminal: node -e "require('bcrypt').hash('koni2024',10).then(console.log)"
-- 3. Salin hash yang muncul, paste di bawah menggantikan PASTE_HASH_DI_SINI
-- 4. Jalankan query INSERT ini

INSERT IGNORE INTO users (id, username, password_hash, role)
VALUES ('user-admin-001', 'admin', '$2b$10$iXcFdhnojY8.nP2OqWCUVOF42JKLvTKJqaURC0P2KPI1MYnTR.5/2', 'admin');
