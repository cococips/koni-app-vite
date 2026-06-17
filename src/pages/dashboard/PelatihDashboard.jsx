import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { formatTanggal } from '../../utils/helpers'

// ── Tab Profil ────────────────────────────────────────────────
function TabProfil({ profil }) {
  if (!profil) return (
    <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-100 shadow-soft animate-pulse">
      <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
      <div className="h-3 bg-slate-100 rounded w-24"></div>
    </div>
  )
  
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
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 relative z-10 border-b border-slate-100 pb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30 ring-4 ring-white">
          <span className="text-white font-black text-3xl">{profil.nama?.[0]}</span>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">{profil.nama}</h2>
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
              {profil.cabor_nama}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              {profil.kategori}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${profil.status === 'aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {profil.status}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 relative z-10">
        {items.map(([l, v]) => (
          <div key={l} className="group">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-blue-500 transition-colors">{l}</p>
            <p className="text-sm font-semibold text-slate-800 bg-slate-50/50 px-3 py-2 rounded-xl border border-slate-100">{v}</p>
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
  const [presensiModal, setPresensiModal] = useState(null)
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
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Filter Bulan</label>
            <input type="month" className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer" value={bulan} onChange={e => setBulan(e.target.value)} />
          </div>
        </div>
        <button className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-brand-500/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2" onClick={() => { setModal(true); setEditId(null); setForm({ judul: '', deskripsi: '', tanggal: '', durasi_menit: 90, lokasi: '' }) }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Tambah Program
        </button>
      </div>

      {/* List program */}
      {programs.length === 0 ? (
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 text-center border border-slate-100 shadow-soft">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🗓️</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Belum Ada Program</h3>
          <p className="text-slate-500 text-sm">Tidak ada jadwal latihan di bulan ini.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {programs.map(p => (
            <div key={p.id} className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-soft transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-extrabold text-slate-900 text-lg leading-snug">{p.judul}</span>
                  <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full uppercase tracking-wider">{p.durasi_menit} menit</span>
                  {p.total_hadir > 0 && <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wider">✓ {p.total_hadir} Hadir</span>}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500 mb-2">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    {formatTanggal(p.tanggal)}
                  </div>
                  {p.lokasi && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      </svg>
                      {p.lokasi}
                    </div>
                  )}
                </div>
                {p.deskripsi && <p className="text-sm text-slate-400 line-clamp-2">{p.deskripsi}</p>}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button onClick={() => bukaPresensi(p)}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors shadow-sm text-center">
                  Cek Presensi
                </button>
                <button onClick={() => { setForm({ judul: p.judul, deskripsi: p.deskripsi||'', tanggal: p.tanggal, durasi_menit: p.durasi_menit, lokasi: p.lokasi||'' }); setEditId(p.id); setModal(true) }}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shadow-sm bg-slate-50 border border-slate-100">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onClick={() => handleHapus(p.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shadow-sm bg-slate-50 border border-slate-100">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah/Edit Program */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-scale-in">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              {editId ? 'Edit' : 'Tambah'} Program
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Judul Latihan *</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" value={form.judul} onChange={e => setForm(f => ({...f,judul:e.target.value}))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal *</label>
                <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" value={form.tanggal} onChange={e => setForm(f => ({...f,tanggal:e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Durasi (menit)</label>
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" value={form.durasi_menit} onChange={e => setForm(f => ({...f,durasi_menit:e.target.value}))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lokasi</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" value={form.lokasi} onChange={e => setForm(f => ({...f,lokasi:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi Singkat</label>
                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none resize-none" rows={3} value={form.deskripsi} onChange={e => setForm(f => ({...f,deskripsi:e.target.value}))} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors" onClick={() => setModal(false)}>Batal</button>
              <button className="px-6 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg shadow-brand-500/30 transition-all" onClick={handleSimpan} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan Program'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Presensi */}
      {presensiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPresensiModal(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
            <div className="px-6 sm:px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <span className="inline-block text-[10px] font-extrabold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">Presensi Kehadiran</span>
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{presensiModal.judul}</h3>
                <p className="text-xs font-bold text-slate-500 mt-1">{formatTanggal(presensiModal.tanggal)}</p>
              </div>
              <button onClick={() => setPresensiModal(null)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 sm:p-8 bg-slate-50/50">
              {atletList.length === 0 ? (
                <div className="text-center bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <span className="text-3xl mb-2 block">🏃‍♂️</span>
                  <p className="font-bold text-slate-700">Belum ada atlet yang terdaftar</p>
                  <p className="text-xs text-slate-500 mt-1">Cabor ini belum memiliki atlet aktif.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {presensiData.map((pr, i) => (
                      <div key={pr.atlet_id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-100 to-rose-100 flex items-center justify-center text-sm font-black text-brand-700 flex-shrink-0 ring-2 ring-white shadow-sm">
                            {atletList[i]?.nama?.[0]}
                          </div>
                          <span className="font-bold text-slate-800">{atletList[i]?.nama}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:w-auto w-full ml-12 sm:ml-0">
                          <select
                            value={pr.status}
                            onChange={e => updatePresensi(pr.atlet_id, 'status', e.target.value)}
                            className={`w-full sm:w-28 text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-xl border outline-none appearance-none cursor-pointer transition-colors
                              ${pr.status === 'hadir' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                pr.status === 'izin' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                pr.status === 'sakit' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                'bg-rose-50 text-rose-700 border-rose-200'}`}>
                            <option value="hadir">✓ Hadir</option>
                            <option value="izin">✉ Izin</option>
                            <option value="sakit">⚕ Sakit</option>
                            <option value="alpha">✕ Alpha</option>
                          </select>
                          {pr.status !== 'hadir' && (
                            <input className="w-full sm:w-40 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" placeholder="Keterangan..."
                              value={pr.keterangan} onChange={e => updatePresensi(pr.atlet_id, 'keterangan', e.target.value)} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 sm:px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors" onClick={() => setPresensiModal(null)}>Batal</button>
              <button className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-500/30 transition-all" onClick={simpanPresensi}>Simpan Presensi</button>
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
    <div className="space-y-8">
      {/* Form upload */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft">
        <h3 className="font-extrabold text-slate-900 text-lg mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Sertifikat / Lisensi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Judul Dokumen *</label>
            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" value={form.judul} onChange={e => setForm(f=>({...f,judul:e.target.value}))} placeholder="Contoh: Lisensi Pelatih Tingkat Nasional" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tipe Dokumen</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all appearance-none outline-none" value={form.tipe} onChange={e => setForm(f=>({...f,tipe:e.target.value}))}>
              {tipes.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">File (JPG/PNG/PDF) *</label>
            <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 transition-all cursor-pointer outline-none"
              onChange={e => setFile(e.target.files[0])} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Keterangan Tambahan</label>
            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" value={form.keterangan} onChange={e => setForm(f=>({...f,keterangan:e.target.value}))} placeholder="Opsional" />
          </div>
        </div>
        <button className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0" onClick={handleUpload} disabled={loading}>
          {loading ? 'Mengupload...' : 'Simpan Dokumen'}
        </button>
      </div>

      {/* List sertifikat */}
      <div>
        <h3 className="font-extrabold text-slate-900 text-lg mb-4 ml-1">Koleksi Dokumen & Lisensi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {list.length === 0 ? (
            <div className="col-span-full bg-white/50 backdrop-blur-sm rounded-2xl text-center text-slate-400 py-12 border border-slate-100 border-dashed">Belum ada dokumen tersimpan.</div>
          ) : list.map(s => (
            <div key={s.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-soft transition-all group">
              <div className="relative h-40 bg-slate-100 overflow-hidden">
                {isImage(s.file_url) ? (
                  <img src={`http://localhost:5000${s.file_url}`} alt={s.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                    <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dokumen PDF</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">{s.tipe}</div>
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-slate-900 mb-4 line-clamp-2 leading-snug">{s.judul}</p>
                <div className="flex gap-2 mt-auto">
                  <a href={`http://localhost:5000${s.file_url}`} target="_blank" rel="noreferrer"
                    className="flex-1 text-xs font-bold text-center py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-lg transition-colors">
                    Lihat
                  </a>
                  <button onClick={() => hapus(s.id)}
                    className="flex-1 text-xs font-bold text-center py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
    { id: 'profil',   label: 'Profil Saya', icon: '👤' },
    { id: 'program',  label: 'Program Latihan', icon: '📋' },
    { id: 'sertifikat', label: 'Sertifikat & Lisensi', icon: '🎓' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-brand-50 p-2 rounded-xl">
            <img src="/logo.png" alt="KONI" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" onError={e => e.target.style.display='none'} />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 text-sm sm:text-base leading-none">Dashboard Pelatih</p>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">KONI Banyumas</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-right">
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">{user?.nama}</p>
              <p className="text-xs font-medium text-brand-600 mt-1">Pelatih Utama</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600">
              {user?.nama?.[0]}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
          <button onClick={() => { logout(); navigate('/login') }}
            className="text-sm font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors">
            Keluar
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Selamat datang, <span className="text-brand-600">{profil?.nama?.split(' ')[0] || user?.nama}</span> 👋
          </h1>
          {profil?.cabor_nama && (
            <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              Pelatih {profil.cabor_nama} <span className="mx-1">•</span> Kategori {profil.kategori}
            </p>
          )}
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-2 sm:gap-3 bg-slate-200/50 p-1.5 rounded-2xl mb-8 w-fit overflow-x-auto max-w-full hide-scrollbar">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${tab === t.id ? 'bg-white text-brand-700 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <span className="text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {tab === 'profil'     && <TabProfil profil={profil} />}
          {tab === 'program'    && <TabProgram />}
          {tab === 'sertifikat' && <TabSertifikat role="pelatih" />}
        </div>
      </div>
    </div>
  )
}
