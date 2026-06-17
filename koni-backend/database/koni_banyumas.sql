-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 17 Jun 2026 pada 00.24
-- Versi server: 8.0.30
-- Versi PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Basis data: `koni_banyumas`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `atlet`
--

CREATE TABLE `atlet` (
  `id` varchar(36) NOT NULL,
  `nik` varchar(16) DEFAULT NULL,
  `nama` varchar(150) NOT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT NULL,
  `alamat` text,
  `no_hp` varchar(20) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `cabor_id` varchar(36) DEFAULT NULL,
  `status` enum('aktif','tidak_aktif') DEFAULT 'aktif',
  `created_at` date DEFAULT (curdate())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `atlet`
--

INSERT INTO `atlet` (`id`, `nik`, `nama`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `no_hp`, `foto`, `cabor_id`, `status`, `created_at`) VALUES
('988e5f69-6d79-4423-a389-21590a5b33e8', '0897621777', 'dika', 'banyumas', '2026-06-11', 'L', 'dukuhwaluh', '08972514000', NULL, 'cabor-001', 'aktif', '2026-06-11'),
('adae0dfe-4583-45d4-83fb-bae5b7ba8847', '0980218492342111', 'Andriana Sarasti', 'Banyumaas', '2026-04-21', 'P', 'Karangreja', '0897327393', NULL, 'cabor-015', 'aktif', '2026-04-26'),
('atl-001', '3302010201050001', 'Ahmad Rizki Pratama', 'Banyumas', '2005-02-01', 'L', 'Jl. Veteran No. 12, Purwokerto Utara', '081234560001', NULL, 'cabor-001', 'aktif', '2026-04-26'),
('atl-002', '3302016503070001', 'Dewi Rahayu Lestari', 'Cilacap', '2007-03-25', 'P', 'Jl. Mawar No. 7, Sokaraja', '081234560002', NULL, 'cabor-002', 'aktif', '2026-04-26'),
('atl-003', '3302011205080001', 'Fajar Nugroho', 'Purwokerto', '2008-05-12', 'L', 'Jl. Raya Baturaden No. 3, Baturaden', '081234560003', NULL, 'cabor-003', 'aktif', '2026-04-26'),
('atl-004', '3302012808060001', 'Siti Nurhaliza', 'Banyumas', '2006-08-28', 'P', 'Jl. Diponegoro No. 45, Purwokerto Selatan', '081234560004', NULL, 'cabor-004', 'aktif', '2026-04-26'),
('atl-005', '3302010110090001', 'Bagas Aditya Wibowo', 'Purbalingga', '2009-10-01', 'L', 'Jl. Raya Kembaran No. 18, Kembaran', '081234560005', NULL, 'cabor-005', 'aktif', '2026-04-26'),
('atl-006', '3302011507040001', 'Rina Kusuma Dewi', 'Banyumas', '2004-07-15', 'P', 'Jl. Pahlawan No. 22, Ajibarang', '081234560006', NULL, 'cabor-001', 'aktif', '2026-04-26'),
('atl-007', '3302010903050001', 'Dimas Satria Prabowo', 'Banyumas', '2005-03-09', 'L', 'Jl. Cendana No. 5, Purwokerto Timur', '081234560007', NULL, 'cabor-006', 'aktif', '2026-04-26'),
('atl-008', '3302012206060001', 'Anggun Puspita Sari', 'Purwokerto', '2006-06-22', 'P', 'Jl. Melati No. 9, Purwokerto Barat', '081234560008', NULL, 'cabor-003', 'aktif', '2026-04-26'),
('atl-009', '3302010505070001', 'Rizal Hermawan', 'Banyumas', '2007-05-05', 'L', 'Jl. Sudirman No. 33, Wangon', '081234560009', NULL, 'cabor-010', 'aktif', '2026-04-26'),
('atl-010', '3302011811030001', 'Nadia Febriana', 'Cilacap', '2003-11-18', 'P', 'Jl. Kenanga No. 14, Purwokerto Utara', '081234560010', NULL, 'cabor-009', 'aktif', '2026-04-26'),
('atl-011', '3302012704080001', 'Wahyu Tri Handoko', 'Banyumas', '2008-04-27', 'L', 'Jl. Raya Sokaraja No. 60, Sokaraja', '081234560011', NULL, 'cabor-008', 'aktif', '2026-04-26'),
('atl-012', '3302011402060001', 'Putri Indah Permata', 'Purwokerto', '2006-02-14', 'P', 'Jl. Anggrek No. 3, Kembaran', '081234560012', NULL, 'cabor-004', 'aktif', '2026-04-26'),
('atl-013', '3302010807090001', 'Galih Setiawan', 'Banyumas', '2009-07-08', 'L', 'Jl. Pramuka No. 11, Patikraja', '081234560013', NULL, 'cabor-017', 'aktif', '2026-04-26'),
('atl-014', '3302012209040001', 'Larasati Putri Hanum', 'Banyumas', '2004-09-22', 'P', 'Jl. Bougenville No. 7, Purwokerto Selatan', '081234560014', NULL, 'cabor-019', 'aktif', '2026-04-26'),
('atl-015', '3302010301050001', 'Eko Prasetyo Utomo', 'Purwokerto', '2005-01-03', 'L', 'Jl. Raya Cilongok No. 25, Cilongok', '081234560015', NULL, 'cabor-013', 'tidak_aktif', '2026-04-26'),
('atl-016', '3302011603070001', 'Intan Permatasari', 'Banyumas', '2007-03-16', 'P', 'Jl. Dahlia No. 8, Ajibarang', '081234560016', NULL, 'cabor-018', 'aktif', '2026-04-26'),
('atl-017', '3302010204060001', 'Rendi Kurniawan', 'Banyumas', '2006-04-02', 'L', 'Jl. Raya Sumpiuh No. 17, Sumpiuh', '081234560017', NULL, 'cabor-011', 'aktif', '2026-04-26'),
('atl-018', '3302012510080001', 'Mega Nur Cahyani', 'Purwokerto', '2008-10-25', 'P', 'Jl. Raya Banyumas No. 40, Banyumas', '081234560018', NULL, 'cabor-006', 'aktif', '2026-04-26');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cabor`
--

CREATE TABLE `cabor` (
  `id` varchar(36) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `induk` varchar(100) NOT NULL,
  `singkatan` varchar(10) DEFAULT NULL,
  `status` enum('aktif','tidak_aktif') DEFAULT 'aktif',
  `created_at` date DEFAULT (curdate())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `cabor`
--

INSERT INTO `cabor` (`id`, `nama`, `induk`, `singkatan`, `status`, `created_at`) VALUES
('cabor-001', 'Atletik', 'PASI', 'ATL', 'aktif', '2026-04-26'),
('cabor-002', 'Bulutangkis', 'PBSI', 'BDM', 'aktif', '2026-04-26'),
('cabor-003', 'Pencak Silat', 'IPSI', 'PS', 'aktif', '2026-04-26'),
('cabor-004', 'Taekwondo', 'TI', 'TKD', 'aktif', '2026-04-26'),
('cabor-005', 'Karate', 'FORKI', 'KRT', 'aktif', '2026-04-26'),
('cabor-006', 'Renang', 'PRSI', 'RNM', 'aktif', '2026-04-26'),
('cabor-007', 'Bola Voli', 'PBVSI', 'BVL', 'aktif', '2026-04-26'),
('cabor-008', 'Tenis Meja', 'PTMSI', 'TM', 'aktif', '2026-04-26'),
('cabor-009', 'Panahan', 'Perpani', 'PNH', 'aktif', '2026-04-26'),
('cabor-010', 'Senam', 'PERSANI', 'SNM', 'aktif', '2026-04-26'),
('cabor-011', 'Tinju', 'Pertina', 'TJU', 'aktif', '2026-04-26'),
('cabor-012', 'Judo', 'PJI', 'JDO', 'aktif', '2026-04-26'),
('cabor-013', 'Angkat Besi', 'PABSI', 'AB', 'aktif', '2026-04-26'),
('cabor-014', 'Sepak Bola', 'PSSI', 'SB', 'aktif', '2026-04-26'),
('cabor-015', 'Bola Basket', 'Perbasi', 'BKT', 'aktif', '2026-04-26'),
('cabor-016', 'Gulat', 'PGSI', 'GLT', 'aktif', '2026-04-26'),
('cabor-017', 'Wushu', 'WI', 'WSH', 'aktif', '2026-04-26'),
('cabor-018', 'Catur', 'Percasi', 'CTR', 'aktif', '2026-04-26'),
('cabor-019', 'Panjat Tebing', 'FPTI', 'PT', 'aktif', '2026-04-26'),
('cabor-020', 'Muaythai', 'PMT', 'MT', 'tidak_aktif', '2026-04-26'),
('cabor-021', 'Kempo', 'PERKEMI', 'KMP', 'tidak_aktif', '2026-04-26'),
('cabor-022', 'Biliar', 'PBI', 'BLR', 'tidak_aktif', '2026-04-26');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pelatih`
--

CREATE TABLE `pelatih` (
  `id` varchar(36) NOT NULL,
  `nik` varchar(16) DEFAULT NULL,
  `nama` varchar(150) NOT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT NULL,
  `alamat` text,
  `no_hp` varchar(20) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `cabor_id` varchar(36) DEFAULT NULL,
  `kategori` enum('koordinator','fisik','teknik','taktik') DEFAULT 'teknik',
  `grade` enum('daerah','nasional','internasional') DEFAULT 'daerah',
  `status` enum('aktif','tidak_aktif') DEFAULT 'aktif',
  `created_at` date DEFAULT (curdate())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `pelatih`
--

INSERT INTO `pelatih` (`id`, `nik`, `nama`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `no_hp`, `foto`, `cabor_id`, `kategori`, `grade`, `status`, `created_at`) VALUES
('e4c09f23-d5a2-4056-ab41-b7013b4d6d10', '127817871', 'joko', 'purba', '2026-06-01', 'L', 'purbalingga', '0191082098121', NULL, 'cabor-001', 'fisik', 'internasional', 'aktif', '2026-06-11'),
('plt-001', '3302018010800001', 'Budi Santoso, S.Pd.', 'Cilacap', '1980-10-08', 'L', 'Jl. Jend. Sudirman No. 5, Purwokerto', '081298760001', NULL, 'cabor-001', 'teknik', 'nasional', 'aktif', '2026-04-26'),
('plt-002', '3302014507750001', 'Sri Wahyuni, S.Or.', 'Banyumas', '1975-07-05', 'P', 'Jl. Pahlawan No. 18, Purwokerto Utara', '081298760002', NULL, 'cabor-001', 'fisik', 'nasional', 'aktif', '2026-04-26'),
('plt-003', '3302011203830001', 'Hendra Gunawan, S.Pd.', 'Purwokerto', '1983-03-12', 'L', 'Jl. Ahmad Yani No. 30, Purwokerto Selatan', '081298760003', NULL, 'cabor-002', 'koordinator', 'nasional', 'aktif', '2026-04-26'),
('plt-004', '3302012908780001', 'Agus Priyono, S.Or.', 'Banyumas', '1978-08-29', 'L', 'Jl. Raya Sokaraja No. 12, Sokaraja', '081298760004', NULL, 'cabor-003', 'teknik', 'nasional', 'aktif', '2026-04-26'),
('plt-005', '3302011506860001', 'Roni Prasetya, S.Pd.', 'Purbalingga', '1986-06-15', 'L', 'Jl. Raya Ajibarang No. 8, Ajibarang', '081298760005', NULL, 'cabor-004', 'teknik', 'daerah', 'aktif', '2026-04-26'),
('plt-006', '3302012203850001', 'Yuli Astuti, S.Or.', 'Banyumas', '1985-03-22', 'P', 'Jl. Melati No. 4, Purwokerto Barat', '081298760006', NULL, 'cabor-006', 'teknik', 'nasional', 'aktif', '2026-04-26'),
('plt-007', '3302010704810001', 'Susanto Wibowo', 'Banyumas', '1981-04-07', 'L', 'Jl. Merdeka No. 22, Banyumas', '081298760007', NULL, 'cabor-005', 'taktik', 'daerah', 'aktif', '2026-04-26'),
('plt-008', '3302011109700001', 'Dwi Cahyono, S.Pd.', 'Cilacap', '1970-09-11', 'L', 'Jl. Veteran No. 7, Purwokerto Utara', '081298760008', NULL, 'cabor-009', 'koordinator', 'internasional', 'aktif', '2026-04-26'),
('plt-009', '3302012505900001', 'Andi Firmansyah, S.Or.', 'Purwokerto', '1990-05-25', 'L', 'Jl. Raya Kembaran No. 5, Kembaran', '081298760009', NULL, 'cabor-010', 'fisik', 'daerah', 'aktif', '2026-04-26'),
('plt-010', '3302011308880001', 'Nurul Hidayah, S.Pd.', 'Banyumas', '1988-08-13', 'P', 'Jl. Anggrek No. 11, Purwokerto Timur', '081298760010', NULL, 'cabor-008', 'teknik', 'daerah', 'tidak_aktif', '2026-04-26');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pertandingan`
--

CREATE TABLE `pertandingan` (
  `id` varchar(36) NOT NULL,
  `wasit_id` varchar(36) NOT NULL,
  `cabor_id` varchar(36) DEFAULT NULL,
  `nama_event` varchar(200) NOT NULL,
  `tanggal` date NOT NULL,
  `lokasi` varchar(200) DEFAULT NULL,
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `presensi`
--

CREATE TABLE `presensi` (
  `id` varchar(36) NOT NULL,
  `program_latihan_id` varchar(36) NOT NULL,
  `atlet_id` varchar(36) NOT NULL,
  `status` enum('hadir','izin','sakit','alpha') DEFAULT 'hadir',
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `presensi`
--

INSERT INTO `presensi` (`id`, `program_latihan_id`, `atlet_id`, `status`, `keterangan`, `created_at`) VALUES
('09fc0755-959b-4071-b8f3-67ab679022cc', 'd38414e6-2586-4ffd-908d-45723c1c0d29', 'atl-006', 'alpha', NULL, '2026-06-11 00:59:55'),
('562f7fca-f86b-471b-9109-90d3315f6406', 'd38414e6-2586-4ffd-908d-45723c1c0d29', '988e5f69-6d79-4423-a389-21590a5b33e8', 'hadir', NULL, '2026-06-11 00:59:55'),
('743a6c20-c3e5-4a6e-817c-1db6427960d0', 'd38414e6-2586-4ffd-908d-45723c1c0d29', 'atl-001', 'alpha', NULL, '2026-06-11 00:59:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `prestasi`
--

CREATE TABLE `prestasi` (
  `id` varchar(36) NOT NULL,
  `atlet_id` varchar(36) NOT NULL,
  `cabor_id` varchar(36) DEFAULT NULL,
  `nama_kejuaraan` varchar(200) NOT NULL,
  `nomor_lomba` varchar(100) DEFAULT NULL,
  `grade` enum('daerah','nasional','internasional') DEFAULT 'daerah',
  `tahun` year DEFAULT NULL,
  `hasil` varchar(100) DEFAULT NULL,
  `medali` enum('emas','perak','perunggu') DEFAULT NULL,
  `penyelenggara` varchar(200) DEFAULT NULL,
  `lokasi` varchar(200) DEFAULT NULL,
  `foto_piagam` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `prestasi`
--

INSERT INTO `prestasi` (`id`, `atlet_id`, `cabor_id`, `nama_kejuaraan`, `nomor_lomba`, `grade`, `tahun`, `hasil`, `medali`, `penyelenggara`, `lokasi`, `foto_piagam`, `created_at`) VALUES
('prs-001', 'atl-001', 'cabor-001', 'Kejuaraan Atletik Jawa Tengah 2024', 'Lari 100m Putra', 'daerah', '2024', 'Juara 1', 'emas', 'PASI Jawa Tengah', 'Semarang', NULL, '2026-04-26 09:17:41'),
('prs-002', 'atl-001', 'cabor-001', 'Pekan Olahraga Provinsi Jateng 2023', 'Lari 200m Putra', 'daerah', '2023', 'Juara 2', 'perak', 'KONI Jawa Tengah', 'Solo', NULL, '2026-04-26 09:17:41'),
('prs-003', 'atl-002', 'cabor-002', 'Kejuaraan Bulutangkis Nasional Junior', 'Tunggal Putri U-17', 'nasional', '2024', 'Juara 3', 'perunggu', 'PBSI', 'Jakarta', NULL, '2026-04-26 09:17:41'),
('prs-004', 'atl-003', 'cabor-003', 'Kejurda Pencak Silat Jawa Tengah 2024', 'Kelas C Putra (50-55 kg)', 'daerah', '2024', 'Juara 1', 'emas', 'IPSI Jawa Tengah', 'Magelang', NULL, '2026-04-26 09:17:41'),
('prs-005', 'atl-004', 'cabor-004', 'Open Tournament Taekwondo se-Jateng', 'Kyorugi Putri U-17', 'daerah', '2024', 'Juara 1', 'emas', 'TI Jawa Tengah', 'Purwokerto', NULL, '2026-04-26 09:17:41'),
('prs-006', 'atl-004', 'cabor-004', 'Kejuaraan Nasional Taekwondo Junior', 'Kyorugi Putri U-17', 'nasional', '2023', 'Juara 2', 'perak', 'Taekwondo Indonesia', 'Surabaya', NULL, '2026-04-26 09:17:41'),
('prs-007', 'atl-005', 'cabor-005', 'O2SN Tingkat Kabupaten Banyumas 2024', 'Karate Kata Putra SD', 'daerah', '2024', 'Juara 1', 'emas', 'Dinas Pendidikan', 'Purwokerto', NULL, '2026-04-26 09:17:41'),
('prs-008', 'atl-006', 'cabor-001', 'Kejuaraan Atletik Nasional 2023', 'Lari 400m Putri', 'nasional', '2023', 'Juara 3', 'perunggu', 'PASI', 'Bandung', NULL, '2026-04-26 09:17:41'),
('prs-009', 'atl-007', 'cabor-006', 'Kejurda Renang Jawa Tengah 2024', '100m Gaya Bebas Putra', 'daerah', '2024', 'Juara 2', 'perak', 'PRSI Jawa Tengah', 'Semarang', NULL, '2026-04-26 09:17:41'),
('prs-010', 'atl-008', 'cabor-003', 'Porprov Jawa Tengah 2023', 'Silat Tanding Putri', 'daerah', '2023', 'Juara 1', 'emas', 'KONI Jawa Tengah', 'Semarang', NULL, '2026-04-26 09:17:41'),
('prs-011', 'atl-010', 'cabor-009', 'Kejuaraan Panahan Nasional 2024', 'Recurve Putri 30m', 'nasional', '2024', 'Juara 1', 'emas', 'Perpani', 'Yogyakarta', NULL, '2026-04-26 09:17:41'),
('prs-012', 'atl-010', 'cabor-009', 'SEA Games Simulation Archery 2023', 'Recurve Putri Individual', 'internasional', '2023', 'Juara 2', 'perak', 'World Archery', 'Thailand', NULL, '2026-04-26 09:17:41'),
('prs-013', 'atl-011', 'cabor-008', 'Kejurda Tenis Meja Jawa Tengah 2024', 'Tunggal Putra Kadet', 'daerah', '2024', 'Juara 2', 'perak', 'PTMSI Jawa Tengah', 'Purwokerto', NULL, '2026-04-26 09:17:41'),
('prs-014', 'atl-013', 'cabor-017', 'Kejuaraan Wushu Nasional Junior 2024', 'Sanda 60kg Putra', 'nasional', '2024', 'Juara 3', 'perunggu', 'Wushu Indonesia', 'Medan', NULL, '2026-04-26 09:17:41'),
('prs-015', 'atl-014', 'cabor-019', 'Kejuaraan Panjat Tebing Nasional 2024', 'Speed Putri', 'nasional', '2024', 'Juara 1', 'emas', 'FPTI', 'Bali', NULL, '2026-04-26 09:17:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `program_latihan`
--

CREATE TABLE `program_latihan` (
  `id` varchar(36) NOT NULL,
  `pelatih_id` varchar(36) NOT NULL,
  `cabor_id` varchar(36) DEFAULT NULL,
  `judul` varchar(200) NOT NULL,
  `deskripsi` text,
  `tanggal` date NOT NULL,
  `durasi_menit` int DEFAULT '90',
  `lokasi` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `program_latihan`
--

INSERT INTO `program_latihan` (`id`, `pelatih_id`, `cabor_id`, `judul`, `deskripsi`, `tanggal`, `durasi_menit`, `lokasi`, `created_at`) VALUES
('d38414e6-2586-4ffd-908d-45723c1c0d29', 'e4c09f23-d5a2-4056-ab41-b7013b4d6d10', 'cabor-001', 'lari 10 km', 'awas koe', '2026-06-11', 90, 'stadion', '2026-06-11 00:58:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sertifikat`
--

CREATE TABLE `sertifikat` (
  `id` varchar(36) NOT NULL,
  `owner_id` varchar(36) NOT NULL,
  `owner_type` enum('atlet','pelatih','wasit') NOT NULL,
  `judul` varchar(200) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `tipe` enum('kejuaraan','lisensi','pelatihan','lainnya') DEFAULT 'lainnya',
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','pelatih','atlet','wasit') NOT NULL,
  `ref_id` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `ref_id`, `created_at`) VALUES
('0c2a6b59-d744-4fe1-a23a-4d60d947bfb6', 'bahlil', '$2b$10$3xdyE5MiOSW.HFnlBLRGEOcVGk0O07LWFBMUbLn/WsWzYr9qoGcNe', 'wasit', '403571b4-d73d-4478-8c34-f961a23b4694', '2026-06-11 01:03:19'),
('0e27af0a-84dc-43e5-9761-a6910317885d', 'jawir', '$2b$10$GxENbzWP/8HIg5Fekobs2uq8DeM114yfBNPQVJ2hSXlm3ciW0/Fyy', 'atlet', '988e5f69-6d79-4423-a389-21590a5b33e8', '2026-06-11 00:55:14'),
('adaef7e4-6f2a-43e8-abd4-a0069ab8e110', 'andrianaa', '$2b$10$nJH15aDFWbwHHnkXPZTtruNFdjwxIKB3yofdwnjQEo5vAtsIzxGui', 'atlet', 'adae0dfe-4583-45d4-83fb-bae5b7ba8847', '2026-04-26 09:19:32'),
('e4d51bd5-fbc5-4439-9f94-2bc08062124f', 'joko', '$2b$10$kWKa7ueb3jDD5xirQfSeq.64y.MNsBBX1sCeAmW8J3eMbmtxFdRIC', 'pelatih', 'e4c09f23-d5a2-4056-ab41-b7013b4d6d10', '2026-06-11 00:57:44'),
('user-admin-001', 'admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NULL, '2026-04-26 09:17:23'),
('user-atl-001', 'ahmad.rizki', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'atlet', 'atl-001', '2026-04-26 09:17:41'),
('user-atl-002', 'dewi.rahayu', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'atlet', 'atl-002', '2026-04-26 09:17:41'),
('user-atl-003', 'fajar.nugroho', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'atlet', 'atl-003', '2026-04-26 09:17:41'),
('user-atl-004', 'siti.nurhaliza', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'atlet', 'atl-004', '2026-04-26 09:17:41'),
('user-atl-010', 'nadia.febriana', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'atlet', 'atl-010', '2026-04-26 09:17:41'),
('user-atl-014', 'larasati.putri', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'atlet', 'atl-014', '2026-04-26 09:17:41'),
('user-plt-001', 'budi.santoso', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pelatih', 'plt-001', '2026-04-26 09:17:41'),
('user-plt-002', 'sri.wahyuni', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pelatih', 'plt-002', '2026-04-26 09:17:41'),
('user-plt-003', 'hendra.gunawan', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pelatih', 'plt-003', '2026-04-26 09:17:41'),
('user-plt-004', 'agus.priyono', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pelatih', 'plt-004', '2026-04-26 09:17:41'),
('user-plt-005', 'dwi.cahyono', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pelatih', 'plt-008', '2026-04-26 09:17:41'),
('user-was-001', 'hartono', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'wasit', 'was-001', '2026-04-26 09:17:41'),
('user-was-002', 'sari.dewi', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'wasit', 'was-002', '2026-04-26 09:17:41'),
('user-was-003', 'bambang.setiadi', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'wasit', 'was-003', '2026-04-26 09:17:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `wasit`
--

CREATE TABLE `wasit` (
  `id` varchar(36) NOT NULL,
  `nik` varchar(16) DEFAULT NULL,
  `nama` varchar(150) NOT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT NULL,
  `alamat` text,
  `no_hp` varchar(20) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `cabor_id` varchar(36) DEFAULT NULL,
  `lisensi` varchar(50) DEFAULT NULL,
  `grade` enum('daerah','nasional','internasional') DEFAULT 'daerah',
  `status` enum('aktif','tidak_aktif') DEFAULT 'aktif',
  `created_at` date DEFAULT (curdate())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `wasit`
--

INSERT INTO `wasit` (`id`, `nik`, `nama`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `no_hp`, `foto`, `cabor_id`, `lisensi`, `grade`, `status`, `created_at`) VALUES
('was-001', '3302018005750001', 'Hartono, S.Pd.', 'Banyumas', '1975-05-18', 'L', 'Jl. Gatot Subroto No. 10, Purwokerto', '082198760001', NULL, 'cabor-003', 'WAS-D-001', 'nasional', 'aktif', '2026-04-26'),
('was-002', '3302014502820001', 'Sari Dewi Anggraini', 'Purwokerto', '1982-02-14', 'P', 'Jl. Raya Sokaraja No. 25, Sokaraja', '082198760002', NULL, 'cabor-004', 'WAS-D-002', 'daerah', 'aktif', '2026-04-26'),
('was-003', '3302011208780001', 'Bambang Setiadi', 'Cilacap', '1978-08-12', 'L', 'Jl. Veteran No. 33, Purwokerto Utara', '082198760003', NULL, 'cabor-002', 'WAS-D-003', 'internasional', 'aktif', '2026-04-26'),
('was-004', '3302010305850001', 'Dewi Kurniasih, S.Or.', 'Banyumas', '1985-05-03', 'P', 'Jl. Merdeka No. 7, Ajibarang', '082198760004', NULL, 'cabor-001', 'WAS-D-004', 'nasional', 'aktif', '2026-04-26'),
('was-005', '3302019009900001', 'Rian Hidayat', 'Purwokerto', '1990-09-19', 'L', 'Jl. Diponegoro No. 12, Purwokerto Barat', '082198760005', NULL, 'cabor-005', 'WAS-D-005', 'daerah', 'aktif', '2026-04-26');

--
-- Indeks untuk tabel yang dibuang
--

--
-- Indeks untuk tabel `atlet`
--
ALTER TABLE `atlet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cabor_id` (`cabor_id`);

--
-- Indeks untuk tabel `cabor`
--
ALTER TABLE `cabor`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pelatih`
--
ALTER TABLE `pelatih`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cabor_id` (`cabor_id`);

--
-- Indeks untuk tabel `pertandingan`
--
ALTER TABLE `pertandingan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cabor_id` (`cabor_id`),
  ADD KEY `idx_pertandingan_wasit` (`wasit_id`),
  ADD KEY `idx_pertandingan_tgl` (`tanggal`);

--
-- Indeks untuk tabel `presensi`
--
ALTER TABLE `presensi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_presensi` (`program_latihan_id`,`atlet_id`),
  ADD KEY `idx_presensi_program` (`program_latihan_id`),
  ADD KEY `idx_presensi_atlet` (`atlet_id`);

--
-- Indeks untuk tabel `prestasi`
--
ALTER TABLE `prestasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cabor_id` (`cabor_id`),
  ADD KEY `idx_prestasi_atlet` (`atlet_id`);

--
-- Indeks untuk tabel `program_latihan`
--
ALTER TABLE `program_latihan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cabor_id` (`cabor_id`),
  ADD KEY `idx_program_pelatih` (`pelatih_id`),
  ADD KEY `idx_program_tanggal` (`tanggal`);

--
-- Indeks untuk tabel `sertifikat`
--
ALTER TABLE `sertifikat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sertifikat_owner` (`owner_id`,`owner_type`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `wasit`
--
ALTER TABLE `wasit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cabor_id` (`cabor_id`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `atlet`
--
ALTER TABLE `atlet`
  ADD CONSTRAINT `atlet_ibfk_1` FOREIGN KEY (`cabor_id`) REFERENCES `cabor` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `pelatih`
--
ALTER TABLE `pelatih`
  ADD CONSTRAINT `pelatih_ibfk_1` FOREIGN KEY (`cabor_id`) REFERENCES `cabor` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `pertandingan`
--
ALTER TABLE `pertandingan`
  ADD CONSTRAINT `pertandingan_ibfk_1` FOREIGN KEY (`wasit_id`) REFERENCES `wasit` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pertandingan_ibfk_2` FOREIGN KEY (`cabor_id`) REFERENCES `cabor` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `presensi`
--
ALTER TABLE `presensi`
  ADD CONSTRAINT `presensi_ibfk_1` FOREIGN KEY (`program_latihan_id`) REFERENCES `program_latihan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `presensi_ibfk_2` FOREIGN KEY (`atlet_id`) REFERENCES `atlet` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `prestasi`
--
ALTER TABLE `prestasi`
  ADD CONSTRAINT `prestasi_ibfk_1` FOREIGN KEY (`atlet_id`) REFERENCES `atlet` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prestasi_ibfk_2` FOREIGN KEY (`cabor_id`) REFERENCES `cabor` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `program_latihan`
--
ALTER TABLE `program_latihan`
  ADD CONSTRAINT `program_latihan_ibfk_1` FOREIGN KEY (`pelatih_id`) REFERENCES `pelatih` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `program_latihan_ibfk_2` FOREIGN KEY (`cabor_id`) REFERENCES `cabor` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `wasit`
--
ALTER TABLE `wasit`
  ADD CONSTRAINT `wasit_ibfk_1` FOREIGN KEY (`cabor_id`) REFERENCES `cabor` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
