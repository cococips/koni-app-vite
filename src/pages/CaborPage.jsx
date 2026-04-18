import { useState } from 'react'
import { useCabor } from '../context/CaborContext'
import { filterData, todayStr } from '../utils/helpers'
import Modal     from '../components/common/Modal'
import Badge     from '../components/common/Badge'
import SearchBar from '../components/common/SearchBar'

const emptyForm = {
  nama: '', induk: '', singkatan: '', status: 'aktif',
}

export default function CaborPage() {
  const { cabor, tambahCabor, editCabor, hapusCabor, toggleStatusCabor } = useCabor()

  const [query,  setQuery]  = useState('')
  const [modal,  setModal]  = useState(false)
  const [target, setTarget] = useState(null)
  const [form,   setForm]   = useState(emptyForm)
  const [filterStatus, setFilterStatus] = useState('semua')

  const displayed = filterData(cabor, query, ['nama', 'induk', 'singkatan'])
    .filter(c => filterStatus === 'semua' ? true : c.status === filterStatus)

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))

  function bukaModalTambah() { setForm(emptyForm); setTarget(null); setModal('tambah') }
  function bukaModalEdit(item) { setForm({ ...item }); setTarget(item); setModal('edit') }
  function tutupModal() { setModal(false); setTarget(null) }

  function handleSubmit() {
    if (!form.nama || !form.induk) {
      alert('Nama dan Induk Organisasi wajib diisi.')
      return
    }
    if (modal === 'tambah') tambahCabor(form)
    if (modal === 'edit')   editCabor(target.id, form)
    tutupModal()
  }

  const totalAktif = cabor.filter(c => c.status === 'aktif').length

  return (
    <div className="space-y-4">

      {/* Ringkasan */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 border border-blue-100 bg-blue-50">
          <p className="text-xs text-blue-600 font-medium">Total Cabor</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{cabor.length}</p>
        </div>
        <div className="card p-4 border border-emerald-100 bg-emerald-50">
          <p className="text-xs text-emerald-600 font-medium">Aktif</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{totalAktif}</p>
        </div>
        <div className="card p-4 border border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 font-medium">Tidak Aktif</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">{cabor.length - totalAktif}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SearchBar value={query} onChange={setQuery} placeholder="Cari nama / induk..." />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field w-auto">
            <option value="semua">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="tidak_aktif">Tidak Aktif</option>
          </select>
        </div>
        <button onClick={bukaModalTambah} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Cabor
        </button>
      </div>

      {/* Tabel */}
      <div className="card table-wrapper">
        <table className="tbl">
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Cabor</th>
              <th>Singkatan</th>
              <th>Induk Organisasi</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">Tidak ada data</td></tr>
            ) : displayed.map((c, i) => (
              <tr key={c.id}>
                <td className="text-gray-400">{i + 1}</td>
                <td className="font-medium text-gray-800">{c.nama}</td>
                <td>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-mono">
                    {c.singkatan || '-'}
                  </span>
                </td>
                <td className="text-gray-600">{c.induk}</td>
                <td><Badge type="status" value={c.status} /></td>
                <td>
                  <div className="flex items-center gap-1">
                    {/* Toggle status */}
                    <button
                      onClick={() => toggleStatusCabor(c.id)}
                      title={c.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        c.status === 'aktif'
                          ? 'text-emerald-500 hover:bg-emerald-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button onClick={() => bukaModalEdit(c)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => { setTarget(c); setModal('hapus') }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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

      {/* Modal Tambah / Edit */}
      <Modal isOpen={modal === 'tambah' || modal === 'edit'} onClose={tutupModal}
        title={modal === 'tambah' ? 'Tambah Cabor' : 'Edit Cabor'}>
        <div className="space-y-4">
          <div>
            <label className="label-field">Nama Cabang Olahraga *</label>
            <input className="input-field" value={form.nama}
              onChange={e => setField('nama', e.target.value)} placeholder="Contoh: Bulutangkis" />
          </div>
          <div>
            <label className="label-field">Induk Organisasi *</label>
            <input className="input-field" value={form.induk}
              onChange={e => setField('induk', e.target.value)} placeholder="Contoh: PBSI" />
          </div>
          <div>
            <label className="label-field">Singkatan</label>
            <input className="input-field" value={form.singkatan} maxLength={5}
              onChange={e => setField('singkatan', e.target.value.toUpperCase())} placeholder="Maks 5 huruf" />
          </div>
          <div>
            <label className="label-field">Status</label>
            <select className="input-field" value={form.status}
              onChange={e => setField('status', e.target.value)}>
              <option value="aktif">Aktif</option>
              <option value="tidak_aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={tutupModal} className="btn-secondary">Batal</button>
          <button onClick={handleSubmit} className="btn-primary">
            {modal === 'tambah' ? 'Simpan' : 'Perbarui'}
          </button>
        </div>
      </Modal>

      {/* Modal Hapus */}
      <Modal isOpen={modal === 'hapus'} onClose={tutupModal} title="Hapus Cabor" size="sm">
        <p className="text-sm text-gray-600">
          Yakin hapus cabor <span className="font-semibold">{target?.nama}</span>?
          Pastikan tidak ada atlet atau pelatih yang terdaftar di cabor ini.
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={tutupModal} className="btn-secondary">Batal</button>
          <button onClick={() => { hapusCabor(target.id); tutupModal() }} className="btn-danger">Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
