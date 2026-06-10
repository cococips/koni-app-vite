import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// [PRESENTASI: ORANG 2] Interceptor request — otomatis sisipkan token JWT ke setiap request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('koni_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// [PRESENTASI: ORANG 2] Interceptor response — kalau 401 (Unauthorized), redirect ke login
// Hanya redirect ke login kalau bukan dari public page
// dan bukan request stats landing page
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const isPublicPage = ['/','','/berita','/pengumuman','/kegiatan','/pengurus','/galeri']
        .some(path => window.location.pathname === path || window.location.pathname.startsWith('/berita/'))

      // Kalau di halaman publik, jangan redirect — biarkan gagal dengan diam
      if (!isPublicPage) {
        localStorage.removeItem('koni_token')
        localStorage.removeItem('koni_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// Instance khusus untuk public (tanpa auto-redirect)
export const publicApi = axios.create({
  baseURL: 'http://localhost:5000/api',
})

export default api
