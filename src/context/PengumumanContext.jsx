import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, todayStr } from '../utils/helpers'
import seedData from '../data/pengumuman.json'

const PengumumanContext = createContext(null)

export function PengumumanProvider({ children }) {
  const [pengumuman, setPengumuman] = useLocalStorage('koni_pengumuman', seedData)

  function tambah(data)        { setPengumuman(prev => [...prev, { ...data, id: generateId('pngm'), published: false, created_at: todayStr() }]) }
  function edit(id, data)      { setPengumuman(prev => prev.map(i => i.id === id ? { ...i, ...data } : i)) }
  function hapus(id)           { setPengumuman(prev => prev.filter(i => i.id !== id)) }
  function togglePublish(id)   { setPengumuman(prev => prev.map(i => i.id === id ? { ...i, published: !i.published } : i)) }

  const published = pengumuman.filter(p => p.published)

  return (
    <PengumumanContext.Provider value={{ pengumuman, published, tambah, edit, hapus, togglePublish }}>
      {children}
    </PengumumanContext.Provider>
  )
}

export function usePengumuman() {
  const ctx = useContext(PengumumanContext)
  if (!ctx) throw new Error('usePengumuman harus dipakai di dalam PengumumanProvider')
  return ctx
}
