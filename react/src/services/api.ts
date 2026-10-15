const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error(
    'A variável VITE_API_URL não foi configurada. Verifique o arquivo .env.',
  )
}

function getApiErrorMessage(data: unknown): string {
  if (!data || typeof data !== 'object') {
    return 'Não foi possível concluir a solicitação.'
  }

  const errors = data as Record<string, unknown>

  if (typeof errors.detail === 'string') {
    return errors.detail
  }

  if (typeof errors.message === 'string') {
    return errors.message
  }

  const messages = Object.entries(errors).flatMap(([field, value]) => {
    if (Array.isArray(value)) {
      return value.map((message) => `${field}: ${String(message)}`)
    }

    if (typeof value === 'string') {
      return [`${field}: ${value}`]
    }

    return []
  })

  return messages.join(' ') || 'Não foi possível concluir a solicitação.'
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token')

  if (!refreshToken) {
    return null
  }

  const response = await fetch(`${API_URL}/auth/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  })

  if (!response.ok) {
    return null
  }

  const data: unknown = await response.json()

  if (
    !data ||
    typeof data !== 'object' ||
    typeof (data as { access?: unknown }).access !== 'string'
  ) {
    throw new Error('A resposta de renovação da sessão é inválida.')
  }

  const accessToken = (data as { access: string }).access
  localStorage.setItem('access_token', accessToken)
  return accessToken
}

function expireSession(): void {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  window.dispatchEvent(new Event('auth:logout'))
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (
    response.status === 401 &&
    accessToken &&
    !endpoint.endsWith('/auth/refresh/') &&
    !endpoint.endsWith('/auth/login/')
  ) {
    const renewedAccessToken = await refreshAccessToken()

    if (renewedAccessToken) {
      headers.set('Authorization', `Bearer ${renewedAccessToken}`)
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      })
    } else {
      expireSession()
    }
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    const message =
      data?.detail ||
      data?.message ||
      getApiErrorMessage(data) ||
      'Não foi possível concluir a solicitação.'

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
