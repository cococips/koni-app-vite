import { useState, useEffect } from 'react'

/**
 * Custom hook untuk sinkronisasi state dengan localStorage.
 *
 * Cara pakai:
 *   const [atlet, setAtlet] = useLocalStorage('koni_atlet', [])
 *
 * Saat UAS tinggal ganti hook ini atau fungsi di Context
 * dengan fetch ke API — komponen UI tidak perlu diubah.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`useLocalStorage: gagal baca key "${key}"`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`useLocalStorage: gagal tulis key "${key}"`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
