import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import { AuthProvider }       from './context/AuthContext'
import PrivateRoute           from './components/common/PrivateRoute'

// Konten contexts (untuk landing page & kelola konten)
import { CaborProvider }      from './context/CaborContext'
import { AtletProvider }      from './context/AtletContext'
import { PelatihProvider }    from './context/PelatihContext'
import { PrestasiProvider }   from './context/PrestasiContext'
import { BeritaProvider }     from './context/BeritaContext'
import { PengumumanProvider } from './context/PengumumanContext'
import { KegiatanProvider }   from './context/KegiatanContext'
import { PengurusProvider }   from './context/PengurusContext'
import { GaleriProvider }     from './context/GaleriContext'

import PublicLayout from './components/common/PublicLayout'
import AdminLayout  from './components/common/AdminLayout'

// Publik
import LandingPage      from './pages/LandingPage'
import LoginPage        from './pages/LoginPage'
import BeritaPage       from './pages/public/BeritaPage'
import BeritaDetailPage from './pages/public/BeritaDetailPage'
import PengumumanPage   from './pages/public/PengumumanPage'
import KegiatanPage     from './pages/public/KegiatanPage'
import PengurusPage     from './pages/public/PengurusPage'
import GaleriPage       from './pages/public/GaleriPage'

// Admin — data olahraga (pakai API)
import Dashboard    from './pages/Dashboard'
import AtletPage    from './pages/AtletPage'
import PelatihPage  from './pages/PelatihPage'
import WasitPage    from './pages/WasitPage'
import CaborPage    from './pages/CaborPage'
import PrestasiPage from './pages/PrestasiPage'

// Admin — kelola konten (pakai Context/localStorage)
import BeritaAdminPage     from './pages/admin/BeritaAdminPage'
import PengumumanAdminPage from './pages/admin/PengumumanAdminPage'
import KegiatanAdminPage   from './pages/admin/KegiatanAdminPage'
import PengurusAdminPage   from './pages/admin/PengurusAdminPage'
import GaleriAdminPage     from './pages/admin/GaleriAdminPage'

// Dashboard per role
import PelatihDashboard from './pages/dashboard/PelatihDashboard'
import AtletDashboard   from './pages/dashboard/AtletDashboard'
import WasitDashboard   from './pages/dashboard/WasitDashboard'

function RoleRoute({ role, children }) {
  return <PrivateRoute allowedRoles={[role]}>{children}</PrivateRoute>
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        {/* Context konten landing page tetap pakai localStorage */}
        <BeritaProvider>
          <PengumumanProvider>
            <KegiatanProvider>
              <PengurusProvider>
                <GaleriProvider>
                  {/* Context data olahraga — masih dipakai landing page untuk stats */}
                  <CaborProvider>
                    <AtletProvider>
                      <PelatihProvider>
                        <PrestasiProvider>
                          {/* [PRESENTASI: ORANG 3] Routing aplikasi dengan React Router v6. Dibagi menjadi 3 kelompok route */}
                          <Routes>

                            {/* LOGIN */}
                            <Route path="/login" element={<LoginPage />} />

                            {/* PUBLIK */}
                            <Route element={<PublicLayout />}>
                              <Route path="/"            element={<LandingPage />} />
                              <Route path="/berita"      element={<BeritaPage />} />
                              <Route path="/berita/:id"  element={<BeritaDetailPage />} />
                              <Route path="/pengumuman"  element={<PengumumanPage />} />
                              <Route path="/kegiatan"    element={<KegiatanPage />} />
                              <Route path="/pengurus"    element={<PengurusPage />} />
                              <Route path="/galeri"      element={<GaleriPage />} />
                            </Route>

                            {/* DASHBOARD PER ROLE */}
                            <Route path="/dashboard/pelatih"
                              element={<RoleRoute role="pelatih"><PelatihDashboard /></RoleRoute>} />
                            <Route path="/dashboard/atlet"
                              element={<RoleRoute role="atlet"><AtletDashboard /></RoleRoute>} />
                            <Route path="/dashboard/wasit"
                              element={<RoleRoute role="wasit"><WasitDashboard /></RoleRoute>} />

                            {/* ADMIN */}
                            <Route path="/admin"
                              element={<RoleRoute role="admin"><AdminLayout /></RoleRoute>}>
                              <Route index element={<Navigate to="/admin/dashboard" replace />} />
                              <Route path="dashboard"  element={<Dashboard />} />
                              {/* Data olahraga → API */}
                              <Route path="atlet"      element={<AtletPage />} />
                              <Route path="pelatih"    element={<PelatihPage />} />
                              <Route path="wasit"      element={<WasitPage />} />
                              <Route path="cabor"      element={<CaborPage />} />
                              <Route path="prestasi"   element={<PrestasiPage />} />
                              {/* Kelola konten → localStorage */}
                              <Route path="berita"     element={<BeritaAdminPage />} />
                              <Route path="pengumuman" element={<PengumumanAdminPage />} />
                              <Route path="kegiatan"   element={<KegiatanAdminPage />} />
                              <Route path="pengurus"   element={<PengurusAdminPage />} />
                              <Route path="galeri"     element={<GaleriAdminPage />} />
                            </Route>

                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Routes>
                        </PrestasiProvider>
                      </PelatihProvider>
                    </AtletProvider>
                  </CaborProvider>
                </GaleriProvider>
              </PengurusProvider>
            </KegiatanProvider>
          </PengumumanProvider>
        </BeritaProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
