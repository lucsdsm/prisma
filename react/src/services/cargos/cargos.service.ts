import { apiFetch } from '../api'
import type { Cargo, CargoInput, CargoListagem } from '../../types/cargos'
import { criarQueryString, normalizarListagem } from '../listagem'
import type { ListQuery, PaginatedResponse } from '../../types/listagem'

export async function listarCargo(query: ListQuery, signal?: AbortSignal): Promise<CargoListagem> {
  const response = await apiFetch<Cargo[] | PaginatedResponse<Cargo>>(
    `/cargos/${criarQueryString(query)}`,
    { method: 'GET', signal },
  )

  return normalizarListagem(response, query.page)
}

export async function criarCargo(dados: CargoInput): Promise<Cargo> {
  return apiFetch<Cargo>('/cargos/', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export async function atualizarCargo(id: number, dados: CargoInput): Promise<Cargo> {
  return apiFetch<Cargo>(`/cargos/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  })
}

export async function excluirCargo(id: number): Promise<void> {
  await apiFetch<void>(`/cargos/${id}/`, { method: 'DELETE' })
}
