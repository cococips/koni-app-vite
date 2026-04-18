import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Auth
import { AuthProvider }     from './context/AuthContext'
import PrivateRoute         from './components/common/PrivateRoute'

// Data contexts
import { CaborProvider }    from './context/CaborContext'
import { AtletProvider }    from './context/AtletContext'
import { PelatihProvider }  from './context/PelatihContext'
import { PrestasiProvider } from './context/PrestasiContext'

// Konten contexts
import { BeritaProvider }     from './context/BeritaContext'
import { PengumumanProvider } from './context/PengumumanContext'
import { KegiatanProvider }   from './context/KegiatanContext'
import { PengurusProvider }   from './context/PengurusContext'
import { GaleriProvider }     from './context/GaleriContext'

// Layouts
import PublicLayout from './components/common/PublicLayout'
import AdminLayout  from './components/common/AdminLayout'

// ── Halaman Publik ──────────────────────────────────────────────────────────
import LandingPage      from './pages/LandingPage'
import LoginPage        from './pages/LoginPage'
import BeritaPage       from './pages/public/BeritaPage'
import BeritaDetailPage from './pages/public/BeritaDetailPage'
import PengumumanPage   from './pages/public/PengumumanPage'
import KegiatanPage     from './pages/public/KegiatanPage'
import PengurusPage     from './pages/public/PengurusPage'
import GaleriPage       from './pages/public/GaleriPage'

// ── Halaman Admin ───────────────────────────────────────────────────────────
import Dashboard           from './pages/Dashboard'
import AtletPage           from './pages/AtletPage'
import PelatihPage         from './pages/PelatihPage'
import CaborPage           from './pages/CaborPage'
import PrestasiPage        from './pages/PrestasiPage'
import BeritaAdminPage     from './pages/admin/BeritaAdminPage'
import PengumumanAdminPage from './pages/admin/PengumumanAdminPage'
import KegiatanAdminPage   from './pages/admin/KegiatanAdminPage'
import PengurusAdminPage   from './pages/admin/PengurusAdminPage'
import GaleriAdminPage     from './pages/admin/GaleriAdminPage'

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

                            {/* ── LOGIN (standalone, tanpa layout) ── */}
                            <Route path="/login" element={<LoginPage />} />

                            {/* ── PUBLIK (pakai PublicLayout: Navbar + Footer) ── */}
                            <Route element={<PublicLayout />}>
                              <Route path="/"            element={<LandingPage />} />
                              <Route path="/berita"      element={<BeritaPage />} />
                              <Route path="/berita/:id"  element={<BeritaDetailPage />} />
                              <Route path="/pengumuman"  element={<PengumumanPage />} />
                              <Route path="/kegiatan"    element={<KegiatanPage />} />
                              <Route path="/pengurus"    element={<PengurusPage />} />
                              <Route path="/galeri"      element={<GaleriPage />} />
                            </Route>

                            {/* ── ADMIN (protected, pakai AdminLayout) ── */}
                            <Route path="/admin"
                              element={
                                <PrivateRoute>
                                  <AdminLayout />
                                </PrivateRoute>
                              }
                            >
                              <Route index                element={<Navigate to="/admin/dashboard" replace />} />
                              <Route path="dashboard"     element={<Dashboard />} />
                              <Route path="atlet"         element={<AtletPage />} />
                              <Route path="pelatih"       element={<PelatihPage />} />
                              <Route path="cabor"         element={<CaborPage />} />
                              <Route path="prestasi"      element={<PrestasiPage />} />
                              <Route path="berita"        element={<BeritaAdminPage />} />
                              <Route path="pengumuman"    element={<PengumumanAdminPage />} />
                              <Route path="kegiatan"      element={<KegiatanAdminPage />} />
                              <Route path="pengurus"      element={<PengurusAdminPage />} />
                              <Route path="galeri"        element={<GaleriAdminPage />} />
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
