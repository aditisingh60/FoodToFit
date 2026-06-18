const API_ROOT = import.meta.env.VITE_API_URL || ''

export async function apiFetch(path, options = {}) {
  const url = `${API_ROOT}${path}`

  let res
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch {
    throw new Error(
      'Cannot reach the server. Make sure the backend is running: cd backend && npm run dev'
    )
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }

  return data
}

export function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
