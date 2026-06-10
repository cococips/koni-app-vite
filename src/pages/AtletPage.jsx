import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import Modal     from '../components/common/Modal'
import Badge     from '../components/common/Badge'
import SearchBar from '../components/common/SearchBar'
import { formatTanggal, hitungUmur, todayStr } from '../utils/helpers'

const emptyForm = {
  nik: '', nama: '', tempat_lahir: '', tanggal_lahir: '',
  jenis_kelamin: 'L', alamat: '', no_hp: '',
  cabor_id: '', status: 'aktif',
  username: '', password: '',
}

export default function AtletPage() {
  const [atlet,  setAtlet]  = useState([])
  const [cabor,  setCabor]  = useState([])
  const [loading, setLoading] = useState(true)
  const [query,  setQuery]  = useState('')
  const [filterJK, setFilterJK] = useState('semua')
  const [modal,  setModal]  = useState(false)
  const [target, setTarget] = useState(null)
  const [form,   setForm]   = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      // [PRESENTASI: ORANG 3] Load data dari API saat komponen mount
      const [rAtlet, rCabor] = await Promise.all([
        api.get('/admin/atlet'),
        api.get('/admin/cabor'),
      ])
      setAtlet(rAtlet.data.data)
      setCabor(rCabor.data.data.filter(c => c.status === 'aktif'))
    } catch (err) {
      alert('Gagal memuat data: ' + (err.response?.data?.message || err.message))
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const displayed = atlet
    .filter(a => a.nama.toLowerCase().includes(query.toLowerCase()) ||
                 (a.nik || '').includes(query))
    .filter(a => filterJK === 'semua' ? true : a.jenis_kelamin === filterJK)

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function bukaModalTambah() {
    setForm(emptyForm); setTarget(null); setModal('form')
  }
  function bukaModalEdit(item) {
    setForm({ ...emptyForm, ...item, username: '', password: '' })
    setTarget(item); setModal('form')
  }
  function tutup() { setModal(false); setTarget(null) }

  async function handleSubmit() {
    if (!form.nama || !form.cabor_id)
      return alert('Nama dan Cabor wajib diisi.')
    setSaving(true)
    try {
      if (target) {
        // [PRESENTASI: ORANG 3] Edit -> PUT request
        await api.put(`/admin/atlet/${target.id}`, form)
        // [PRESENTASI: ORANG 3] Kalau ada username baru -> buat akun login otomatis
        if (form.username && form.password) {
          await api.post('/admin/create-account', {
            ref_id: target.id, role: 'atlet',
            username: form.username, password: form.password,
          })
        }
      } else {
        // [PRESENTASI: ORANG 3] Tambah -> POST request (username & password otomatis buat akun)
        await api.post('/admin/atlet', form)
      }
      tutup(); load() // [PRESENTASI: ORANG 3] Refresh data setelah operasi selesai
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan.')
    }
    setSaving(false)
  }

  async function handleHapus() {
    try {
      await api.delete(`/admin/atlet/${target.id}`)
      tutup(); load()
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SearchBar value={query} onChange={setQuery} placeholder="Cari nama / NIK..." />
          <select value={filterJK} onChange={e => setFilterJK(e.target.value)} className="input-field w-auto">
            <option value="semua">Semua JK</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <button onClick={bukaModalTambah} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Atlet
        </button>
      </div>

      <p className="text-xs text-gray-400">
        {loading ? 'Memuat...' : `Menampilkan ${displayed.length} dari ${atlet.length} atlet`}
      </p>

      <div className="card table-wrapper">
        <table className="tbl">
          <thead>
            <tr><th>#</th><th>Nama</th><th>JK</th><th>Tgl. Lahir</th><th>Umur</th><th>Cabor</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">Memuat data...</td></tr>
            ) : displayed.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">Tidak ada data</td></tr>
            ) : displayed.map((a, i) => (
              <tr key={a.id}>
                <td className="text-gray-400">{i + 1}</td>
                <td>
                  <div className="font-medium text-gray-800">{a.nama}</div>
                  <div className="text-xs text-gray-400">{a.nik || '-'}</div>
                </td>
                <td><Badge type="jk" value={a.jenis_kelamin} /></td>
                <td>{formatTanggal(a.tanggal_lahir)}</td>
                <td>{hitungUmur(a.tanggal_lahir)} th</td>
                <td>{a.cabor_nama || '-'}</td>
                <td><Badge type="status" value={a.status} /></td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => bukaModalEdit(a)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => { setTarget(a); setModal('hapus') }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <Modal isOpen={modal === 'form'} onClose={tutup}
        title={target ? 'Edit Atlet' : 'Tambah Atlet'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label-field">Nama Lengkap *</label>
            <input className="input-field" value={form.nama}
              onChange={e => setField('nama', e.target.value)} placeholder="Nama lengkap atlet" />
          </div>
          <div>
            <label className="label-field">NIK</label>
            <input className="input-field" value={form.nik} maxLength={16}
              onChange={e => setField('nik', e.target.value)} placeholder="16 digit NIK" />
          </div>
          <div>
            <label className="label-field">No. HP</label>
            <input className="input-field" value={form.no_hp}
              onChange={e => setField('no_hp', e.target.value)} placeholder="08xx..." />
          </div>
          <div>
            <label className="label-field">Tempat Lahir</label>
            <input className="input-field" value={form.tempat_lahir}
              onChange={e => setField('tempat_lahir', e.target.value)} />
          </div>
          <div>
            <label className="label-field">Tanggal Lahir</label>
            <input type="date" className="input-field" value={form.tanggal_lahir}
              max={todayStr()} onChange={e => setField('tanggal_lahir', e.target.value)} />
          </div>
          <div>
            <label className="label-field">Jenis Kelamin</label>
            <select className="input-field" value={form.jenis_kelamin}
              onChange={e => setField('jenis_kelamin', e.target.value)}>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="label-field">Cabang Olahraga *</label>
            <select className="input-field" value={form.cabor_id}
              onChange={e => setField('cabor_id', e.target.value)}>
              <option value="">-- Pilih Cabor --</option>
              {cabor.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="label-field">Alamat</label>
            <textarea className="input-field resize-none" rows={2} value={form.alamat}
              onChange={e => setField('alamat', e.target.value)} />
          </div>
          <div>
            <label className="label-field">Status</label>
            <select className="input-field" value={form.status}
              onChange={e => setField('status', e.target.value)}>
              <option value="aktif">Aktif</option>
              <option value="tidak_aktif">Tidak Aktif</option>
            </select>
          </div>

          {/* Akun Login */}
          <div className="col-span-2 mt-2 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Akun Login Atlet {target ? '(kosongkan jika tidak ingin ubah)' : '(opsional)'}
            </p>
          </div>
          <div>
            <label className="label-field">Username</label>
            <input className="input-field" value={form.username}
              onChange={e => setField('username', e.target.value)} placeholder="Username untuk login" />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input type="password" className="input-field" value={form.password}
              onChange={e => setField('password', e.target.value)} placeholder="Min. 6 karakter" />
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
      <Modal isOpen={modal === 'hapus'} onClose={tutup} title="Hapus Atlet" size="sm">
        <p className="text-sm text-gray-600">
          Yakin hapus atlet <span className="font-semibold">{target?.nama}</span>?
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={tutup} className="btn-secondary">Batal</button>
          <button onClick={handleHapus} className="btn-danger">Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
