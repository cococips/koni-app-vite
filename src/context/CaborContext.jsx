import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, todayStr } from '../utils/helpers'
import seedData from '../data/cabor.json'

const CaborContext = createContext(null)

export function CaborProvider({ children }) {
  // Inisialisasi: pakai seed JSON kalau localStorage masih kosong
  const [cabor, setCabor] = useLocalStorage('koni_cabor', seedData)

  // ── CREATE ──────────────────────────────────────────────────────────────────
  function tambahCabor(data) {
    const baru = {
      ...data,
      id: generateId('cabor'),
      created_at: todayStr(),
    }
    setCabor(prev => [...prev, baru])
    return baru
  }

  // ── UPDATE ──────────────────────────────────────────────────────────────────
  function editCabor(id, data) {
    setCabor(prev =>
      prev.map(item => item.id === id ? { ...item, ...data } : item)
    )
  }

  // ── DELETE ──────────────────────────────────────────────────────────────────
  function hapusCabor(id) {
    setCabor(prev => prev.filter(item => item.id !== id))
  }

  // ── TOGGLE STATUS ────────────────────────────────────────────────────────────
  function toggleStatusCabor(id) {
    setCabor(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'aktif' ? 'tidak_aktif' : 'aktif' }
          : item
      )
    )
  }

  // ── HELPERS ──────────────────────────────────────────────────────────────────
  function getCaborById(id) {
    return cabor.find(item => item.id === id) ?? null
  }

  const caborAktif = cabor.filter(c => c.status === 'aktif')

  return (
    <CaborContext.Provider value={{
      cabor,
      caborAktif,
      tambahCabor,
      editCabor,
      hapusCabor,
      toggleStatusCabor,
      getCaborById,
    }}>
      {children}
    </CaborContext.Provider>
  )
}

// Custom hook agar import lebih ringkas di komponen
export function useCabor() {
  const ctx = useContext(CaborContext)
  if (!ctx) throw new Error('useCabor harus dipakai di dalam CaborProvider')
  return ctx
}
