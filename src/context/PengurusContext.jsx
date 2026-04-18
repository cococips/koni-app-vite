import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, todayStr } from '../utils/helpers'
import seedData from '../data/pengurus.json'

const PengurusContext = createContext(null)

export function PengurusProvider({ children }) {
  const [pengurus, setPengurus] = useLocalStorage('koni_pengurus', seedData)

  function tambah(data)        { setPengurus(prev => [...prev, { ...data, id: generateId('pngs'), published: true, created_at: todayStr() }]) }
  function edit(id, data)      { setPengurus(prev => prev.map(i => i.id === id ? { ...i, ...data } : i)) }
  function hapus(id)           { setPengurus(prev => prev.filter(i => i.id !== id)) }
  function togglePublish(id)   { setPengurus(prev => prev.map(i => i.id === id ? { ...i, published: !i.published } : i)) }

  const published = [...pengurus].filter(p => p.published).sort((a,b) => a.urutan - b.urutan)

  return (
    <PengurusContext.Provider value={{ pengurus, published, tambah, edit, hapus, togglePublish }}>
      {children}
    </PengurusContext.Provider>
  )
}

export function usePengurus() {
  const ctx = useContext(PengurusContext)
  if (!ctx) throw new Error('usePengurus harus dipakai di dalam PengurusProvider')
  return ctx
}
