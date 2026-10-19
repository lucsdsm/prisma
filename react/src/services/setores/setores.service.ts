import { apiFetch } from '../api'

import type {
  Setor,
  SetorInput,
  SetoresList,
} from '../../types/setor'
import { criarQueryString, normalizarListagem } from '../listagem'
import type { ListQuery, PaginatedResponse } from '../../types/listagem'

export async function listarSetores(
  query: ListQuery,
  signal?: AbortSignal,
): Promise<SetoresList> {
  const response = await apiFetch<
    Setor[] | PaginatedResponse<Setor>
  >(`/setores/${criarQueryString(query)}`, {
    method: 'GET',
    signal,
  })

  return normalizarListagem(response, query.page)
}

export async function criarSetor(
  dados: SetorInput,
): Promise<Setor> {
  return apiFetch<Setor>('/setores/', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export async function atualizarSetor(
  id: number,
  dados: SetorInput,
): Promise<Setor> {
  return apiFetch<Setor>(`/setores/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  })
}

export async function excluirSetor(id: number): Promise<void> {
  await apiFetch<void>(`/setores/${id}/`, {
    method: 'DELETE',
  })
}