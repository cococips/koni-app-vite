import { useState } from 'react'
import { usePelatih } from '../context/PelatihContext'
import { useCabor }   from '../context/CaborContext'
import { filterData, formatTanggal, LABEL_KATEGORI, LABEL_GRADE, todayStr } from '../utils/helpers'
import Modal     from '../components/common/Modal'
import Badge     from '../components/common/Badge'
import SearchBar from '../components/common/SearchBar'

const emptyForm = {
  nik: '', nama: '', tempat_lahir: '', tanggal_lahir: '',
  jenis_kelamin: 'L', alamat: '', no_hp: '',
  cabor_id: '', kategori: 'teknik', grade: 'daerah', status: 'aktif',
}

export default function PelatihPage() {
  const { pelatih, tambahPelatih, editPelatih, hapusPelatih } = usePelatih()
  const { caborAktif, getCaborById } = useCabor()

  const [query,  setQuery]  = useState('')
  const [modal,  setModal]  = useState(false)
  const [target, setTarget] = useState(null)
  const [form,   setForm]   = useState(emptyForm)
  const [filterKat, setFilterKat] = useState('semua')

  const displayed = filterData(pelatih, query, ['nama', 'nik'])
    .filter(p => filterKat === 'semua' ? true : p.kategori === filterKat)

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))

  function bukaModalTambah() { setForm(emptyForm); setTarget(null); setModal('tambah') }
  function bukaModalEdit(item) { setForm({ ...item }); setTarget(item); setModal('edit') }
  function bukaModalHapus(item) { setTarget(item); setModal('hapus') }
  function tutupModal() { setModal(false); setTarget(null) }

  function handleSubmit() {
    if (!form.nama || !form.cabor_id) {
      alert('Nama dan Cabor wajib diisi.')
      return
    }
    if (modal === 'tambah') tambahPelatih(form)
    if (modal === 'edit')   editPelatih(target.id, form)
    tutupModal()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SearchBar value={query} onChange={setQuery} placeholder="Cari nama / NIK..." />
          <select value={filterKat} onChange={e => setFilterKat(e.target.value)} className="input-field w-auto">
            <option value="semua">Semua Kategori</option>
            {Object.entries(LABEL_KATEGORI).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <button onClick={bukaModalTambah} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Pelatih
        </button>
      </div>

      <p className="text-xs text-gray-400">Menampilkan {displayed.length} dari {pelatih.length} pelatih</p>

      <div className="card table-wrapper">
        <table className="tbl">
          <thead>
            <tr>
              <th>#</th>
              <th>Nama</th>
              <th>Cabor</th>
              <th>Kategori</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Tidak ada data</td></tr>
            ) : displayed.map((p, i) => (
              <tr key={p.id}>
                <td className="text-gray-400">{i + 1}</td>
                <td>
                  <div className="font-medium text-gray-800">{p.nama}</div>
                  <div className="text-xs text-gray-400">{formatTanggal(p.tanggal_lahir)}</div>
                </td>
                <td>{getCaborById(p.cabor_id)?.nama ?? '-'}</td>
                <td><Badge type="kategori" value={p.kategori} /></td>
                <td><Badge type="grade"    value={p.grade} /></td>
                <td><Badge type="status"   value={p.status} /></td>
                <td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => bukaModalEdit(p)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => bukaModalHapus(p)}
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

      <Modal isOpen={modal === 'tambah' || modal === 'edit'} onClose={tutupModal}
        title={modal === 'tambah' ? 'Tambah Pelatih' : 'Edit Pelatih'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label-field">Nama Lengkap *</label>
            <input className="input-field" value={form.nama}
              onChange={e => setField('nama', e.target.value)} placeholder="Nama + gelar (jika ada)" />
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
              {caborAktif.map(c => (
                <option key={c.id} value={c.id}>{c.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Kategori</label>
            <select className="input-field" value={form.kategori}
              onChange={e => setField('kategori', e.target.value)}>
              {Object.entries(LABEL_KATEGORI).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Grade</label>
            <select className="input-field" value={form.grade}
              onChange={e => setField('grade', e.target.value)}>
              {Object.entries(LABEL_GRADE).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Status</label>
            <select className="input-field" value={form.status}
              onChange={e => setField('status', e.target.value)}>
              <option value="aktif">Aktif</option>
              <option value="tidak_aktif">Tidak Aktif</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="label-field">Alamat</label>
            <textarea className="input-field resize-none" rows={2} value={form.alamat}
              onChange={e => setField('alamat', e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={tutupModal} className="btn-secondary">Batal</button>
          <button onClick={handleSubmit} className="btn-primary">
            {modal === 'tambah' ? 'Simpan' : 'Perbarui'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'hapus'} onClose={tutupModal} title="Hapus Pelatih" size="sm">
        <p className="text-sm text-gray-600">
          Yakin hapus pelatih <span className="font-semibold">{target?.nama}</span>?
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={tutupModal} className="btn-secondary">Batal</button>
          <button onClick={() => { hapusPelatih(target.id); tutupModal() }} className="btn-danger">Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
