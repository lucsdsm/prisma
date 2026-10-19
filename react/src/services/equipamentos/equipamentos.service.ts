import { apiFetch } from '../api'

import type {
  Equipamento,
  EquipamentosList,
  EquipamentoCreate,
} from '../../types/equipamento'
import { criarQueryString, normalizarListagem } from '../listagem'
import type { ListQuery, PaginatedResponse } from '../../types/listagem'

export async function listarEquipamentos(
  query: ListQuery,
  signal?: AbortSignal,
): Promise<EquipamentosList> {
  const response = await apiFetch<
    Equipamento[] | PaginatedResponse<Equipamento>
  >(`/equipamentos/${criarQueryString(query)}`, {
    method: 'GET',
    signal,
  })

  return normalizarListagem(response, query.page)
}

export interface EquipamentoInlineUpdate {
  tombo: string | null
  marca: string
  modelo: string

  tipo: number
  propriedade: number
  responsavel_atual: number | null
  status: number | null
}

export async function criarEquipamento(
  dados: EquipamentoCreate,
): Promise<Equipamento> {
  return apiFetch<Equipamento>('/equipamentos/', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export async function atualizarEquipamento(
  id: number,
  dados: EquipamentoInlineUpdate,
): Promise<Equipamento> {
  return apiFetch<Equipamento>(`/equipamentos/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  })
}

export async function excluirEquipamento(id: number): Promise<void> {
  await apiFetch<void>(`/equipamentos/${id}/`, {
    method: 'DELETE',
  })
}