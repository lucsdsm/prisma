import { apiFetch } from '../api'
import type { Propriedade, PropriedadeInput, PropriedadeListagem } from '../../types/propriedades'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function listarPropriedade(signal?: AbortSignal): Promise<PropriedadeListagem> {
  const response = await apiFetch<Propriedade[] | PaginatedResponse<Propriedade>>(
    '/propriedades/',
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

export async function criarPropriedade(dados: PropriedadeInput): Promise<Propriedade> {
  return apiFetch<Propriedade>('/propriedades/', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export async function atualizarPropriedade(id: number, dados: PropriedadeInput): Promise<Propriedade> {
  return apiFetch<Propriedade>(`/propriedades/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  })
}

export async function excluirPropriedade(id: number): Promise<void> {
  await apiFetch<void>(`/propriedades/${id}/`, { method: 'DELETE' })
}
