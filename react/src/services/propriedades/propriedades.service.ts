import { apiFetch } from '../api'
import type { Propriedade, PropriedadeInput, PropriedadeListagem } from '../../types/propriedades'
import { criarQueryString, normalizarListagem } from '../listagem'
import type { ListQuery, PaginatedResponse } from '../../types/listagem'

export async function listarPropriedade(query: ListQuery, signal?: AbortSignal): Promise<PropriedadeListagem> {
  const response = await apiFetch<Propriedade[] | PaginatedResponse<Propriedade>>(
    `/propriedades/${criarQueryString(query)}`,
    { method: 'GET', signal },
  )

  return normalizarListagem(response, query.page)
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
