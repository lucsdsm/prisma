import { apiFetch } from '../api'
import type { Status, StatusInput, StatusListagem } from '../../types/status'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function listarStatus(signal?: AbortSignal): Promise<StatusListagem> {
  const response = await apiFetch<Status[] | PaginatedResponse<Status>>(
    '/status/',
    { method: 'GET', signal },
  )

  if (Array.isArray(response)) {
    return { items: response, total: response.length, hasNextPage: false }
  }

  return {
    items: response.results,
    total: response.count,
    hasNextPage: response.next !== null,
  }
}

export async function criarStatus(dados: StatusInput): Promise<Status> {
  return apiFetch<Status>('/status/', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export async function atualizarStatus(id: number, dados: StatusInput): Promise<Status> {
  return apiFetch<Status>(`/status/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  })
}

export async function excluirStatus(id: number): Promise<void> {
  await apiFetch<void>(`/status/${id}/`, { method: 'DELETE' })
}
