import { useState } from 'react'
import { useBerita } from '../../context/BeritaContext'
import Modal from '../../components/common/Modal'
import SearchBar from '../../components/common/SearchBar'

const empty = { judul: '', ringkasan: '', isi: '', kategori: 'Prestasi', foto: null }
const kategoriList = ['Prestasi', 'Program', 'Organisasi', 'Umum']

export default function BeritaAdminPage() {
  const { berita, tambahBerita, editBerita, hapusBerita, togglePublish } = useBerita()
  const [query, setQuery]   = useState('')
  const [modal, setModal]   = useState(false)
  const [target, setTarget] = useState(null)
  const [form, setForm]     = useState(empty)
  const set = (k,v) => setForm(f => ({...f, [k]: v}))

  const displayed = berita.filter(b =>
    b.judul.toLowerCase().includes(query.toLowerCase()) ||
    b.kategori.toLowerCase().includes(query.toLowerCase())
  )

  function buka(item = null) { setForm(item ? {...item} : empty); setTarget(item); setModal('form') }
  function tutup() { setModal(false); setTarget(null) }
  function submit() {
    if (!form.judul || !form.ringkasan) return alert('Judul dan ringkasan wajib diisi.')
    if (target) editBerita(target.id, form); else tambahBerita(form)
    tutup()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Cari berita..." />
        <button onClick={() => buka()} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Tambah Berita
        </button>
      </div>

      <div className="card table-wrapper">
        <table className="tbl">
          <thead><tr><th>#</th><th>Judul</th><th>Kategori</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {displayed.map((b, i) => (
              <tr key={b.id}>
                <td className="text-gray-400">{i+1}</td>
                <td>
                  <div className="font-medium text-gray-800 max-w-xs truncate">{b.judul}</div>
                  <div className="text-xs text-gray-400 truncate max-w-xs">{b.ringkasan}</div>
                </td>
                <td><span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{b.kategori}</span></td>
                <td className="text-xs text-gray-500">{b.created_at}</td>
                <td>
                  <button onClick={() => togglePublish(b.id)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${b.published ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {b.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => buka(b)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button onClick={() => { setTarget(b); setModal('hapus') }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal === 'form'} onClose={tutup} title={target ? 'Edit Berita' : 'Tambah Berita'} size="lg">
        <div className="space-y-4">
          <div><label className="label-field">Judul *</label><input className="input-field" value={form.judul} onChange={e => set('judul', e.target.value)} placeholder="Judul berita"/></div>
          <div><label className="label-field">Kategori</label>
            <select className="input-field" value={form.kategori} onChange={e => set('kategori', e.target.value)}>
              {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div><label className="label-field">Ringkasan *</label><textarea className="input-field resize-none" rows={2} value={form.ringkasan} onChange={e => set('ringkasan', e.target.value)} placeholder="Ringkasan singkat berita"/></div>
          <div><label className="label-field">Isi Berita</label><textarea className="input-field resize-none" rows={5} value={form.isi} onChange={e => set('isi', e.target.value)} placeholder="Tulis isi berita lengkap..."/></div>
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={tutup} className="btn-secondary">Batal</button>
          <button onClick={submit} className="btn-primary">{target ? 'Perbarui' : 'Simpan'}</button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'hapus'} onClose={tutup} title="Hapus Berita" size="sm">
        <p className="text-sm text-gray-600">Yakin hapus berita <span className="font-semibold">"{target?.judul}"</span>?</p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={tutup} className="btn-secondary">Batal</button>
          <button onClick={() => { hapusBerita(target.id); tutup() }} className="btn-danger">Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
