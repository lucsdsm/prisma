import { apiFetch } from '../api'
import type { Status, StatusInput, StatusListagem } from '../../types/status'
import { criarQueryString, normalizarListagem } from '../listagem'
import type { ListQuery, PaginatedResponse } from '../../types/listagem'

export async function listarStatus(query: ListQuery, signal?: AbortSignal): Promise<StatusListagem> {
  const response = await apiFetch<Status[] | PaginatedResponse<Status>>(
    `/status/${criarQueryString(query)}`,
    { method: 'GET', signal },
  )

  return normalizarListagem(response, query.page)
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
