import { useState } from 'react'
import { usePrestasi } from '../context/PrestasiContext'
import { useAtlet }    from '../context/AtletContext'
import { useCabor }    from '../context/CaborContext'
import { filterData, LABEL_GRADE, LABEL_MEDALI } from '../utils/helpers'
import Modal     from '../components/common/Modal'
import Badge     from '../components/common/Badge'
import SearchBar from '../components/common/SearchBar'

const currentYear = new Date().getFullYear()

const emptyForm = {
  atlet_id: '', cabor_id: '', nama_kejuaraan: '',
  nomor_lomba: '', grade: 'daerah', tahun: currentYear,
  hasil: '', medali: 'emas', penyelenggara: '', lokasi: '',
}

export default function PrestasiPage() {
  const { prestasi, tambahPrestasi, editPrestasi, hapusPrestasi } = usePrestasi()
  const { atlet, getAtletById } = useAtlet()
  const { getCaborById } = useCabor()

  const [query,  setQuery]  = useState('')
  const [modal,  setModal]  = useState(false)
  const [target, setTarget] = useState(null)
  const [form,   setForm]   = useState(emptyForm)
  const [filterGrade,  setFilterGrade]  = useState('semua')
  const [filterMedali, setFilterMedali] = useState('semua')

  const displayed = filterData(prestasi, query, ['nama_kejuaraan', 'nomor_lomba', 'lokasi'])
    .filter(p => filterGrade  === 'semua' ? true : p.grade  === filterGrade)
    .filter(p => filterMedali === 'semua' ? true : p.medali === filterMedali)

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))

  function bukaModalTambah() { setForm(emptyForm); setTarget(null); setModal('tambah') }
  function bukaModalEdit(item) { setForm({ ...item }); setTarget(item); setModal('edit') }
  function tutupModal() { setModal(false); setTarget(null) }

  // Saat atlet dipilih, auto-isi cabor_id
  function handlePilihAtlet(atletId) {
    const a = getAtletById(atletId)
    setField('atlet_id', atletId)
    if (a) setForm(f => ({ ...f, atlet_id: atletId, cabor_id: a.cabor_id }))
  }

  function handleSubmit() {
    if (!form.atlet_id || !form.nama_kejuaraan || !form.nomor_lomba) {
      alert('Atlet, Nama Kejuaraan, dan Nomor Lomba wajib diisi.')
      return
    }
    if (modal === 'tambah') tambahPrestasi(form)
    if (modal === 'edit')   editPrestasi(target.id, form)
    tutupModal()
  }

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <SearchBar value={query} onChange={setQuery} placeholder="Cari kejuaraan..." />
          <select value={filterGrade}  onChange={e => setFilterGrade(e.target.value)}  className="input-field w-auto">
            <option value="semua">Semua Grade</option>
            {Object.entries(LABEL_GRADE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={filterMedali} onChange={e => setFilterMedali(e.target.value)} className="input-field w-auto">
            <option value="semua">Semua Medali</option>
            <option value="emas">Emas</option>
            <option value="perak">Perak</option>
            <option value="perunggu">Perunggu</option>
          </select>
        </div>
        <button onClick={bukaModalTambah} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Prestasi
        </button>
      </div>

      <p className="text-xs text-gray-400">Menampilkan {displayed.length} dari {prestasi.length} data prestasi</p>

      {/* Tabel */}
      <div className="card table-wrapper">
        <table className="tbl">
          <thead>
            <tr>
              <th>#</th>
              <th>Atlet</th>
              <th>Kejuaraan</th>
              <th>Nomor Lomba</th>
              <th>Hasil</th>
              <th>Medali</th>
              <th>Grade</th>
              <th>Tahun</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-12 text-gray-400">Tidak ada data</td></tr>
            ) : displayed.map((p, i) => {
              const atletData = getAtletById(p.atlet_id)
              return (
                <tr key={p.id}>
                  <td className="text-gray-400">{i + 1}</td>
                  <td>
                    <div className="font-medium text-gray-800">{atletData?.nama ?? '-'}</div>
                    <div className="text-xs text-gray-400">{getCaborById(p.cabor_id)?.nama ?? '-'}</div>
                  </td>
                  <td>
                    <div className="max-w-xs truncate text-gray-700">{p.nama_kejuaraan}</div>
                    <div className="text-xs text-gray-400">{p.lokasi}</div>
                  </td>
                  <td className="text-gray-600">{p.nomor_lomba}</td>
                  <td className="font-medium text-gray-700">{p.hasil}</td>
                  <td><Badge type="medali" value={p.medali} /></td>
                  <td><Badge type="grade"  value={p.grade} /></td>
                  <td>{p.tahun}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => bukaModalEdit(p)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => { setTarget(p); setModal('hapus') }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah / Edit */}
      <Modal isOpen={modal === 'tambah' || modal === 'edit'} onClose={tutupModal}
        title={modal === 'tambah' ? 'Tambah Prestasi' : 'Edit Prestasi'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label-field">Atlet *</label>
            <select className="input-field" value={form.atlet_id} onChange={e => handlePilihAtlet(e.target.value)}>
              <option value="">-- Pilih Atlet --</option>
              {atlet.filter(a => a.status === 'aktif').map(a => (
                <option key={a.id} value={a.id}>{a.nama}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="label-field">Nama Kejuaraan *</label>
            <input className="input-field" value={form.nama_kejuaraan}
              onChange={e => setField('nama_kejuaraan', e.target.value)}
              placeholder="Contoh: Kejuaraan Atletik Jawa Tengah 2024" />
          </div>
          <div>
            <label className="label-field">Nomor Lomba *</label>
            <input className="input-field" value={form.nomor_lomba}
              onChange={e => setField('nomor_lomba', e.target.value)}
              placeholder="Contoh: Lari 100m Putra" />
          </div>
          <div>
            <label className="label-field">Hasil</label>
            <input className="input-field" value={form.hasil}
              onChange={e => setField('hasil', e.target.value)} placeholder="Contoh: Juara 1" />
          </div>
          <div>
            <label className="label-field">Medali</label>
            <select className="input-field" value={form.medali} onChange={e => setField('medali', e.target.value)}>
              <option value="emas">Emas</option>
              <option value="perak">Perak</option>
              <option value="perunggu">Perunggu</option>
            </select>
          </div>
          <div>
            <label className="label-field">Grade</label>
            <select className="input-field" value={form.grade} onChange={e => setField('grade', e.target.value)}>
              {Object.entries(LABEL_GRADE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Tahun</label>
            <input type="number" className="input-field" value={form.tahun}
              min={2000} max={currentYear}
              onChange={e => setField('tahun', parseInt(e.target.value))} />
          </div>
          <div>
            <label className="label-field">Lokasi</label>
            <input className="input-field" value={form.lokasi}
              onChange={e => setField('lokasi', e.target.value)} placeholder="Kota penyelenggaraan" />
          </div>
          <div className="col-span-2">
            <label className="label-field">Penyelenggara</label>
            <input className="input-field" value={form.penyelenggara}
              onChange={e => setField('penyelenggara', e.target.value)}
              placeholder="Contoh: PASI Jawa Tengah" />
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
      <Modal isOpen={modal === 'hapus'} onClose={tutupModal} title="Hapus Prestasi" size="sm">
        <p className="text-sm text-gray-600">
          Yakin hapus data prestasi <span className="font-semibold">{target?.nama_kejuaraan}</span>?
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={tutupModal} className="btn-secondary">Batal</button>
          <button onClick={() => { hapusPrestasi(target.id); tutupModal() }} className="btn-danger">Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
