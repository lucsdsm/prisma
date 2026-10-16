import { apiFetch } from '../api'
import type { Tipo, TipoInput, TipoListagem } from '../../types/tipos'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function listarTipo(signal?: AbortSignal): Promise<TipoListagem> {
  const response = await apiFetch<Tipo[] | PaginatedResponse<Tipo>>(
    '/tipos/',
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

export async function criarTipo(dados: TipoInput): Promise<Tipo> {
  return apiFetch<Tipo>('/tipos/', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export async function atualizarTipo(id: number, dados: TipoInput): Promise<Tipo> {
  return apiFetch<Tipo>(`/tipos/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  })
}

export async function excluirTipo(id: number): Promise<void> {
  await apiFetch<void>(`/tipos/${id}/`, { method: 'DELETE' })
}
