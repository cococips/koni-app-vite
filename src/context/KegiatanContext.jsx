import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, todayStr } from '../utils/helpers'
import seedData from '../data/kegiatan.json'

const KegiatanContext = createContext(null)

export function KegiatanProvider({ children }) {
  const [kegiatan, setKegiatan] = useLocalStorage('koni_kegiatan', seedData)

  function tambah(data)        { setKegiatan(prev => [...prev, { ...data, id: generateId('kgt'), published: false, created_at: todayStr() }]) }
  function edit(id, data)      { setKegiatan(prev => prev.map(i => i.id === id ? { ...i, ...data } : i)) }
  function hapus(id)           { setKegiatan(prev => prev.filter(i => i.id !== id)) }
  function togglePublish(id)   { setKegiatan(prev => prev.map(i => i.id === id ? { ...i, published: !i.published } : i)) }

  const published = kegiatan.filter(k => k.published)

  return (
    <KegiatanContext.Provider value={{ kegiatan, published, tambah, edit, hapus, togglePublish }}>
      {children}
    </KegiatanContext.Provider>
  )
}

export function useKegiatan() {
  const ctx = useContext(KegiatanContext)
  if (!ctx) throw new Error('useKegiatan harus dipakai di dalam KegiatanProvider')
  return ctx
}
