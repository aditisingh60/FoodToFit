import { apiFetch, authHeaders } from './client'

export function getProfile() {
  return apiFetch('/api/user/profile', { headers: authHeaders() })
}

export function saveOnboarding(payload) {
  return apiFetch('/api/user/onboarding', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
}
