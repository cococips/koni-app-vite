import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { formatTanggal } from '../../utils/helpers'

function TabProfil({ profil }) {
  if (!profil) return <div className="text-center py-12 text-gray-400">Memuat profil...</div>
  const items = [
    ['NIK', profil.nik||'-'], ['Tempat Lahir', profil.tempat_lahir||'-'],
    ['Tanggal Lahir', formatTanggal(profil.tanggal_lahir)],
    ['Jenis Kelamin', profil.jenis_kelamin==='L'?'Laki-laki':'Perempuan'],
    ['No. HP', profil.no_hp||'-'], ['Alamat', profil.alamat||'-'],
    ['Cabang Olahraga', profil.cabor_nama||'-'],
    ['Lisensi', profil.lisensi||'-'], ['Grade', profil.grade], ['Status', profil.status],
  ]
  return (
    <div className="card p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-2xl">{profil.nama?.[0]}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{profil.nama}</h2>
          <p className="text-sm text-amber-600 font-medium">{profil.cabor_nama} · Lisensi {profil.lisensi||'-'}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map(([l,v]) => (
          <div key={l} className="border-b border-gray-50 pb-2">
            <p className="text-xs text-gray-400">{l}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TabPertandingan() {
  const [list, setList]   = useState([])
  const [cabor, setCabor] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm]   = useState({ nama_event:'', tanggal:'', lokasi:'', cabor_id:'', keterangan:'' })
  const [editId, setEditId] = useState(null)
  const [bulan, setBulan] = useState(new Date().toISOString().slice(0,7))
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [bulan])
  useEffect(() => { api.get('/admin/cabor').then(r=>setCabor(r.data.data)).catch(()=>{}) }, [])

  async function load() {
    try { const r = await api.get(`/wasit/pertandingan?bulan=${bulan}`); setList(r.data.data) } catch {}
  }

  async function simpan() {
    if (!form.nama_event||!form.tanggal) return alert('Nama event dan tanggal wajib.')
    setLoading(true)
    try {
      if (editId) await api.put(`/wasit/pertandingan/${editId}`, form)
      else {
        // [PRESENTASI: ORANG 4] Input pertandingan baru dari dashboard wasit
        await api.post('/wasit/pertandingan', form)
      }
      setModal(false); setEditId(null); setForm({nama_event:'',tanggal:'',lokasi:'',cabor_id:'',keterangan:''})
      load()
    } catch (err) { alert(err.response?.data?.message||'Gagal menyimpan.') }
    setLoading(false)
  }

  async function hapus(id) {
    if (!confirm('Hapus data pertandingan ini?')) return
    await api.delete(`/wasit/pertandingan/${id}`); load()
  }

  const today = new Date().toISOString().split('T')[0]
  const mendatang = list.filter(p => p.tanggal >= today)
  const selesai   = list.filter(p => p.tanggal <  today)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Bulan:</label>
          <input type="month" className="input-field w-auto" value={bulan} onChange={e=>setBulan(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={()=>{setModal(true);setEditId(null);setForm({nama_event:'',tanggal:'',lokasi:'',cabor_id:'',keterangan:''})}}>
          + Tambah Pertandingan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {label:'Total Bulan Ini', value:list.length, color:'border-blue-100 bg-blue-50 text-blue-700'},
          {label:'Mendatang', value:mendatang.length, color:'border-emerald-100 bg-emerald-50 text-emerald-700'},
          {label:'Selesai', value:selesai.length, color:'border-gray-100 bg-gray-50 text-gray-600'},
        ].map(s => (
          <div key={s.label} className={`card p-4 border text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">Belum ada pertandingan di bulan ini.</div>
      ) : (
        <div className="space-y-3">
          {list.map(p => {
            const isUpcoming = p.tanggal >= today
            return (
              <div key={p.id} className="card p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isUpcoming?'bg-emerald-500':'bg-gray-300'}`}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800">{p.nama_event}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isUpcoming?'bg-emerald-100 text-emerald-700':'bg-gray-100 text-gray-500'}`}>
                        {isUpcoming?'Mendatang':'Selesai'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{formatTanggal(p.tanggal)} {p.lokasi?`· ${p.lokasi}`:''}</p>
                    {p.cabor_nama && <p className="text-xs text-gray-400">{p.cabor_nama}</p>}
                    {p.keterangan && <p className="text-xs text-gray-400 italic mt-0.5">{p.keterangan}</p>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={()=>{setForm({nama_event:p.nama_event,tanggal:p.tanggal,lokasi:p.lokasi||'',cabor_id:p.cabor_id||'',keterangan:p.keterangan||''});setEditId(p.id);setModal(true)}}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button onClick={()=>hapus(p.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal form */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-semibold text-gray-800 mb-4">{editId?'Edit':'Tambah'} Pertandingan</h3>
            <div className="space-y-3">
              <div><label className="label-field">Nama Event / Kejuaraan *</label><input className="input-field" value={form.nama_event} onChange={e=>setForm(f=>({...f,nama_event:e.target.value}))} placeholder="Contoh: Liga Futsal Banyumas 2024" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label-field">Tanggal *</label><input type="date" className="input-field" value={form.tanggal} onChange={e=>setForm(f=>({...f,tanggal:e.target.value}))} /></div>
                <div><label className="label-field">Cabang Olahraga</label>
                  <select className="input-field" value={form.cabor_id} onChange={e=>setForm(f=>({...f,cabor_id:e.target.value}))}>
                    <option value="">-- Pilih --</option>
                    {cabor.map(c=><option key={c.id} value={c.id}>{c.nama}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="label-field">Lokasi</label><input className="input-field" value={form.lokasi} onChange={e=>setForm(f=>({...f,lokasi:e.target.value}))} /></div>
              <div><label className="label-field">Keterangan</label><textarea className="input-field resize-none" rows={2} value={form.keterangan} onChange={e=>setForm(f=>({...f,keterangan:e.target.value}))} /></div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button className="btn-secondary" onClick={()=>setModal(false)}>Batal</button>
              <button className="btn-primary" onClick={simpan} disabled={loading}>{loading?'Menyimpan...':'Simpan'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TabSertifikat() {
  const [list, setList]   = useState([])
  const [file, setFile]   = useState(null)
  const [form, setForm]   = useState({ judul:'', tipe:'lisensi', keterangan:'' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { api.get('/wasit/sertifikat').then(r=>setList(r.data.data)).catch(()=>{}) }, [])

  async function handleUpload() {
    if (!file||!form.judul) return alert('File dan judul wajib.')
    setLoading(true)
    const fd = new FormData()
    fd.append('file',file); fd.append('judul',form.judul); fd.append('tipe',form.tipe); fd.append('keterangan',form.keterangan)
    try {
      await api.post('/wasit/sertifikat', fd, { headers: {'Content-Type':'multipart/form-data'} })
      setFile(null); setForm({judul:'',tipe:'lisensi',keterangan:''})
      const r = await api.get('/wasit/sertifikat'); setList(r.data.data)
    } catch (err) { alert(err.response?.data?.message||'Upload gagal.') }
    setLoading(false)
  }

  async function hapus(id) {
    if (!confirm('Hapus?')) return
    await api.delete(`/wasit/sertifikat/${id}`)
    const r = await api.get('/wasit/sertifikat'); setList(r.data.data)
  }

  const isImage = url => /\.(jpg|jpeg|png|webp)$/i.test(url)

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Upload Sertifikat / Lisensi Wasit</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><label className="label-field">Judul *</label><input className="input-field" value={form.judul} onChange={e=>setForm(f=>({...f,judul:e.target.value}))} /></div>
          <div><label className="label-field">Tipe</label>
            <select className="input-field" value={form.tipe} onChange={e=>setForm(f=>({...f,tipe:e.target.value}))}>
              <option value="lisensi">Lisensi</option><option value="lainnya">Lainnya</option>
            </select>
          </div>
          <div><label className="label-field">File</label><input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="input-field" onChange={e=>setFile(e.target.files[0])} /></div>
        </div>
        <button className="btn-primary mt-4" onClick={handleUpload} disabled={loading}>{loading?'Mengupload...':'Upload'}</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {list.length===0 ? <p className="col-span-3 text-center text-gray-400 py-12">Belum ada sertifikat.</p>
          : list.map(s=>(
            <div key={s.id} className="card overflow-hidden">
              {isImage(s.file_url)
                ? <img src={`http://localhost:5000${s.file_url}`} alt={s.judul} className="w-full h-40 object-cover" />
                : <div className="w-full h-40 bg-amber-50 flex items-center justify-center"><svg className="w-10 h-10 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg></div>
              }
              <div className="p-3">
                <p className="text-sm font-semibold truncate">{s.judul}</p>
                <p className="text-xs text-gray-400">{s.tipe}</p>
                <div className="flex gap-2 mt-2">
                  <a href={`http://localhost:5000${s.file_url}`} target="_blank" rel="noreferrer" className="flex-1 text-xs text-center py-1 bg-blue-50 text-blue-600 rounded-lg">Lihat</a>
                  <button onClick={()=>hapus(s.id)} className="flex-1 text-xs text-center py-1 bg-red-50 text-red-500 rounded-lg">Hapus</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default function WasitDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab]       = useState('profil')
  const [profil, setProfil] = useState(null)

  useEffect(() => { api.get('/wasit/me').then(r=>setProfil(r.data.data)).catch(()=>{}) }, [])

  const tabs = [
    {id:'profil',label:'Profil'},
    {id:'pertandingan',label:'Pertandingan'},
    {id:'sertifikat',label:'Sertifikat'},
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="KONI" className="w-8 h-8 object-contain" onError={e=>e.target.style.display='none'} />
          <div>
            <p className="font-semibold text-gray-800 text-sm">Dashboard Wasit</p>
            <p className="text-xs text-gray-400">KONI Kab. Banyumas</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:block">{user?.nama}</span>
          <button onClick={()=>{logout();navigate('/login')}} className="text-sm text-red-500 hover:text-red-700 font-medium">Keluar</button>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Halo, {profil?.nama?.split(' ')[0]||user?.nama}!</h1>
          <p className="text-gray-500 text-sm mt-1">{profil?.cabor_nama} · Lisensi {profil?.lisensi||'-'}</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab===t.id?'bg-white text-gray-800 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
        {tab==='profil'        && <TabProfil profil={profil} />}
        {tab==='pertandingan'  && <TabPertandingan />}
        {tab==='sertifikat'    && <TabSertifikat />}
      </div>
    </div>
  )
}
