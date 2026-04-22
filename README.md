<div align="center">

<img src="public/logo.png" alt="KONI Logo" width="100" height="100" />

# 🏅 KONI Kabupaten Banyumas
### Sistem Informasi Manajemen Olahraga Daerah

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=flat-square&logo=reactrouter)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Tugas UAS · Pemrograman Web Lanjut · Universitas Muhammadiyah Purwokerto**

[🌐 Demo](#) · [📋 Fitur](#-fitur-utama) · [🚀 Instalasi](#-instalasi) · [📁 Struktur](#-struktur-folder)

</div>

---

## 📖 Tentang Proyek

Sistem Informasi KONI Kabupaten Banyumas adalah aplikasi web yang dikembangkan untuk mendigitalisasi pengelolaan data olahraga di **Komite Olahraga Nasional Indonesia (KONI) Kabupaten Banyumas**, Jawa Tengah.

Sebelumnya, seluruh proses pencatatan data atlet, pelatih, kegiatan, hingga presensi latihan masih dilakukan secara **manual menggunakan kertas**. Aplikasi ini hadir sebagai solusi terintegrasi yang menghubungkan admin, pelatih, atlet, dan wasit dalam satu platform.

> 🎯 Proyek ini dikembangkan berdasarkan hasil wawancara langsung dengan **Triani Budi Lestari, S.E.** selaku Wakil Sekretaris Umum KONI Kab. Banyumas.

---

## ✨ Fitur Utama

### 🌐 Landing Page Publik
| Fitur | Keterangan |
|---|---|
| **Ticker Pengumuman** | Teks berjalan otomatis, klik untuk baca detail |
| **Berita & Artikel** | Halaman list + detail dengan rich text content |
| **Agenda Kegiatan** | Filter upcoming vs selesai, detail per event |
| **Galeri Foto** | Grid dengan filter kategori + lightbox fullscreen |
| **Bagan Pengurus** | Struktur organisasi visual bertingkat (L1–L4) |
| **Data Cabor** | 22+ cabang olahraga aktif KONI Banyumas |

### 🔒 Panel Admin
| Fitur | Keterangan |
|---|---|
| **CRUD Data Atlet** | Kelola biodata, cabor, status aktif/tidak aktif |
| **CRUD Data Pelatih** | Kategori: Koordinator, Fisik, Teknik, Taktik |
| **CRUD Data Cabor** | Lengkap dengan induk organisasi & toggle status |
| **Rekap Prestasi** | Filter by grade: Daerah / Nasional / Internasional |
| **Kelola Konten** | Publikasi berita, pengumuman, kegiatan, galeri |
| **Rich Text Editor** | Quill.js dengan heading, bold, image, link, dll |

### 👤 Dashboard Per Role
| Role | Fitur |
|---|---|
| **Pelatih** | Profil · Program latihan · Input presensi atlet · Upload sertifikat |
| **Atlet** | Profil · Riwayat presensi · Prestasi & medali · Upload piagam |
| **Wasit** | Profil · Input & riwayat pertandingan · Upload lisensi |

---

## 🛠️ Tech Stack

```
Frontend
├── React 18            → UI Framework
├── Vite 5              → Build tool & dev server
├── React Router v6     → Client-side routing
├── Context API         → State management
├── Tailwind CSS v4     → Utility-first styling
├── Axios               → HTTP client
└── Quill.js (CDN)      → Rich text editor

Backend (Opsional / UAS)
├── Node.js + Express   → REST API server
├── MySQL               → Database
├── JWT                 → Autentikasi
├── Multer              → File upload
└── Bcrypt              → Password hashing
```

---

## 🚀 Instalasi

### Prasyarat
- Node.js versi 18 atau lebih baru
- npm atau yarn

### Frontend (Wajib)

```bash
# 1. Clone repository
git clone https://github.com/username/koni-banyumas.git
cd koni-banyumas

# 2. Masuk ke folder frontend
cd koni-app

# 3. Install dependencies
npm install

# 4. Jalankan development server
npm run dev
```

Buka browser di **http://localhost:5173**

### Backend (Opsional)

```bash
# 1. Masuk ke folder backend
cd koni-backend

# 2. Install dependencies
npm install

# 3. Salin file environment
cp .env.example .env
# Edit .env → isi DB_PASSWORD sesuai MySQL kamu

# 4. Import database
# Buka phpMyAdmin → import file database/schema.sql

# 5. Generate hash password admin
node -e "require('bcrypt').hash('koni2024',10).then(console.log)"
# Salin hasilnya → jalankan INSERT di schema.sql bagian SEED

# 6. Jalankan server
npm run dev
```

Server berjalan di **http://localhost:5000**

---

## 📁 Struktur Folder

```
koni-app/
├── public/
│   └── logo.png                  ← Logo KONI (taruh di sini)
│
├── src/
│   ├── api/
│   │   └── axios.js              ← Axios instance + interceptor JWT
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   └── common/
│   │       ├── AdminLayout.jsx   ← Layout dashboard admin
│   │       ├── PublicLayout.jsx  ← Layout halaman publik
│   │       ├── Badge.jsx         ← Badge status/grade/medali
│   │       ├── Modal.jsx         ← Modal reusable
│   │       ├── SearchBar.jsx     ← Search input reusable
│   │       ├── PrivateRoute.jsx  ← Route guard per role
│   │       └── QuillEditor.jsx   ← Rich text editor
│   │
│   ├── context/
│   │   ├── AuthContext.jsx       ← State login & JWT
│   │   ├── AtletContext.jsx      ← CRUD data atlet
│   │   ├── PelatihContext.jsx    ← CRUD data pelatih
│   │   ├── CaborContext.jsx      ← CRUD cabang olahraga
│   │   ├── PrestasiContext.jsx   ← CRUD prestasi atlet
│   │   ├── BeritaContext.jsx     ← CRUD & publish berita
│   │   ├── PengumumanContext.jsx ← CRUD & publish pengumuman
│   │   ├── KegiatanContext.jsx   ← CRUD & publish kegiatan
│   │   ├── PengurusContext.jsx   ← CRUD bagan pengurus
│   │   └── GaleriContext.jsx     ← CRUD & publish galeri
│   │
│   ├── data/                     ← Seed data JSON
│   │   ├── atlet.json
│   │   ├── pelatih.json
│   │   ├── cabor.json
│   │   ├── prestasi.json
│   │   ├── berita.json
│   │   ├── pengumuman.json
│   │   ├── kegiatan.json
│   │   ├── pengurus.json
│   │   └── galeri.json
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js    ← Custom hook persistensi data
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx       ← Halaman utama publik
│   │   ├── LoginPage.jsx         ← Login semua role
│   │   ├── Dashboard.jsx         ← Statistik admin
│   │   ├── AtletPage.jsx         ← CRUD atlet
│   │   ├── PelatihPage.jsx       ← CRUD pelatih
│   │   ├── CaborPage.jsx         ← CRUD cabor
│   │   ├── PrestasiPage.jsx      ← CRUD prestasi
│   │   │
│   │   ├── admin/                ← Halaman kelola konten
│   │   │   ├── BeritaAdminPage.jsx
│   │   │   ├── PengumumanAdminPage.jsx
│   │   │   ├── KegiatanAdminPage.jsx
│   │   │   ├── PengurusAdminPage.jsx
│   │   │   └── GaleriAdminPage.jsx
│   │   │
│   │   ├── dashboard/            ← Dashboard per role
│   │   │   ├── PelatihDashboard.jsx
│   │   │   ├── AtletDashboard.jsx
│   │   │   └── WasitDashboard.jsx
│   │   │
│   │   └── public/               ← Halaman publik terpisah
│   │       ├── BeritaPage.jsx
│   │       ├── BeritaDetailPage.jsx
│   │       ├── PengumumanPage.jsx
│   │       ├── KegiatanPage.jsx
│   │       ├── PengurusPage.jsx
│   │       └── GaleriPage.jsx
│   │
│   ├── utils/
│   │   └── helpers.js            ← formatTanggal, hitungUmur, filterData
│   │
│   ├── App.jsx                   ← Root routing
│   ├── main.jsx                  ← Entry point
│   └── index.css                 ← Global styles + Tailwind
│
├── index.html
├── vite.config.js
└── package.json
```

---

## 🗺️ Peta Halaman

```
/                       → Landing Page (publik)
/berita                 → List berita
/berita/:id             → Detail berita
/pengumuman             → Daftar pengumuman
/kegiatan               → Agenda & event
/pengurus               → Bagan organisasi KONI
/galeri                 → Galeri foto + lightbox

/login                  → Halaman login (semua role)

/admin/dashboard        → Statistik & ringkasan
/admin/atlet            → Kelola data atlet
/admin/pelatih          → Kelola data pelatih
/admin/cabor            → Kelola cabang olahraga
/admin/prestasi         → Kelola prestasi atlet
/admin/berita           → Kelola & publikasi berita
/admin/pengumuman       → Kelola & publikasi pengumuman
/admin/kegiatan         → Kelola & publikasi kegiatan
/admin/pengurus         → Kelola bagan pengurus
/admin/galeri           → Kelola galeri foto

/dashboard/pelatih      → Dashboard pelatih
/dashboard/atlet        → Dashboard atlet
/dashboard/wasit        → Dashboard wasit
```

---

## 🔐 Akun Default

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `koni2024` |
| Pelatih | Dibuat via panel admin | Ditentukan saat tambah pelatih |
| Atlet | Dibuat via panel admin | Ditentukan saat tambah atlet |
| Wasit | Dibuat via panel admin | Ditentukan saat tambah wasit |

> **Catatan:** Untuk mode frontend-only (tanpa backend), autentikasi admin menggunakan kredensial hardcoded. Akun pelatih/atlet/wasit memerlukan backend aktif.

---

## 📊 Arsitektur Aplikasi

```
┌─────────────────────────────────────────────┐
│              Browser / Client               │
├──────────────┬──────────────────────────────┤
│  Landing     │      Admin Panel             │
│  Page        │   (Protected by AuthCtx)     │
│  /public     │                              │
├──────────────┴──────────────────────────────┤
│              Context API Layer               │
│  Auth │ Atlet │ Pelatih │ Cabor │ Konten    │
├─────────────────────────────────────────────┤
│           Custom Hook Layer                  │
│         useLocalStorage(key, init)           │
├──────────────────────┬──────────────────────┤
│    localStorage      │   REST API           │
│  (Mode UTS/offline)  │  (Mode UAS/online)   │
│                      │  http://localhost:5000│
└──────────────────────┴──────────────────────┘
```

Data flow-nya: komponen → Context → useLocalStorage → browser localStorage.
Untuk switch ke backend, cukup ganti isi fungsi di Context dari
`localStorage.setItem(...)` menjadi `await api.post('/endpoint', data)`.

---

## 🎨 Design System

Aplikasi menggunakan Tailwind CSS v4 dengan custom component classes:

```css
/* Tombol */
.btn-primary    → Tombol utama biru
.btn-secondary  → Tombol outline abu
.btn-danger     → Tombol hapus merah

/* Form */
.input-field    → Input dengan focus ring
.label-field    → Label form

/* Layout */
.card           → Card putih dengan shadow
.table-wrapper  → Wrapper tabel dengan overflow scroll
.tbl            → Tabel dengan hover state

/* Badge */
Badge type="status"   → aktif / tidak_aktif
Badge type="grade"    → daerah / nasional / internasional
Badge type="medali"   → emas / perak / perunggu
Badge type="kategori" → koordinator / fisik / teknik / taktik
```

---

## 👥 Tim Pengembang

| Nama | NIM | Bagian |
|------|-----|--------|
| [Deska Febi Rosiana] | [2403040030] | Setup, Struktur Folder, Styling |
| [Iqbal Dwi Ganjar Saefullah] | [2403040029] | Context API, State Management, Data |
| [Erlangga Jaya Diputra] | [2403040019] | Routing, Admin Panel, CRUD |
| [Andika Candra Wijaya] | [2403040022] | Landing Page, Halaman Publik, Auth |


**Mata Kuliah:** Pemrograman Web Lanjut
**Universitas:** Universitas Muhammadiyah Purwokerto
**Tahun:** 2024

---

## 🤝 Mitra Instansi

<div align="center">

**KONI Kabupaten Banyumas**
Komite Olahraga Nasional Indonesia

*Narasumber: Triani Budi Lestari, S.E. — Wakil Sekretaris Umum*

Jl. ... · Purwokerto · Jawa Tengah · Indonesia

</div>

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik. Hak cipta © 2026 Tim Pengembang.

---

<div align="center">

Dibuat dengan ❤️ oleh Kelompok Kami · Pemrograman Web Lanjut · UMP 2026

</div>
