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
    ['Cabang Olahraga', profil.cabor_nama||'-'], ['Status', profil.status],
  ]
  return (
    <div className="card p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-2xl">{profil.nama?.[0]}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{profil.nama}</h2>
          <p className="text-sm text-red-600 font-medium">{profil.cabor_nama}</p>
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

function TabPresensi() {
  const [data, setData]     = useState([])
  const [jadwal, setJadwal] = useState([])

  useEffect(() => {
    api.get('/atlet/presensi').then(r => setData(r.data.data)).catch(()=>{})
    api.get('/atlet/jadwal-latihan').then(r => setJadwal(r.data.data)).catch(()=>{})
  }, [])

  const statusColor = { hadir:'bg-emerald-100 text-emerald-700', izin:'bg-blue-100 text-blue-700', sakit:'bg-amber-100 text-amber-700', alpha:'bg-red-100 text-red-700' }
  const totalHadir = data.filter(d => d.status==='hadir').length

  return (
    <div className="space-y-6">
      {/* Ringkasan */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Total Latihan', value: data.length, color:'bg-blue-50 text-blue-700 border-blue-100' },
          { label:'Hadir', value: totalHadir, color:'bg-emerald-50 text-emerald-700 border-emerald-100' },
          { label:'Tidak Hadir', value: data.length-totalHadir, color:'bg-red-50 text-red-700 border-red-100' },
        ].map(s => (
          <div key={s.label} className={`card p-4 border ${s.color} text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Jadwal mendatang */}
      {jadwal.filter(j => j.tanggal >= new Date().toISOString().split('T')[0]).length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Jadwal Latihan Mendatang</h3>
          <div className="space-y-2">
            {jadwal.filter(j => j.tanggal >= new Date().toISOString().split('T')[0]).slice(0,3).map(j => (
              <div key={j.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">{j.judul}</p>
                  <p className="text-xs text-blue-600">{formatTanggal(j.tanggal)} · {j.pelatih_nama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Riwayat presensi */}
      <div className="card table-wrapper">
        <table className="tbl">
          <thead><tr><th>Sesi Latihan</th><th>Tanggal</th><th>Pelatih</th><th>Status</th></tr></thead>
          <tbody>
            {data.length===0
              ? <tr><td colSpan={4} className="text-center py-12 text-gray-400">Belum ada riwayat presensi.</td></tr>
              : data.map(d => (
                <tr key={d.id}>
                  <td className="font-medium text-gray-800">{d.latihan_judul}</td>
                  <td>{formatTanggal(d.tanggal)}</td>
                  <td className="text-gray-500">{d.pelatih_nama||'-'}</td>
                  <td><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[d.status]}`}>{d.status}</span></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TabPrestasi() {
  const [data, setData] = useState([])
  useEffect(() => { api.get('/atlet/prestasi').then(r => setData(r.data.data)).catch(()=>{}) }, [])

  const medaliColor = { emas:'bg-yellow-100 text-yellow-800', perak:'bg-gray-200 text-gray-700', perunggu:'bg-orange-100 text-orange-700' }

  return (
    <div className="space-y-4">
      {data.length===0
        ? <div className="card p-12 text-center text-gray-400">Belum ada prestasi tercatat.</div>
        : data.map(p => (
          <div key={p.id} className="card p-4 flex items-start gap-4">
            <div className={`px-3 py-1 rounded-full text-sm font-bold flex-shrink-0 ${medaliColor[p.medali]||'bg-gray-100 text-gray-600'}`}>
              {p.medali==='emas'?'🥇':p.medali==='perak'?'🥈':'🥉'}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{p.nama_kejuaraan}</p>
              <p className="text-sm text-gray-500">{p.nomor_lomba} · {p.hasil}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.tahun}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{p.grade}</span>
                {p.lokasi && <span className="text-xs text-gray-400">{p.lokasi}</span>}
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

// Import TabSertifikat dari komponen yang sama
function TabSertifikat({ role }) {
  const [list, setList]   = useState([])
  const [file, setFile]   = useState(null)
  const [form, setForm]   = useState({ judul: '', tipe: 'kejuaraan', keterangan: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { api.get(`/${role}/sertifikat`).then(r => setList(r.data.data)).catch(()=>{}) }, [])

  async function handleUpload() {
    if (!file || !form.judul) return alert('File dan judul wajib.')
    setLoading(true)
    const fd = new FormData()
    fd.append('file', file); fd.append('judul', form.judul)
    fd.append('tipe', form.tipe); fd.append('keterangan', form.keterangan)
    try {
      await api.post(`/${role}/sertifikat`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setFile(null); setForm({ judul:'', tipe:'kejuaraan', keterangan:'' })
      const r = await api.get(`/${role}/sertifikat`); setList(r.data.data)
    } catch (err) { alert(err.response?.data?.message||'Upload gagal.') }
    setLoading(false)
  }

  async function hapus(id) {
    if (!confirm('Hapus sertifikat?')) return
    await api.delete(`/${role}/sertifikat/${id}`)
    const r = await api.get(`/${role}/sertifikat`); setList(r.data.data)
  }

  const isImage = url => /\.(jpg|jpeg|png|webp)$/i.test(url)

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Upload Sertifikat / Piagam Kejuaraan</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><label className="label-field">Judul *</label><input className="input-field" value={form.judul} onChange={e=>setForm(f=>({...f,judul:e.target.value}))} /></div>
          <div><label className="label-field">Tipe</label>
            <select className="input-field" value={form.tipe} onChange={e=>setForm(f=>({...f,tipe:e.target.value}))}>
              <option value="kejuaraan">Kejuaraan</option><option value="lainnya">Lainnya</option>
            </select>
          </div>
          <div><label className="label-field">File</label><input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="input-field" onChange={e=>setFile(e.target.files[0])} /></div>
        </div>
        <button className="btn-primary mt-4" onClick={handleUpload} disabled={loading}>{loading?'Mengupload...':'Upload'}</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {list.length===0 ? <p className="col-span-3 text-center text-gray-400 py-12">Belum ada sertifikat.</p>
          : list.map(s => (
            <div key={s.id} className="card overflow-hidden">
              {isImage(s.file_url)
                ? <img src={`http://localhost:5000${s.file_url}`} alt={s.judul} className="w-full h-40 object-cover" />
                : <div className="w-full h-40 bg-red-50 flex items-center justify-center"><svg className="w-10 h-10 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg></div>
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

export default function AtletDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab]       = useState('profil')
  const [profil, setProfil] = useState(null)

  useEffect(() => { api.get('/atlet/me').then(r => setProfil(r.data.data)).catch(()=>{}) }, [])

  const tabs = [
    { id:'profil',    label:'Profil'    },
    { id:'presensi',  label:'Presensi'  },
    { id:'prestasi',  label:'Prestasi'  },
    { id:'sertifikat',label:'Sertifikat'},
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="KONI" className="w-8 h-8 object-contain" onError={e=>e.target.style.display='none'} />
          <div>
            <p className="font-semibold text-gray-800 text-sm">Dashboard Atlet</p>
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
          <p className="text-gray-500 text-sm mt-1">{profil?.cabor_nama}</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab===t.id?'bg-white text-gray-800 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
        {tab==='profil'     && <TabProfil profil={profil} />}
        {tab==='presensi'   && <TabPresensi />}
        {tab==='prestasi'   && <TabPrestasi />}
        {tab==='sertifikat' && <TabSertifikat role="atlet" />}
      </div>
    </div>
  )
}
