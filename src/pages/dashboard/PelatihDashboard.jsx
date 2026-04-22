import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { formatTanggal } from '../../utils/helpers'

// ── Komponen kecil ────────────────────────────────────────────
function StatCard({ label, value, color = 'blue' }) {
  const c = { blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100', amber: 'bg-amber-50 text-amber-700 border-amber-100' }
  return (
    <div className={`card p-5 border ${c[color]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  )
}

function Badge({ status }) {
  const map = { hadir: 'bg-emerald-100 text-emerald-700', izin: 'bg-blue-100 text-blue-700', sakit: 'bg-amber-100 text-amber-700', alpha: 'bg-red-100 text-red-700' }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
}

// ── Tab Profil ────────────────────────────────────────────────
function TabProfil({ profil }) {
  if (!profil) return <div className="text-center py-12 text-gray-400">Memuat profil...</div>
  const items = [
    ['NIK', profil.nik || '-'],
    ['Tempat Lahir', profil.tempat_lahir || '-'],
    ['Tanggal Lahir', formatTanggal(profil.tanggal_lahir)],
    ['Jenis Kelamin', profil.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'],
    ['No. HP', profil.no_hp || '-'],
    ['Alamat', profil.alamat || '-'],
    ['Cabang Olahraga', profil.cabor_nama || '-'],
    ['Kategori', profil.kategori],
    ['Grade', profil.grade],
    ['Status', profil.status],
  ]
  return (
    <div className="card p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-2xl">{profil.nama?.[0]}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{profil.nama}</h2>
          <p className="text-sm text-blue-600 font-medium">{profil.cabor_nama} — {profil.kategori}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map(([label, val]) => (
          <div key={label} className="border-b border-gray-50 pb-2">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{val}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab Program Latihan & Kalender ────────────────────────────
function TabProgram({ pelatihId }) {
  const [programs, setPrograms] = useState([])
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState({ judul: '', deskripsi: '', tanggal: '', durasi_menit: 90, lokasi: '' })
  const [editId, setEditId]     = useState(null)
  const [presensiModal, setPresensiModal] = useState(null) // program yang sedang diisi presensi
  const [atletList, setAtletList]         = useState([])
  const [presensiData, setPresensiData]   = useState([])
  const [bulan, setBulan] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadPrograms() }, [bulan])

  async function loadPrograms() {
    try {
      const r = await api.get(`/pelatih/program-latihan?bulan=${bulan}`)
      setPrograms(r.data.data)
    } catch {}
  }

  async function handleSimpan() {
    if (!form.judul || !form.tanggal) return alert('Judul dan tanggal wajib.')
    setLoading(true)
    try {
      if (editId) await api.put(`/pelatih/program-latihan/${editId}`, form)
      else await api.post('/pelatih/program-latihan', form)
      setModal(false); setEditId(null); setForm({ judul: '', deskripsi: '', tanggal: '', durasi_menit: 90, lokasi: '' })
      loadPrograms()
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan.') }
    setLoading(false)
  }

  async function handleHapus(id) {
    if (!confirm('Hapus program latihan ini?')) return
    await api.delete(`/pelatih/program-latihan/${id}`)
    loadPrograms()
  }

  async function bukaPresensi(program) {
    try {
      const r = await api.get(`/pelatih/presensi/${program.id}`)
      setAtletList(r.data.data)
      setPresensiData(r.data.data.map(a => ({ atlet_id: a.atlet_id, status: a.status || 'hadir', keterangan: a.keterangan || '' })))
      setPresensiModal(program)
    } catch {}
  }

  async function simpanPresensi() {
    try {
      await api.post('/pelatih/presensi', { program_latihan_id: presensiModal.id, data: presensiData })
      alert('Presensi tersimpan!')
      setPresensiModal(null)
      loadPrograms()
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan presensi.') }
  }

  function updatePresensi(atlet_id, field, value) {
    setPresensiData(prev => prev.map(p => p.atlet_id === atlet_id ? { ...p, [field]: value } : p))
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Bulan:</label>
          <input type="month" className="input-field w-auto" value={bulan} onChange={e => setBulan(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={() => { setModal(true); setEditId(null); setForm({ judul: '', deskripsi: '', tanggal: '', durasi_menit: 90, lokasi: '' }) }}>
          + Tambah Program
        </button>
      </div>

      {/* List program */}
      {programs.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">Belum ada program latihan di bulan ini.</div>
      ) : (
        <div className="space-y-3">
          {programs.map(p => (
            <div key={p.id} className="card p-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800">{p.judul}</span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{p.durasi_menit} menit</span>
                  {p.total_hadir > 0 && <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{p.total_hadir} hadir</span>}
                </div>
                <p className="text-sm text-gray-500 mt-1">{formatTanggal(p.tanggal)} {p.lokasi ? `· ${p.lokasi}` : ''}</p>
                {p.deskripsi && <p className="text-xs text-gray-400 mt-1">{p.deskripsi}</p>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => bukaPresensi(p)}
                  className="px-3 py-1.5 text-xs bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 font-medium transition-colors">
                  Presensi
                </button>
                <button onClick={() => { setForm({ judul: p.judul, deskripsi: p.deskripsi||'', tanggal: p.tanggal, durasi_menit: p.durasi_menit, lokasi: p.lokasi||'' }); setEditId(p.id); setModal(true) }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onClick={() => handleHapus(p.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah/Edit Program */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-semibold text-gray-800 mb-4">{editId ? 'Edit' : 'Tambah'} Program Latihan</h3>
            <div className="space-y-3">
              <div><label className="label-field">Judul *</label><input className="input-field" value={form.judul} onChange={e => setForm(f => ({...f,judul:e.target.value}))} /></div>
              <div><label className="label-field">Tanggal *</label><input type="date" className="input-field" value={form.tanggal} onChange={e => setForm(f => ({...f,tanggal:e.target.value}))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label-field">Durasi (menit)</label><input type="number" className="input-field" value={form.durasi_menit} onChange={e => setForm(f => ({...f,durasi_menit:e.target.value}))} /></div>
                <div><label className="label-field">Lokasi</label><input className="input-field" value={form.lokasi} onChange={e => setForm(f => ({...f,lokasi:e.target.value}))} /></div>
              </div>
              <div><label className="label-field">Deskripsi</label><textarea className="input-field resize-none" rows={2} value={form.deskripsi} onChange={e => setForm(f => ({...f,deskripsi:e.target.value}))} /></div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button className="btn-secondary" onClick={() => setModal(false)}>Batal</button>
              <button className="btn-primary" onClick={handleSimpan} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Presensi */}
      {presensiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPresensiModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Presensi — {presensiModal.judul}</h3>
              <p className="text-xs text-gray-400">{formatTanggal(presensiModal.tanggal)}</p>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-4">
              {atletList.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Belum ada atlet di cabor ini.</p>
              ) : (
                <div className="space-y-3">
                  {presensiData.map((pr, i) => (
                    <div key={pr.atlet_id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                        {atletList[i]?.nama?.[0]}
                      </div>
                      <span className="flex-1 text-sm font-medium text-gray-800">{atletList[i]?.nama}</span>
                      <select
                        value={pr.status}
                        onChange={e => updatePresensi(pr.atlet_id, 'status', e.target.value)}
                        className="input-field w-auto text-xs py-1">
                        <option value="hadir">Hadir</option>
                        <option value="izin">Izin</option>
                        <option value="sakit">Sakit</option>
                        <option value="alpha">Alpha</option>
                      </select>
                      {pr.status !== 'hadir' && (
                        <input className="input-field w-32 text-xs py-1" placeholder="Keterangan"
                          value={pr.keterangan} onChange={e => updatePresensi(pr.atlet_id, 'keterangan', e.target.value)} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setPresensiModal(null)}>Batal</button>
              <button className="btn-primary" onClick={simpanPresensi}>Simpan Presensi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tab Sertifikat ────────────────────────────────────────────
function TabSertifikat({ role }) {
  const [list, setList]     = useState([])
  const [file, setFile]     = useState(null)
  const [form, setForm]     = useState({ judul: '', tipe: 'lainnya', keterangan: '' })
  const [loading, setLoading] = useState(false)

  const tipeMap = { pelatih: ['lisensi','pelatihan','lainnya'], atlet: ['kejuaraan','lainnya'], wasit: ['lisensi','lainnya'] }
  const tipes = tipeMap[role] || ['lainnya']

  useEffect(() => { loadList() }, [])

  async function loadList() {
    try {
      const r = await api.get(`/${role}/sertifikat`)
      setList(r.data.data)
    } catch {}
  }

  async function handleUpload() {
    if (!file || !form.judul) return alert('File dan judul wajib diisi.')
    setLoading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('judul', form.judul)
    fd.append('tipe', form.tipe)
    fd.append('keterangan', form.keterangan)
    try {
      await api.post(`/${role}/sertifikat`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setFile(null); setForm({ judul: '', tipe: tipes[0], keterangan: '' })
      loadList()
    } catch (err) { alert(err.response?.data?.message || 'Upload gagal.') }
    setLoading(false)
  }

  async function hapus(id) {
    if (!confirm('Hapus sertifikat ini?')) return
    await api.delete(`/${role}/sertifikat/${id}`)
    loadList()
  }

  const isImage = url => /\.(jpg|jpeg|png|webp)$/i.test(url)

  return (
    <div className="space-y-6">
      {/* Form upload */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Upload Sertifikat Baru</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <label className="label-field">Judul *</label>
            <input className="input-field" value={form.judul} onChange={e => setForm(f=>({...f,judul:e.target.value}))} placeholder="Nama sertifikat/piagam" />
          </div>
          <div>
            <label className="label-field">Tipe</label>
            <select className="input-field" value={form.tipe} onChange={e => setForm(f=>({...f,tipe:e.target.value}))}>
              {tipes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">File (JPG/PNG/PDF) *</label>
            <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="input-field"
              onChange={e => setFile(e.target.files[0])} />
          </div>
          <div className="col-span-2">
            <label className="label-field">Keterangan</label>
            <input className="input-field" value={form.keterangan} onChange={e => setForm(f=>({...f,keterangan:e.target.value}))} placeholder="Opsional" />
          </div>
        </div>
        <button className="btn-primary" onClick={handleUpload} disabled={loading}>
          {loading ? 'Mengupload...' : 'Upload Sertifikat'}
        </button>
      </div>

      {/* List sertifikat */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {list.length === 0 ? (
          <p className="col-span-3 text-center text-gray-400 py-12">Belum ada sertifikat.</p>
        ) : list.map(s => (
          <div key={s.id} className="card overflow-hidden group">
            {isImage(s.file_url) ? (
              <img src={`http://localhost:5000${s.file_url}`} alt={s.judul}
                className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-red-50 flex flex-col items-center justify-center gap-2">
                <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <span className="text-xs text-red-500 font-medium">PDF</span>
              </div>
            )}
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-800 truncate">{s.judul}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.tipe}</p>
              <div className="flex gap-2 mt-2">
                <a href={`http://localhost:5000${s.file_url}`} target="_blank" rel="noreferrer"
                  className="flex-1 text-xs text-center py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  Lihat
                </a>
                <button onClick={() => hapus(s.id)}
                  className="flex-1 text-xs text-center py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Dashboard Utama Pelatih ───────────────────────────────────
export default function PelatihDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab]     = useState('profil')
  const [profil, setProfil] = useState(null)

  useEffect(() => {
    api.get('/pelatih/me').then(r => setProfil(r.data.data)).catch(() => {})
  }, [])

  const tabs = [
    { id: 'profil',   label: 'Profil'           },
    { id: 'program',  label: 'Program Latihan'  },
    { id: 'sertifikat', label: 'Sertifikat'     },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="KONI" className="w-8 h-8 object-contain"
            onError={e => e.target.style.display='none'} />
          <div>
            <p className="font-semibold text-gray-800 text-sm">Dashboard Pelatih</p>
            <p className="text-xs text-gray-400">KONI Kab. Banyumas</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:block">{user?.nama}</span>
          <button onClick={() => { logout(); navigate('/login') }}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
            Keluar
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Sambutan */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Selamat datang, {profil?.nama?.split(' ')[0] || user?.nama}!</h1>
          <p className="text-gray-500 text-sm mt-1">{profil?.cabor_nama} · {profil?.kategori}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Konten tab */}
        {tab === 'profil'     && <TabProfil profil={profil} />}
        {tab === 'program'    && <TabProgram />}
        {tab === 'sertifikat' && <TabSertifikat role="pelatih" />}
      </div>
    </div>
  )
}
