const BASE = '/api'

function deviceId() {
  let id = localStorage.getItem('deviceId')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('deviceId', id)
  }
  return id
}

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    ...options,
    headers: { 'x-device-id': deviceId(), ...options.headers },
  })
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.message || `request failed: ${res.status}`)
  return json?.data ?? null
}

function toForm(fields) {
  const form = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    if (value != null) form.append(key, value)
  }
  return form
}

export const login = () => {
  location.href = `${BASE}/auth?x-device-id=${deviceId()}`
}
export const logout = () => request('/auth/logout', { method: 'POST' })
export const refresh = () => request('/auth/refresh', { method: 'POST' })
export const getMe = () => request('/auth/me')

export const getTracks = (cursor) =>
  request('/track/info' + (cursor ? `?cursor=${cursor}` : ''))
export const getTrack = (id) => request(`/track/info?id=${id}`)
export const loadTrack = (id) => request(`/track/${id}`)
export const uploadTrack = (fields) =>
  request('/track', { method: 'POST', body: toForm(fields) })
export const updateTrack = (id, fields) =>
  request(`/track/${id}`, { method: 'PATCH', body: toForm(fields) })
export const deleteTrack = (id) => request(`/track/${id}`, { method: 'DELETE' })

export const imageUrl = (file) => (file ? `${BASE}/public/images/${file}` : '')
export const audioUrl = (file) => (file ? `${BASE}/public/tracks/${file}` : '')
