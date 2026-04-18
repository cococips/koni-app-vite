import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Context providers
import { CaborProvider }   from './context/CaborContext'
import { AtletProvider }   from './context/AtletContext'
import { PelatihProvider } from './context/PelatihContext'
import { PrestasiProvider } from './context/PrestasiContext'

// Layout
import Layout from './components/common/Layout'

// Pages
import Dashboard    from './pages/Dashboard'
import AtletPage    from './pages/AtletPage'
import PelatihPage  from './pages/PelatihPage'
import CaborPage    from './pages/CaborPage'
import PrestasiPage from './pages/PrestasiPage'

export default function App() {
  return (
    <BrowserRouter>
      {/*
        Urutan provider: yang paling sering dipakai oleh provider lain
        diletakkan di luar (CaborContext dipakai AtletContext & PrestasiContext
        untuk lookup nama cabor).
      */}
      <CaborProvider>
        <AtletProvider>
          <PelatihProvider>
            <PrestasiProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="atlet"     element={<AtletPage />} />
                  <Route path="pelatih"   element={<PelatihPage />} />
                  <Route path="cabor"     element={<CaborPage />} />
                  <Route path="prestasi"  element={<PrestasiPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </PrestasiProvider>
          </PelatihProvider>
        </AtletProvider>
      </CaborProvider>
    </BrowserRouter>
  )
}
