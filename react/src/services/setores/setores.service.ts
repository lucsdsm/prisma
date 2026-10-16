import { apiFetch } from '../api'

import type {
  Setor,
  SetorInput,
  SetoresList,
} from '../../types/setor'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function listarSetores(
  signal?: AbortSignal,
): Promise<SetoresList> {
  const response = await apiFetch<
    Setor[] | PaginatedResponse<Setor>
  >('/setores/', {
    method: 'GET',
    signal,
  })

  if (Array.isArray(response)) {
    return {
      items: response,
      total: response.length,
      hasNextPage: false,
    }
  }

  return {
    items: response.results,
    total: response.count,
    hasNextPage: response.next !== null,
  }
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