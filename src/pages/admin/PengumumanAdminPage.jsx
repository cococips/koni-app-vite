import { useState } from 'react'
import { usePengumuman } from '../../context/PengumumanContext'
import Modal from '../../components/common/Modal'
import QuillEditor from '../../components/common/QuillEditor'

const empty = { judul: '', isi_html: '', tipe: 'info' }

export default function PengumumanAdminPage() {
  const { pengumuman, tambah, edit, hapus, togglePublish } = usePengumuman()
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
    if (!form.judul) return alert('Judul wajib diisi.')
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
          Tambah Pengumuman
        </button>
      </div>

      <div className="card table-wrapper">
        <table className="tbl">
          <thead>
            <tr><th>#</th><th>Judul</th><th>Tipe</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {pengumuman.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">Belum ada pengumuman</td></tr>
            ) : pengumuman.map((p, i) => (
              <tr key={p.id}>
                <td className="text-gray-400">{i + 1}</td>
                <td>
                  <div className="font-medium text-gray-800">{p.judul}</div>
                  {p.isi_html && (
                    <div className="text-xs text-gray-400 mt-0.5">Konten rich text tersedia</div>
                  )}
                </td>
                <td>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.tipe === 'penting' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {p.tipe === 'penting' ? '⚠ Penting' : 'ℹ Info'}
                  </span>
                </td>
                <td>
                  <button onClick={() => togglePublish(p.id)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${p.published ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {p.published ? '✓ Published' : 'Draft'}
                  </button>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => buka(p)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button onClick={() => { setTarget(p); setModal('hapus') }}
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
        title={target ? 'Edit Pengumuman' : 'Tambah Pengumuman'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="label-field">Judul Pengumuman *</label>
            <input className="input-field" value={form.judul}
              onChange={e => set('judul', e.target.value)} placeholder="Judul pengumuman" />
          </div>
          <div>
            <label className="label-field">Tipe</label>
            <select className="input-field" value={form.tipe} onChange={e => set('tipe', e.target.value)}>
              <option value="info">ℹ Informasi Umum</option>
              <option value="penting">⚠ Penting</option>
            </select>
          </div>
          <div>
            <label className="label-field mb-2 block">Isi Pengumuman (Rich Text)</label>
            <QuillEditor
              value={form.isi_html || ''}
              onChange={v => set('isi_html', v)}
              placeholder="Tulis isi pengumuman lengkap di sini..."
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
      <Modal isOpen={modal === 'hapus'} onClose={tutup} title="Hapus Pengumuman" size="sm">
        <p className="text-sm text-gray-600">
          Yakin hapus pengumuman <span className="font-semibold">"{target?.judul}"</span>?
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={tutup} className="btn-secondary">Batal</button>
          <button onClick={() => { hapus(target.id); tutup() }} className="btn-danger">Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
