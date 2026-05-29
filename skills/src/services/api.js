import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  deleteAccount: (data) => api.delete('/auth/profile', { data }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
}

export const skillsAPI = {
  list: (params) => api.get('/skills', { params }),
  get: (id) => api.get(`/skills/${id}`),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
  categories: () => api.get('/skills/categories'),
  search: (q, filters) => api.get('/skills/search', { params: { q, ...filters } }),
  popular: () => api.get('/skills/popular'),
}

export const teachersAPI = {
  list: (params) => api.get('/teachers', { params }),
  get: (id) => api.get(`/teachers/${id}`),
  availability: (id) => api.get(`/teachers/${id}/availability`),
  setAvailability: (slots) => api.post('/teachers/availability', { slots }),
  myProfile: () => api.get('/teachers/me'),
  updateProfile: (data) => api.put('/teachers/me', data),
}

export const sessionsAPI = {
  request: (data) => api.post('/sessions', data),
  list: (params) => api.get('/sessions', { params }),
  get: (id) => api.get(`/sessions/${id}`),
  markCompleted: (id) => api.post(`/sessions/${id}/complete`),
  cancel: (id, data) => api.post(`/sessions/${id}/cancel`, data),
  accept: (id) => api.post(`/sessions/${id}/accept`),
  reject: (id) => api.post(`/sessions/${id}/reject`),
  myRequests: () => api.get('/sessions/requests'),
  rate: (id, data) => api.post(`/sessions/${id}/rate`, data),
  history: (params) => api.get('/sessions/history', { params }),
  updateMeetingPlace: (id, data) => api.post(`/sessions/${id}/meeting-place`, data),
  acceptMeetingPlace: (id) => api.post(`/sessions/${id}/meeting-place/accept`),
}

export const creditsAPI = {
  balance: () => api.get('/credits/balance'),
  transactions: (params) => api.get('/credits/transactions', { params }),
}

export const notificationsAPI = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
  markMeetingPlaceRead: () => api.post('/notifications/meeting-place/read'),
}

export const adminAPI = {
  users: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  inviteUser: (data) => api.post('/admin/users/invite', data),
  bulkImport: (file) => {
    const form = new FormData(); form.append('file', file)
    return api.post('/admin/users/import', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  suspendUser: (id) => api.post(`/admin/users/${id}/suspend`),
  activateUser: (id) => api.post(`/admin/users/${id}/activate`),
  skillsManagement: (params) => api.get('/admin/skills', { params }),
  approveSkill: (id) => api.post(`/admin/skills/${id}/approve`),
  hideSkill: (id) => api.post(`/admin/skills/${id}/hide`),
  addGlobalSkill: (data) => api.post('/admin/skills/global', data),
  getSettings: () => api.get('/admin/settings'),
  saveSettings: (data) => api.put('/admin/settings', data),
  uploadLogo: (file) => {
    const form = new FormData(); form.append('logo', file)
    return api.post('/admin/settings/logo', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  analytics: (params) => api.get('/admin/analytics', { params }),
  exportReport: () => api.get('/admin/analytics/export', { responseType: 'blob' }),
  billing: () => api.get('/admin/billing'),
  upgradePlan: (planName) => api.post('/admin/billing/upgrade', { plan_name: planName }),
  invoices: () => api.get('/admin/billing/invoices'),
}

export const superAdminAPI = {
  analytics: () => api.get('/super-admin/analytics'),
  tenants: (params) => api.get('/super-admin/tenants', { params }),
  getTenant: (id) => api.get(`/super-admin/tenants/${id}`),
  createTenant: (data) => api.post('/super-admin/tenants', data),
  updateTenant: (id, data) => api.put(`/super-admin/tenants/${id}`, data),
  suspendTenant: (id) => api.post(`/super-admin/tenants/${id}/suspend`),
  deleteTenant: (id) => api.delete(`/super-admin/tenants/${id}`),
  activateTenant: (id) => api.post(`/super-admin/tenants/${id}/activate`),
  plans: () => api.get('/super-admin/plans'),
  createPlan: (data) => api.post('/super-admin/plans', data),
  updatePlan: (id, data) => api.put(`/super-admin/plans/${id}`, data),
  publishPlan: (id) => api.post(`/super-admin/plans/${id}/publish`),
  revenue: () => api.get('/super-admin/revenue'),
  tickets: (params) => api.get('/super-admin/tickets', { params }),
  resolveTicket: (id) => api.post(`/super-admin/tickets/${id}/resolve`),
  assignTicket: (id, agentId) => api.post(`/super-admin/tickets/${id}/assign`, { agent_id: agentId }),
  tenantUsageStats: (id) => api.get(`/super-admin/tenants/${id}/stats`),
}

export default api
