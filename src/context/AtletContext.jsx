import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, todayStr } from '../utils/helpers'
import seedData from '../data/atlet.json'

const AtletContext = createContext(null)

export function AtletProvider({ children }) {
  const [atlet, setAtlet] = useLocalStorage('koni_atlet', seedData)

  // ── CREATE ──────────────────────────────────────────────────────────────────
  function tambahAtlet(data) {
    const baru = {
      ...data,
      id: generateId('atl'),
      foto: null,
      created_at: todayStr(),
    }
    setAtlet(prev => [...prev, baru])
    return baru
  }

  // ── UPDATE ──────────────────────────────────────────────────────────────────
  function editAtlet(id, data) {
    setAtlet(prev =>
      prev.map(item => item.id === id ? { ...item, ...data } : item)
    )
  }

  // ── DELETE ──────────────────────────────────────────────────────────────────
  function hapusAtlet(id) {
    setAtlet(prev => prev.filter(item => item.id !== id))
  }

  // ── TOGGLE STATUS ────────────────────────────────────────────────────────────
  function toggleStatusAtlet(id) {
    setAtlet(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'aktif' ? 'tidak_aktif' : 'aktif' }
          : item
      )
    )
  }

  // ── HELPERS ──────────────────────────────────────────────────────────────────
  function getAtletById(id) {
    return atlet.find(item => item.id === id) ?? null
  }

  function getAtletByCabor(caborId) {
    return atlet.filter(item => item.cabor_id === caborId)
  }

  const atletAktif    = atlet.filter(a => a.status === 'aktif')
  const totalL        = atlet.filter(a => a.jenis_kelamin === 'L').length
  const totalP        = atlet.filter(a => a.jenis_kelamin === 'P').length

  return (
    <AtletContext.Provider value={{
      atlet,
      atletAktif,
      totalL,
      totalP,
      tambahAtlet,
      editAtlet,
      hapusAtlet,
      toggleStatusAtlet,
      getAtletById,
      getAtletByCabor,
    }}>
      {children}
    </AtletContext.Provider>
  )
}

export function useAtlet() {
  const ctx = useContext(AtletContext)
  if (!ctx) throw new Error('useAtlet harus dipakai di dalam AtletProvider')
  return ctx
}
