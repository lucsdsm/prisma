import { apiFetch } from './api'

import type {
  Equipamento,
  EquipamentosList,
  PaginatedResponse,
} from '../types/equipamento'

export async function listarEquipamentos(
  signal?: AbortSignal,
): Promise<EquipamentosList> {
  const response = await apiFetch<
    Equipamento[] | PaginatedResponse<Equipamento>
  >('/equipamentos/', {
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

export interface EquipamentoInlineUpdate {
  tombo: string | null
  marca: string
  modelo: string
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