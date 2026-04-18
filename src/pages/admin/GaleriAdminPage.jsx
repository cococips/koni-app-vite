import { useState } from 'react'
import { useGaleri } from '../../context/GaleriContext'
import Modal from '../../components/common/Modal'

const empty = { judul: '', deskripsi: '', url_foto: '', kategori: 'Kejuaraan' }
const kategoriList = ['Kejuaraan', 'Latihan', 'Program', 'Lainnya']

export default function GaleriAdminPage() {
  const { galeri, tambah, edit, hapus, togglePublish } = useGaleri()
  const [modal, setModal]   = useState(false)
  const [target, setTarget] = useState(null)
  const [form, setForm]     = useState(empty)
  const set = (k,v) => setForm(f => ({...f, [k]: v}))
  function buka(item=null) { setForm(item ? {...item} : empty); setTarget(item); setModal('form') }
  function tutup() { setModal(false); setTarget(null) }
  function submit() {
    if (!form.judul) return alert('Judul wajib diisi.')
    if (target) edit(target.id, form); else tambah(form)
    tutup()
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{galeri.length} foto · {galeri.filter(g=>g.published).length} ditampilkan</p>
        <button onClick={() => buka()} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>Tambah Foto</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galeri.map(g => (
          <div key={g.id} className="card overflow-hidden group">
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              {g.url_foto ? (
                <img src={g.url_foto} alt={g.judul} className="w-full h-full object-cover"/>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <button onClick={() => togglePublish(g.id)} className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${g.published ? 'bg-emerald-500 text-white' : 'bg-black/40 text-white'}`}>
                  {g.published ? 'Tampil' : 'Draft'}
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-800 truncate">{g.judul}</p>
              <p className="text-xs text-gray-400 mt-0.5">{g.kategori}</p>
              <div className="flex gap-1 mt-2">
                <button onClick={() => buka(g)} className="flex-1 text-xs py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">Edit</button>
                <button onClick={() => { setTarget(g); setModal('hapus') }} className="flex-1 text-xs py-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors">Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={modal==='form'} onClose={tutup} title={target?'Edit Foto':'Tambah Foto'}>
        <div className="space-y-4">
          <div><label className="label-field">Judul *</label><input className="input-field" value={form.judul} onChange={e=>set('judul',e.target.value)}/></div>
          <div><label className="label-field">Kategori</label><select className="input-field" value={form.kategori} onChange={e=>set('kategori',e.target.value)}>{kategoriList.map(k=><option key={k} value={k}>{k}</option>)}</select></div>
          <div><label className="label-field">URL Foto</label><input className="input-field" value={form.url_foto} onChange={e=>set('url_foto',e.target.value)} placeholder="https://... (untuk UTS, pakai link gambar)"/></div>
          {form.url_foto && <img src={form.url_foto} alt="preview" className="w-full h-40 object-cover rounded-lg" onError={e => e.target.style.display='none'}/>}
          <div><label className="label-field">Deskripsi</label><textarea className="input-field resize-none" rows={2} value={form.deskripsi} onChange={e=>set('deskripsi',e.target.value)}/></div>
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100"><button onClick={tutup} className="btn-secondary">Batal</button><button onClick={submit} className="btn-primary">{target?'Perbarui':'Simpan'}</button></div>
      </Modal>
      <Modal isOpen={modal==='hapus'} onClose={tutup} title="Hapus Foto" size="sm">
        <p className="text-sm text-gray-600">Yakin hapus foto <span className="font-semibold">"{target?.judul}"</span>?</p>
        <div className="flex justify-end gap-2 mt-6"><button onClick={tutup} className="btn-secondary">Batal</button><button onClick={()=>{hapus(target.id);tutup()}} className="btn-danger">Hapus</button></div>
      </Modal>
    </div>
  )
}
