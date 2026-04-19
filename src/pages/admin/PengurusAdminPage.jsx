import { useState } from 'react'
import { usePengurus } from '../../context/PengurusContext'
import Modal from '../../components/common/Modal'

const LEVEL_LABEL = {
  1: 'Level 1 — Ketua Umum',
  2: 'Level 2 — Wakil Ketua',
  3: 'Level 3 — Sekretaris / Bendahara',
  4: 'Level 4 — Kabid / Setara',
}

const empty = { nama: '', jabatan: '', periode: '2022-2026', level: 2, parent_id: '', urutan: 99 }

export default function PengurusAdminPage() {
  const { pengurus, tambah, edit, hapus, togglePublish } = usePengurus()
  const [modal, setModal]   = useState(false)
  const [target, setTarget] = useState(null)
  const [form, setForm]     = useState(empty)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function buka(item = null) {
    setForm(item ? { ...empty, ...item, level: item.level ?? 2 } : empty)
    setTarget(item)
    setModal('form')
  }
  function tutup() { setModal(false); setTarget(null) }
  function submit() {
    if (!form.nama || !form.jabatan) return alert('Nama dan jabatan wajib diisi.')
    const payload = {
      ...form,
      level: Number(form.level),
      urutan: Number(form.urutan),
      parent_id: form.parent_id || null,
    }
    if (target) edit(target.id, payload); else tambah(payload)
    tutup()
  }

  // Sorted by level then urutan for display
  const sorted = [...pengurus].sort((a, b) => (a.level - b.level) || (a.urutan - b.urutan))

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
        Atur <strong>Level</strong> dan <strong>Atasan</strong> untuk menentukan posisi dalam bagan.
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
            <tr><th>Level</th><th>Nama</th><th>Jabatan</th><th>Atasan</th><th>Urutan</th><th>Tampil</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Belum ada pengurus</td></tr>
            ) : sorted.map(p => {
              const parent = pengurus.find(x => x.id === p.parent_id)
              return (
                <tr key={p.id}>
                  <td>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColor[p.level] || 'bg-gray-100 text-gray-600'}`}>
                      L{p.level}
                    </span>
                  </td>
                  <td className="font-medium text-gray-800">{p.nama}</td>
                  <td className="text-xs text-gray-600">{p.jabatan}</td>
                  <td className="text-xs text-gray-500">{parent?.jabatan || <span className="text-gray-300">—</span>}</td>
                  <td className="text-center text-xs text-gray-400 font-mono">{p.urutan}</td>
                  <td>
                    <button onClick={() => togglePublish(p.id)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${p.published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.published ? 'Tampil' : 'Sembunyikan'}
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
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <Modal isOpen={modal === 'form'} onClose={tutup}
        title={target ? 'Edit Pengurus' : 'Tambah Pengurus'} size="md">
        <div className="space-y-4">
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
              <input type="number" className="input-field" value={form.urutan}
                min={1} onChange={e => set('urutan', e.target.value)} />
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
          <button onClick={() => { hapus(target.id); tutup() }} className="btn-danger">Hapus</button>
        </div>
      </Modal>
    </div>
  )
}
