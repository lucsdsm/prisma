import { apiFetch } from '../api'
import type { Tipo, TipoInput, TipoListagem } from '../../types/tipos'
import { criarQueryString, normalizarListagem } from '../listagem'
import type { ListQuery, PaginatedResponse } from '../../types/listagem'

export async function listarTipo(query: ListQuery, signal?: AbortSignal): Promise<TipoListagem> {
  const response = await apiFetch<Tipo[] | PaginatedResponse<Tipo>>(
    `/tipos/${criarQueryString(query)}`,
    { method: 'GET', signal },
  )
  return normalizarListagem(response, query.page)
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
