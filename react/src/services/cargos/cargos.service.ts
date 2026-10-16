import { apiFetch } from '../api'
import type { Cargo, CargoInput, CargoListagem } from '../../types/cargos'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function listarCargo(signal?: AbortSignal): Promise<CargoListagem> {
  const response = await apiFetch<Cargo[] | PaginatedResponse<Cargo>>(
    '/cargos/',
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
