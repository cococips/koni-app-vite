import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, todayStr } from '../utils/helpers'
import seedData from '../data/galeri.json'

const GaleriContext = createContext(null)

export function GaleriProvider({ children }) {
  const [galeri, setGaleri] = useLocalStorage('koni_galeri', seedData)

  function tambah(data)        { setGaleri(prev => [...prev, { ...data, id: generateId('glr'), published: false, created_at: todayStr() }]) }
  function edit(id, data)      { setGaleri(prev => prev.map(i => i.id === id ? { ...i, ...data } : i)) }
  function hapus(id)           { setGaleri(prev => prev.filter(i => i.id !== id)) }
  function togglePublish(id)   { setGaleri(prev => prev.map(i => i.id === id ? { ...i, published: !i.published } : i)) }

  const published = galeri.filter(g => g.published)

  return (
    <GaleriContext.Provider value={{ galeri, published, tambah, edit, hapus, togglePublish }}>
      {children}
    </GaleriContext.Provider>
  )
}

export function useGaleri() {
  const ctx = useContext(GaleriContext)
  if (!ctx) throw new Error('useGaleri harus dipakai di dalam GaleriProvider')
  return ctx
}
