import { useState } from 'react'
import { usePengurus } from '../../context/PengurusContext'
import Modal from '../../components/common/Modal'

const empty = { nama: '', jabatan: '', periode: '2022-2026', urutan: 99 }

export default function PengurusAdminPage() {
  const { pengurus, tambah, edit, hapus, togglePublish } = usePengurus()
  const [modal, setModal]   = useState(false)
  const [target, setTarget] = useState(null)
  const [form, setForm]     = useState(empty)
  const set = (k,v) => setForm(f => ({...f, [k]: v}))
  function buka(item=null) { setForm(item ? {...item} : empty); setTarget(item); setModal('form') }
  function tutup() { setModal(false); setTarget(null) }
  function submit() {
    if (!form.nama || !form.jabatan) return alert('Nama dan jabatan wajib diisi.')
    if (target) edit(target.id, form); else tambah(form)
    tutup()
  }
  const sorted = [...pengurus].sort((a,b) => a.urutan - b.urutan)
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><button onClick={() => buka()} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>Tambah Pengurus</button></div>
      <div className="card table-wrapper">
        <table className="tbl">
          <thead><tr><th>Urutan</th><th>Nama</th><th>Jabatan</th><th>Periode</th><th>Tampil</th><th>Aksi</th></tr></thead>
          <tbody>
            {sorted.map(p => (
              <tr key={p.id}>
                <td className="text-center text-gray-400 font-mono text-xs">{p.urutan}</td>
                <td className="font-medium text-gray-800">{p.nama}</td>
                <td className="text-gray-600 text-xs">{p.jabatan}</td>
                <td className="text-gray-500 text-xs">{p.periode}</td>
                <td><button onClick={() => togglePublish(p.id)} className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${p.published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{p.published ? 'Tampil' : 'Disembunyikan'}</button></td>
                <td><div className="flex gap-1">
                  <button onClick={() => buka(p)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                  <button onClick={() => { setTarget(p); setModal('hapus') }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modal==='form'} onClose={tutup} title={target?'Edit Pengurus':'Tambah Pengurus'}>
        <div className="space-y-4">
          <div><label className="label-field">Nama Lengkap *</label><input className="input-field" value={form.nama} onChange={e=>set('nama',e.target.value)} placeholder="Termasuk gelar jika ada"/></div>
          <div><label className="label-field">Jabatan *</label><input className="input-field" value={form.jabatan} onChange={e=>set('jabatan',e.target.value)} placeholder="Contoh: Ketua Umum"/></div>
          <div><label className="label-field">Periode</label><input className="input-field" value={form.periode} onChange={e=>set('periode',e.target.value)} placeholder="Contoh: 2022-2026"/></div>
          <div><label className="label-field">Urutan Tampil</label><input type="number" className="input-field" value={form.urutan} min={1} onChange={e=>set('urutan',parseInt(e.target.value))}/></div>
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100"><button onClick={tutup} className="btn-secondary">Batal</button><button onClick={submit} className="btn-primary">{target?'Perbarui':'Simpan'}</button></div>
      </Modal>
      <Modal isOpen={modal==='hapus'} onClose={tutup} title="Hapus Pengurus" size="sm">
        <p className="text-sm text-gray-600">Yakin hapus <span className="font-semibold">{target?.nama}</span>?</p>
        <div className="flex justify-end gap-2 mt-6"><button onClick={tutup} className="btn-secondary">Batal</button><button onClick={()=>{hapus(target.id);tutup()}} className="btn-danger">Hapus</button></div>
      </Modal>
    </div>
  )
}
