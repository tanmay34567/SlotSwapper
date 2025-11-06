const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse(response) {
  const data = await response.json()
  if (!response.ok) {
    // Log the full error for debugging
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: data.error,
      message: data.message,
      fullData: data
    })
    throw new Error(data.error || data.message || 'Request failed')
  }
  return data
}

// Auth API
export async function signup(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  return handleResponse(res)
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return handleResponse(res)
}

// Events API
export async function fetchEvents(token) {
  const res = await fetch(`${API_BASE}/events`, {
    headers: { ...authHeaders(token) }
  })
  return handleResponse(res)
}

export async function createEvent(token, eventData) {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token)
    },
    body: JSON.stringify(eventData)
  })
  return handleResponse(res)
}

export async function updateEvent(token, eventId, eventData) {
  const res = await fetch(`${API_BASE}/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token)
    },
    body: JSON.stringify(eventData)
  })
  return handleResponse(res)
}

export async function deleteEvent(token, eventId) {
  const res = await fetch(`${API_BASE}/events/${eventId}`, {
    method: 'DELETE',
    headers: { ...authHeaders(token) }
  })
  return handleResponse(res)
}

// Swaps API
export async function fetchSwappableSlots(token) {
  const res = await fetch(`${API_BASE}/swaps/swappable-slots`, {
    headers: { ...authHeaders(token) }
  })
  return handleResponse(res)
}

export async function createSwapRequest(token, mySlotId, theirSlotId) {
  console.log('Creating swap request:', { mySlotId, theirSlotId })
  const res = await fetch(`${API_BASE}/swaps/swap-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token)
    },
    body: JSON.stringify({ mySlotId, theirSlotId })
  })
  return handleResponse(res)
}

export async function respondToSwap(token, requestId, accept) {
  const res = await fetch(`${API_BASE}/swaps/swap-response/${requestId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token)
    },
    body: JSON.stringify({ accept })
  })
  return handleResponse(res)
}

export async function fetchIncomingRequests(token) {
  const res = await fetch(`${API_BASE}/swaps/swap-requests/incoming`, {
    headers: { ...authHeaders(token) }
  })
  return handleResponse(res)
}

export async function fetchOutgoingRequests(token) {
  const res = await fetch(`${API_BASE}/swaps/swap-requests/outgoing`, {
    headers: { ...authHeaders(token) }
  })
  return handleResponse(res)
}
