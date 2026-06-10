# Ringkasan File & Baris Kode untuk Presentasi (Live Code)

Dokumen ini merangkum semua file dan baris kode yang telah ditambahkan komentar `[PRESENTASI: ORANG X]` untuk memudahkan penyusunan slide presentasi (PPT) dan proses *live code*.

---

## 👨‍💻 ORANG 1 — Setup Project, Struktur Folder, Backend & Database

| File | Baris | Keterangan |
| :--- | :---: | :--- |
| `vite.config.js` | 3, 9 | Mengimpor dan mendaftarkan plugin Tailwind v4 pada konfigurasi Vite. |
| `src/index.css` | 1 | Baris tunggal untuk import *entry point* Tailwind v4. |
| `koni-backend/server.js` | 8 | Konfigurasi CORS agar hanya menerima *request* dari port 5173 (frontend). |
| `koni-backend/server.js` | 13 | Menyajikan folder `/uploads` secara statis agar file gambar/sertifikat dapat diakses. |
| `koni-backend/server.js` | 16 | Pemisahan (*modularization*) rute API per kelompok/kategori. |
| `koni-backend/server.js` | 31 | Menjalankan *server* Node.js pada port 5000. |
| `koni-backend/config/db.js` | 3 | Menggunakan `connection pool` dari library `mysql2` agar *handling* banyak *request* lebih efisien. |

---

## 👨‍💻 ORANG 2 — Autentikasi JWT, Middleware, Context API & Axios

| File | Baris | Keterangan |
| :--- | :---: | :--- |
| `koni-backend/routes/auth.js` | 6 | *Endpoint* tunggal `/api/auth/login` untuk masuknya semua jenis *role*. |
| `koni-backend/routes/auth.js` | 32 | Query database untuk mencari user berdasarkan input username. |
| `koni-backend/routes/auth.js` | 40 | Verifikasi kecocokan *password* dengan *hash* menggunakan `bcrypt`. |
| `koni-backend/routes/auth.js` | 54 | Mem-buat (*generate*) *token* JWT yang di dalamnya disematkan payload berupa *role* dan ID pengguna. |
| `koni-backend/middleware/auth.js` | 4 | Middleware untuk memverifikasi apakah *token* JWT dari header *Authorization* sah. |
| `koni-backend/middleware/auth.js` | 24 | Middleware proteksi route tambahan berdasarkan pengecekan *role* (*Role Guard*). |
| `src/api/axios.js` | 7 | Interceptor *Request*: otomatis menyisipkan *token* JWT dari `localStorage` pada setiap *request*. |
| `src/api/axios.js` | 14 | Interceptor *Response*: menangkap error 401 (*Unauthorized*) lalu me-*redirect* user ke halaman login. |
| `src/context/AuthContext.jsx` | 14 | Fungsi utama penghubung *login* frontend ke API backend. |
| `src/context/AuthContext.jsx` | 22 | Menyimpan data user beserta *token* ke `localStorage` setelah *login* sukses. |
| `src/pages/LoginPage.jsx` | 5 | Konfigurasi objek *redirect URL* ke *dashboard* yang sesuai dengan masing-masing *role*. |

---

## 👨‍💻 ORANG 3 — Panel Admin, CRUD via API, dan Halaman Data Olahraga

| File | Baris | Keterangan |
| :--- | :---: | :--- |
| `src/App.jsx` | 69 | Menunjukkan struktur *React Router v6* yang dipisah menjadi 3 bagian proteksi navigasi (*Public, Role-Dashboard, Admin*). |
| `src/pages/AtletPage.jsx` | 29 | Fetch awal via API saat komponen pertama dimuat untuk mendapatkan data atlet dan daftar Cabor. |
| `src/pages/AtletPage.jsx` | 66 | Penggunaan method `PUT` (Update) via API Axios untuk mengedit atlet. |
| `src/pages/AtletPage.jsx` | 68 | Jika saat membuat/mengedit atlet *form* akun diisi, secara simultan akan memanggil API pembuatan akun login. |
| `src/pages/AtletPage.jsx` | 76 | Penggunaan method `POST` (Insert) via API Axios untuk menambah atlet. |
| `src/pages/AtletPage.jsx` | 79 | Memuat ulang otomatis data dari *backend* dengan fungsi `load()` setelah *form* selesai di-*submit*. |
| `koni-backend/routes/admin.js` | 65 | *Route* `GET /atlet` yang menggunakan query `LEFT JOIN` agar cabor tampil dengan nama bukan *ID*. |
| `koni-backend/routes/admin.js` | 69 | *Route* `POST /atlet` tempat backend menerima *request* tambah. |
| `koni-backend/routes/admin.js` | 77 | Fungsi pembuatan akun *login* untuk atlet yang memanggil *helper* `createUserAccount` di *backend*. |

---

## 👨‍💻 ORANG 4 — Dashboard Pelatih/Atlet/Wasit, Landing Page & Quill

| File | Baris | Keterangan |
| :--- | :---: | :--- |
| `src/pages/LandingPage.jsx` | 105 | Deklarasi *state* lokal untuk menampung *database real-time statistics*. |
| `src/pages/LandingPage.jsx` | 115 | `useEffect` fetch API *stats* paralel ketika *Landing Page* dibuka pengunjung. |
| `src/pages/dashboard/PelatihDashboard.jsx` | 75 | Pemanggilan data program latihan yang difilter melalui `query params` bulan kalender. |
| `src/pages/dashboard/PelatihDashboard.jsx` | 83 | Fungsi `handleSimpan` program latihan (tambah/edit). |
| `koni-backend/routes/pelatih.js` | 98 | *Route* `POST /presensi` untuk operasi simpan presensi *(Upsert: Insert or Update)*. |
| `koni-backend/middleware/upload.js` | 9 | `multer.diskStorage` untuk membuat format penamaan *file* PDF/Gambar secara otomatis sebelum disimpan. |
| `src/pages/dashboard/AtletDashboard.jsx` | 155 | Pembuatan `new FormData()` untuk menyisipkan *file* pada *request* API. |
| `src/pages/dashboard/AtletDashboard.jsx` | 160 | Penetapan *header* `multipart/form-data` saat menggunakan Axios POST. |
| `src/pages/dashboard/WasitDashboard.jsx` | 62 | Input riwayat pertandingan dari halaman *dashboard* khusus *role* wasit. |
| `src/components/common/QuillEditor.jsx` | 69 | Inisialisasi awal editor menggunakan CDN eksternal *Quill*. |
| `src/components/common/QuillEditor.jsx` | 81 | Fungsi penangkap ketikan (event *listener text-change*). |
| `src/components/common/QuillEditor.jsx` | 84 | Konversi teks *editor* ke format `innerHTML` untuk diteruskan kembali ke form state induk. |
