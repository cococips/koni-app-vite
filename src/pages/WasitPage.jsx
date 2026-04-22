import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
import SearchBar from '../components/common/SearchBar'
import { formatTanggal, hitungUmur, LABEL_GRADE, todayStr } from '../utils/helpers'

const emptyForm = {
  nik:'', nama:'', tempat_lahir:'', tanggal_lahir:'',
  jenis_kelamin:'L', alamat:'', no_hp:'',
  cabor_id:'', lisensi:'', grade:'daerah', status:'aktif',
  username:'', password:'',
}

export default function WasitPage() {
  const [wasit,   setWasit]   = useState([])
  const [cabor,   setCabor]   = useState([])
  const [loading, setLoading] = useState(true)
  const [query,   setQuery]   = useState('')
  const [modal,   setModal]   = useState(false)
  const [target,  setTarget]  = useState(null)
  const [form,    setForm]    = useState(emptyForm)
  const [saving,  setSaving]  = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [rW, rC] = await Promise.all([api.get('/admin/wasit'), api.get('/admin/cabor')])
      setWasit(rW.data.data)
      setCabor(rC.data.data.filter(c => c.status === 'aktif'))
    } catch (err) { alert('Gagal memuat: ' + (err.response?.data?.message || err.message)) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const displayed = wasit.filter(w =>
    w.nama.toLowerCase().includes(query.toLowerCase()) ||
    (w.nik||'').includes(query) ||
    (w.lisensi||'').toLowerCase().includes(query.toLowerCase())
  )

  const set = (k, v) => setForm(f => ({...f, [k]: v}))
  function bukaEdit(item) { setForm({...emptyForm,...item,username:'',password:''}); setTarget(item); setModal('form') }
  function tutup() { setModal(false); setTarget(null) }

  async function handleSubmit() {
    if (!form.nama) return alert('Nama wajib diisi.')
    setSaving(true)
    try {
      if (target) {
        await api.put(`/admin/wasit/${target.id}`, form)
        if (form.username && form.password)
          await api.post('/admin/create-account', { ref_id: target.id, role:'wasit', username:form.username, password:form.password })
      } else {
        await api.post('/admin/wasit', form)
      }
      tutup(); load()
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan.') }
    setSaving(false)
  }

  async function handleHapus() {
    try { await api.delete(`/admin/wasit/${target.id}`); tutup(); load() }
    catch (err) { alert(err.response?.data?.message || 'Gagal menghapus.') }
  }

  const gradeColor = { daerah:'bg-green-100 text-green-800', nasional:'bg-blue-100 text-blue-800', internasional:'bg-purple-100 text-purple-800' }

  return (
    <div className="space-y-4">
      {/* Stat */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Total Wasit', value: wasit.length, cls:'border-amber-100 bg-amber-50 text-amber-700' },
          { label:'Aktif',       value: wasit.filter(w=>w.status==='aktif').length, cls:'border-emerald-100 bg-emerald-50 text-emerald-700' },
          { label:'Tidak Aktif', value: wasit.filter(w=>w.status!=='aktif').length, cls:'border-gray-100 bg-gray-50 text-gray-600' },
        ].map(s => (
          <div key={s.label} className={`card p-4 border ${s.cls}`}>
            <p className="text-xs font-medium">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Cari nama / NIK / lisensi..." />
        <button onClick={() => { setForm(emptyForm); setTarget(null); setModal('form') }} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Tambah Wasit
        </button>
      </div>

      <p className="text-xs text-gray-400">{loading ? 'Memuat...' : `${displayed.length} dari ${wasit.length} wasit`}</p>

      <div className="card table-wrapper">
        <table className="tbl">
          <thead>
            <tr><th>#</th><th>Nama</th><th>Cabor</th><th>Lisensi</th><th>Grade</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan={7} className="text-center py-12 text-gray-400">Memuat...</td></tr>
              : displayed.length === 0
              ? <tr><td colSpan={7} className="text-center py-12 text-gray-400">Tidak ada data</td></tr>
              : displayed.map((w, i) => (
                <tr key={w.id}>
                  <td className="text-gray-400">{i+1}</td>
                  <td>
                    <div className="font-medium text-gray-800">{w.nama}</div>
                    <div className="text-xs text-gray-400">{w.nik||'-'} · {w.jenis_kelamin==='L'?'Laki-laki':'Perempuan'}</div>
                  </td>
                  <td>{w.cabor_nama||<span className="text-gray-300">-</span>}</td>
                  <td>
                    {w.lisensi
                      ? <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded font-mono">{w.lisensi}</span>
                      : <span className="text-gray-300 text-xs">-</span>
                    }
                  </td>
                  <td>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${gradeColor[w.grade]||'bg-gray-100 text-gray-600'}`}>
                      {w.grade}
                    </span>
                  </td>
                  <td><Badge type="status" value={w.status}/></td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => bukaEdit(w)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button onClick={() => { setTarget(w); setModal('hapus') }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <Modal isOpen={modal==='form'} onClose={tutup} title={target?'Edit Wasit':'Tambah Wasit'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label-field">Nama Lengkap *</label>
            <input className="input-field" value={form.nama} onChange={e=>set('nama',e.target.value)} placeholder="Nama lengkap wasit"/>
          </div>
          <div><label className="label-field">NIK</label><input className="input-field" value={form.nik} maxLength={16} onChange={e=>set('nik',e.target.value)}/></div>
          <div><label className="label-field">No. HP</label><input className="input-field" value={form.no_hp} onChange={e=>set('no_hp',e.target.value)}/></div>
          <div><label className="label-field">Tempat Lahir</label><input className="input-field" value={form.tempat_lahir} onChange={e=>set('tempat_lahir',e.target.value)}/></div>
          <div><label className="label-field">Tanggal Lahir</label><input type="date" className="input-field" value={form.tanggal_lahir} max={todayStr()} onChange={e=>set('tanggal_lahir',e.target.value)}/></div>
          <div>
            <label className="label-field">Jenis Kelamin</label>
            <select className="input-field" value={form.jenis_kelamin} onChange={e=>set('jenis_kelamin',e.target.value)}>
              <option value="L">Laki-laki</option><option value="P">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="label-field">Cabang Olahraga</label>
            <select className="input-field" value={form.cabor_id} onChange={e=>set('cabor_id',e.target.value)}>
              <option value="">-- Pilih Cabor --</option>
              {cabor.map(c=><option key={c.id} value={c.id}>{c.nama}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">No. Lisensi</label>
            <input className="input-field" value={form.lisensi} onChange={e=>set('lisensi',e.target.value)} placeholder="Contoh: WAS-D-001"/>
          </div>
          <div>
            <label className="label-field">Grade</label>
            <select className="input-field" value={form.grade} onChange={e=>set('grade',e.target.value)}>
              {Object.entries(LABEL_GRADE).map(([k,v])=><option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Status</label>
            <select className="input-field" value={form.status} onChange={e=>set('status',e.target.value)}>
              <option value="aktif">Aktif</option><option value="tidak_aktif">Tidak Aktif</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="label-field">Alamat</label>
            <textarea className="input-field resize-none" rows={2} value={form.alamat} onChange={e=>set('alamat',e.target.value)}/>
          </div>

          {/* Akun Login */}
          <div className="col-span-2 mt-2 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Akun Login Wasit {target?'(kosongkan jika tidak ingin ubah)':'(opsional)'}
            </p>
          </div>
          <div>
            <label className="label-field">Username</label>
            <input className="input-field" value={form.username} onChange={e=>set('username',e.target.value)} placeholder="Username untuk login"/>
          </div>
          <div>
            <label className="label-field">Password</label>
            <input type="password" className="input-field" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="Min. 6 karakter"/>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={tutup} className="btn-secondary">Batal</button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : target ? 'Perbarui' : 'Simpan'}
          </button>
        </div>
      </Modal>

      {/* Modal Hapus */}
      <Modal isOpen={modal==='hapus'} onClose={tutup} title="Hapus Wasit" size="sm">
        <p className="text-sm text-gray-600">
          Yakin hapus wasit <span className="font-semibold">{target?.nama}</span>?
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={tutup} className="btn-secondary">Batal</button>
          <button onClick={handleHapus} className="btn-danger">Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
