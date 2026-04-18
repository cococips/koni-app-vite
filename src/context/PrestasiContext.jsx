import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, todayStr } from '../utils/helpers'
import seedData from '../data/prestasi.json'

const PrestasiContext = createContext(null)

export function PrestasiProvider({ children }) {
  const [prestasi, setPrestasi] = useLocalStorage('koni_prestasi', seedData)

  // ── CREATE ──────────────────────────────────────────────────────────────────
  function tambahPrestasi(data) {
    const baru = {
      ...data,
      id: generateId('prs'),
      foto_piagam: null,
      created_at: todayStr(),
    }
    setPrestasi(prev => [...prev, baru])
    return baru
  }

  // ── UPDATE ──────────────────────────────────────────────────────────────────
  function editPrestasi(id, data) {
    setPrestasi(prev =>
      prev.map(item => item.id === id ? { ...item, ...data } : item)
    )
  }

  // ── DELETE ──────────────────────────────────────────────────────────────────
  function hapusPrestasi(id) {
    setPrestasi(prev => prev.filter(item => item.id !== id))
  }

  // ── HELPERS ──────────────────────────────────────────────────────────────────
  function getPrestasiByAtlet(atletId) {
    return prestasi.filter(item => item.atlet_id === atletId)
  }

  function getPrestasiByGrade(grade) {
    return prestasi.filter(item => item.grade === grade)
  }

  // Statistik ringkas untuk dashboard
  const statMedali = {
    emas:     prestasi.filter(p => p.medali === 'emas').length,
    perak:    prestasi.filter(p => p.medali === 'perak').length,
    perunggu: prestasi.filter(p => p.medali === 'perunggu').length,
  }

  const statGrade = {
    daerah:        prestasi.filter(p => p.grade === 'daerah').length,
    nasional:      prestasi.filter(p => p.grade === 'nasional').length,
    internasional: prestasi.filter(p => p.grade === 'internasional').length,
  }

  return (
    <PrestasiContext.Provider value={{
      prestasi,
      tambahPrestasi,
      editPrestasi,
      hapusPrestasi,
      getPrestasiByAtlet,
      getPrestasiByGrade,
      statMedali,
      statGrade,
    }}>
      {children}
    </PrestasiContext.Provider>
  )
}

export function usePrestasi() {
  const ctx = useContext(PrestasiContext)
  if (!ctx) throw new Error('usePrestasi harus dipakai di dalam PrestasiProvider')
  return ctx
}
