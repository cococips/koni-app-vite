import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Auth
import { AuthProvider }    from './context/AuthContext'
import PrivateRoute        from './components/common/PrivateRoute'

// Data contexts (lama)
import { CaborProvider }   from './context/CaborContext'
import { AtletProvider }   from './context/AtletContext'
import { PelatihProvider } from './context/PelatihContext'
import { PrestasiProvider } from './context/PrestasiContext'

// Konten contexts (baru)
import { BeritaProvider }      from './context/BeritaContext'
import { PengumumanProvider }  from './context/PengumumanContext'
import { KegiatanProvider }    from './context/KegiatanContext'
import { PengurusProvider }    from './context/PengurusContext'
import { GaleriProvider }      from './context/GaleriContext'

// Layouts
import AdminLayout from './components/common/AdminLayout'

// Halaman publik
import LandingPage from './pages/LandingPage'
import LoginPage   from './pages/LoginPage'

// Halaman admin (lama)
import Dashboard    from './pages/Dashboard'
import AtletPage    from './pages/AtletPage'
import PelatihPage  from './pages/PelatihPage'
import CaborPage    from './pages/CaborPage'
import PrestasiPage from './pages/PrestasiPage'

// Halaman admin (baru)
import BeritaAdminPage      from './pages/admin/BeritaAdminPage'
import PengumumanAdminPage  from './pages/admin/PengumumanAdminPage'
import KegiatanAdminPage    from './pages/admin/KegiatanAdminPage'
import PengurusAdminPage    from './pages/admin/PengurusAdminPage'
import GaleriAdminPage      from './pages/admin/GaleriAdminPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CaborProvider>
          <AtletProvider>
            <PelatihProvider>
              <PrestasiProvider>
                <BeritaProvider>
                  <PengumumanProvider>
                    <KegiatanProvider>
                      <PengurusProvider>
                        <GaleriProvider>
                          <Routes>

                            {/* ── PUBLIK ── */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />

                            {/* ── ADMIN (protected) ── */}
                            <Route
                              path="/admin"
                              element={
                                <PrivateRoute>
                                  <AdminLayout />
                                </PrivateRoute>
                              }
                            >
                              <Route index element={<Navigate to="/admin/dashboard" replace />} />
                              <Route path="dashboard" element={<Dashboard />} />
                              <Route path="atlet"     element={<AtletPage />} />
                              <Route path="pelatih"   element={<PelatihPage />} />
                              <Route path="cabor"     element={<CaborPage />} />
                              <Route path="prestasi"  element={<PrestasiPage />} />
                              <Route path="berita"      element={<BeritaAdminPage />} />
                              <Route path="pengumuman"  element={<PengumumanAdminPage />} />
                              <Route path="kegiatan"    element={<KegiatanAdminPage />} />
                              <Route path="pengurus"    element={<PengurusAdminPage />} />
                              <Route path="galeri"      element={<GaleriAdminPage />} />
                            </Route>

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />

                          </Routes>
                        </GaleriProvider>
                      </PengurusProvider>
                    </KegiatanProvider>
                  </PengumumanProvider>
                </BeritaProvider>
              </PrestasiProvider>
            </PelatihProvider>
          </AtletProvider>
        </CaborProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
