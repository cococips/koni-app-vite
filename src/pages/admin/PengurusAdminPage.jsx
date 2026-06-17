import { useState, useEffect } from 'react'
import api from '../../api/axios'
import Modal from '../../components/common/Modal'

const LEVEL_LABEL = {
  1: 'Level 1 — Ketua Umum',
  2: 'Level 2 — Wakil Ketua',
  3: 'Level 3 — Sekretaris / Bendahara',
  4: 'Level 4 — Kabid / Setara',
}

const empty = { nama: '', jabatan: '', periode: '2022-2026', level: 2, parent_id: '', order_num: 99, quotes: '' }

export default function PengurusAdminPage() {
  const [pengurus, setPengurus] = useState([])
  const [modal, setModal]   = useState(false)
  const [target, setTarget] = useState(null)
  const [form, setForm]     = useState(empty)
  const [fileFoto, setFileFoto] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    fetchPengurus()
  }, [])

  async function fetchPengurus() {
    try {
      const { data } = await api.get('/admin/pengurus')
      if (data.success) setPengurus(data.data)
    } catch (err) {
      console.error('Gagal fetch pengurus:', err)
    }
  }

  function buka(item = null) {
    setForm(item ? { ...empty, ...item, level: item.level ?? 2, order_num: item.order_num ?? 99 } : empty)
    setTarget(item)
    setFileFoto(null)
    setModal('form')
  }

  function tutup() { setModal(false); setTarget(null) }

  async function submit() {
    if (!form.nama || !form.jabatan) return alert('Nama dan jabatan wajib diisi.')
    
    const formData = new FormData()
    formData.append('nama', form.nama)
    formData.append('jabatan', form.jabatan)
    formData.append('periode', form.periode)
    formData.append('level', form.level)
    if (form.parent_id) formData.append('parent_id', form.parent_id)
    formData.append('order_num', form.order_num)
    if (form.quotes) formData.append('quotes', form.quotes)
    if (fileFoto) formData.append('foto', fileFoto)

    try {
      if (target) {
        await api.put('/admin/pengurus/' + target.id, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/admin/pengurus', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      fetchPengurus()
      tutup()
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan data pengurus.')
    }
  }

  async function hapus() {
    try {
      await api.delete('/admin/pengurus/' + target.id)
      fetchPengurus()
      tutup()
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus pengurus.')
    }
  }

  // Sorted by level then order_num for display
  const sorted = [...pengurus].sort((a, b) => (a.level - b.level) || (a.order_num - b.order_num))

  // Parent options — semua level di atas level form
  const parentOptions = pengurus.filter(p => p.level < Number(form.level))

  const levelColor = {
    1: 'bg-red-100 text-red-700',
    2: 'bg-blue-100 text-blue-700',
    3: 'bg-purple-100 text-purple-700',
    4: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="space-y-4">
      {/* Info bagan */}
      <div className="card p-4 bg-blue-50 border border-blue-100 text-sm text-blue-800">
        Data pengurus ditampilkan sebagai <strong>bagan organisasi</strong> di halaman publik.
        Atur <strong>Level</strong> dan <strong>Atasan</strong> untuk menentukan posisi dalam bagan. <strong>Ketua Umum</strong> dapat diberikan Quote yang akan tampil di halaman depan.
      </div>

      <div className="flex justify-end">
        <button onClick={() => buka()} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Pengurus
        </button>
      </div>

      <div className="card table-wrapper">
        <table className="tbl">
          <thead>
            <tr><th>Foto</th><th>Level</th><th>Nama</th><th>Jabatan</th><th>Atasan</th><th>Urutan</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Belum ada pengurus</td></tr>
            ) : sorted.map(p => {
              const parent = pengurus.find(x => x.id === p.parent_id)
              return (
                <tr key={p.id}>
                  <td>
                    {p.foto_url ? (
                      <img src={p.foto_url} alt={p.nama} className="w-10 h-10 rounded-full object-cover border" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">No Img</div>
                    )}
                  </td>
                  <td>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColor[p.level] || 'bg-gray-100 text-gray-600'}`}>
                      L{p.level}
                    </span>
                  </td>
                  <td className="font-medium text-gray-800">{p.nama}</td>
                  <td className="text-xs text-gray-600">{p.jabatan}</td>
                  <td className="text-xs text-gray-500">{parent?.jabatan || <span className="text-gray-300">—</span>}</td>
                  <td className="text-center text-xs text-gray-400 font-mono">{p.order_num}</td>
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
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <Modal isOpen={modal === 'form'} onClose={tutup}
        title={target ? 'Edit Pengurus' : 'Tambah Pengurus'} size="md">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="label-field">Foto Profil</label>
            <input type="file" className="input-field text-sm" accept="image/*"
              onChange={e => setFileFoto(e.target.files[0])} />
            {target?.foto_url && !fileFoto && (
              <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah foto saat ini.</p>
            )}
          </div>
          <div>
            <label className="label-field">Nama Lengkap *</label>
            <input className="input-field" value={form.nama}
              onChange={e => set('nama', e.target.value)} placeholder="Termasuk gelar jika ada" />
          </div>
          <div>
            <label className="label-field">Jabatan *</label>
            <input className="input-field" value={form.jabatan}
              onChange={e => set('jabatan', e.target.value)} placeholder="Contoh: Ketua Umum" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Level dalam Bagan</label>
              <select className="input-field" value={form.level}
                onChange={e => set('level', Number(e.target.value))}>
                {Object.entries(LEVEL_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Urutan Tampil</label>
              <input type="number" className="input-field" value={form.order_num}
                min={0} onChange={e => set('order_num', Number(e.target.value))} />
            </div>
          </div>
          {Number(form.level) > 1 && (
            <div>
              <label className="label-field">Atasan / Parent</label>
              <select className="input-field" value={form.parent_id || ''}
                onChange={e => set('parent_id', e.target.value)}>
                <option value="">— Tidak ada / langsung di bawah Ketua —</option>
                {parentOptions.map(p => (
                  <option key={p.id} value={p.id}>{p.jabatan} — {p.nama}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="label-field">Periode</label>
            <input className="input-field" value={form.periode}
              onChange={e => set('periode', e.target.value)} placeholder="Contoh: 2022-2026" />
          </div>
          <div>
            <label className="label-field">Quotes (Khusus Ketua Umum)</label>
            <textarea className="input-field min-h-[80px]" value={form.quotes || ''}
              onChange={e => set('quotes', e.target.value)} placeholder="Tulis quote untuk ditampilkan di landing page..." />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={tutup} className="btn-secondary">Batal</button>
          <button onClick={submit} className="btn-primary">{target ? 'Perbarui' : 'Simpan'}</button>
        </div>
      </Modal>

      {/* Modal Hapus */}
      <Modal isOpen={modal === 'hapus'} onClose={tutup} title="Hapus Pengurus" size="sm">
        <p className="text-sm text-gray-600">
          Yakin hapus <span className="font-semibold">{target?.nama}</span> dari daftar pengurus?
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={tutup} className="btn-secondary">Batal</button>
          <button onClick={hapus} className="btn-danger">Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
