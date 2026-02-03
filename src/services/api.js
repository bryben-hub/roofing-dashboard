import axios from 'axios'

const API_BASE_URL = 'https://roofing-saas-production.up.railway.app/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const auth = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me')
}

export const customers = {
  list: (params) => api.get('/customers', { params }),
  get: (id) => api.get('/customers/' + id),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put('/customers/' + id, data),
  delete: (id) => api.delete('/customers/' + id)
}

export const jobs = {
  list: (params) => api.get('/jobs', { params }),
  get: (id) => api.get('/jobs/' + id),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put('/jobs/' + id, data),
  delete: (id) => api.delete('/jobs/' + id),
  saveMeasurements: (id, data) => api.post('/jobs/' + id + '/measurements', data),
  getMeasurements: (id) => api.get('/jobs/' + id + '/measurements')
}

export const estimates = {
  list: (params) => api.get('/estimates', { params }),
  get: (id) => api.get('/estimates/' + id),
  generate: (jobId, data) => api.post('/estimates/generate/' + jobId, data),
  update: (id, data) => api.put('/estimates/' + id, data)
}

export default api
