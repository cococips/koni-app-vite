import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, todayStr } from '../utils/helpers'
import seedData from '../data/pelatih.json'

const PelatihContext = createContext(null)

export function PelatihProvider({ children }) {
  const [pelatih, setPelatih] = useLocalStorage('koni_pelatih', seedData)

  // ── CREATE ──────────────────────────────────────────────────────────────────
  function tambahPelatih(data) {
    const baru = {
      ...data,
      id: generateId('plt'),
      foto: null,
      created_at: todayStr(),
    }
    setPelatih(prev => [...prev, baru])
    return baru
  }

  // ── UPDATE ──────────────────────────────────────────────────────────────────
  function editPelatih(id, data) {
    setPelatih(prev =>
      prev.map(item => item.id === id ? { ...item, ...data } : item)
    )
  }

  // ── DELETE ──────────────────────────────────────────────────────────────────
  function hapusPelatih(id) {
    setPelatih(prev => prev.filter(item => item.id !== id))
  }

  // ── TOGGLE STATUS ────────────────────────────────────────────────────────────
  function toggleStatusPelatih(id) {
    setPelatih(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'aktif' ? 'tidak_aktif' : 'aktif' }
          : item
      )
    )
  }

  // ── HELPERS ──────────────────────────────────────────────────────────────────
  function getPelatihById(id) {
    return pelatih.find(item => item.id === id) ?? null
  }

  function getPelatihByCabor(caborId) {
    return pelatih.filter(item => item.cabor_id === caborId)
  }

  const pelatihAktif = pelatih.filter(p => p.status === 'aktif')

  return (
    <PelatihContext.Provider value={{
      pelatih,
      pelatihAktif,
      tambahPelatih,
      editPelatih,
      hapusPelatih,
      toggleStatusPelatih,
      getPelatihById,
      getPelatihByCabor,
    }}>
      {children}
    </PelatihContext.Provider>
  )
}

export function usePelatih() {
  const ctx = useContext(PelatihContext)
  if (!ctx) throw new Error('usePelatih harus dipakai di dalam PelatihProvider')
  return ctx
}
