import { useState } from 'react'
import { useKegiatan } from '../../context/KegiatanContext'
import Modal from '../../components/common/Modal'
import QuillEditor from '../../components/common/QuillEditor'

const empty = {
  nama: '', deskripsi_html: '', tanggal_mulai: '',
  tanggal_selesai: '', lokasi: '', status: 'upcoming'
}

export default function KegiatanAdminPage() {
  const { kegiatan, tambah, edit, hapus, togglePublish } = useKegiatan()
  const [modal, setModal]   = useState(false)
  const [target, setTarget] = useState(null)
  const [form, setForm]     = useState(empty)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function buka(item = null) {
    setForm(item ? { ...empty, ...item } : empty)
    setTarget(item)
    setModal('form')
  }
  function tutup() { setModal(false); setTarget(null) }
  function submit() {
    if (!form.nama || !form.tanggal_mulai) return alert('Nama dan tanggal mulai wajib diisi.')
    if (target) edit(target.id, form); else tambah(form)
    tutup()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => buka()} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kegiatan
        </button>
      </div>

      <div className="card table-wrapper">
        <table className="tbl">
          <thead>
            <tr><th>#</th><th>Nama Kegiatan</th><th>Tanggal</th><th>Lokasi</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {kegiatan.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">Belum ada kegiatan</td></tr>
            ) : kegiatan.map((k, i) => (
              <tr key={k.id}>
                <td className="text-gray-400">{i + 1}</td>
                <td>
                  <div className="font-medium text-gray-800">{k.nama}</div>
                  {k.deskripsi_html && <div className="text-xs text-gray-400 mt-0.5">Deskripsi rich text tersedia</div>}
                </td>
                <td className="text-xs text-gray-600">{k.tanggal_mulai}</td>
                <td className="text-xs text-gray-600">{k.lokasi}</td>
                <td>
                  <button onClick={() => togglePublish(k.id)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${k.published ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {k.published ? '✓ Published' : 'Draft'}
                  </button>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => buka(k)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button onClick={() => { setTarget(k); setModal('hapus') }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
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
        title={target ? 'Edit Kegiatan' : 'Tambah Kegiatan'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="label-field">Nama Kegiatan *</label>
            <input className="input-field" value={form.nama}
              onChange={e => set('nama', e.target.value)} placeholder="Nama event / kegiatan" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Tanggal Mulai *</label>
              <input type="date" className="input-field" value={form.tanggal_mulai}
                onChange={e => set('tanggal_mulai', e.target.value)} />
            </div>
            <div>
              <label className="label-field">Tanggal Selesai</label>
              <input type="date" className="input-field" value={form.tanggal_selesai}
                onChange={e => set('tanggal_selesai', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label-field">Lokasi</label>
            <input className="input-field" value={form.lokasi}
              onChange={e => set('lokasi', e.target.value)} placeholder="Nama venue / tempat" />
          </div>
          <div>
            <label className="label-field mb-2 block">Deskripsi Kegiatan (Rich Text)</label>
            <QuillEditor
              value={form.deskripsi_html || ''}
              onChange={v => set('deskripsi_html', v)}
              placeholder="Tulis deskripsi lengkap kegiatan..."
              height="250px"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={tutup} className="btn-secondary">Batal</button>
          <button onClick={submit} className="btn-primary">{target ? 'Perbarui' : 'Simpan'}</button>
        </div>
      </Modal>

      {/* Modal Hapus */}
      <Modal isOpen={modal === 'hapus'} onClose={tutup} title="Hapus Kegiatan" size="sm">
        <p className="text-sm text-gray-600">
          Yakin hapus kegiatan <span className="font-semibold">"{target?.nama}"</span>?
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={tutup} className="btn-secondary">Batal</button>
          <button onClick={() => { hapus(target.id); tutup() }} className="btn-danger">Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
