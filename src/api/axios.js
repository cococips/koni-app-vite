import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// Otomatis sisipkan token ke setiap request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('koni_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Kalau 401 (token expired) → redirect ke login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('koni_token')
      localStorage.removeItem('koni_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
