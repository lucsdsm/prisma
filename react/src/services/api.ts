const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error(
    'A variável VITE_API_URL não foi configurada. Verifique o arquivo .env.',
  )
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = localStorage.getItem('access_token')

  const headers = new Headers(options.headers)

  headers.set('Content-Type', 'application/json')

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)

    const message =
      data?.detail ||
      data?.message ||
      'Não foi possível concluir a solicitação.'

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}