import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, todayStr } from '../utils/helpers'
import seedData from '../data/berita.json'

const BeritaContext = createContext(null)

export function BeritaProvider({ children }) {
  const [berita, setBerita] = useLocalStorage('koni_berita', seedData)

  function tambahBerita(data)  { setBerita(prev => [...prev, { ...data, id: generateId('brt'), penulis: 'Admin KONI', published: false, created_at: todayStr() }]) }
  function editBerita(id, data) { setBerita(prev => prev.map(i => i.id === id ? { ...i, ...data } : i)) }
  function hapusBerita(id)     { setBerita(prev => prev.filter(i => i.id !== id)) }
  function togglePublish(id)   { setBerita(prev => prev.map(i => i.id === id ? { ...i, published: !i.published } : i)) }

  const beritaPublished = berita.filter(b => b.published)

  return (
    <BeritaContext.Provider value={{ berita, beritaPublished, tambahBerita, editBerita, hapusBerita, togglePublish }}>
      {children}
    </BeritaContext.Provider>
  )
}

export function useBerita() {
  const ctx = useContext(BeritaContext)
  if (!ctx) throw new Error('useBerita harus dipakai di dalam BeritaProvider')
  return ctx
}
