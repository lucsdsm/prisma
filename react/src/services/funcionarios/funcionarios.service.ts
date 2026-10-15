import { apiFetch } from '../api'

import type {
  Funcionario,
  FuncionarioInput,
  FuncionariosList,
} from '../../types/funcionario'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function listarFuncionarios(
  signal?: AbortSignal,
): Promise<FuncionariosList> {
  const response = await apiFetch<
    Funcionario[] | PaginatedResponse<Funcionario>
  >('/funcionarios/', {
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

export async function criarFuncionario(
  dados: FuncionarioInput,
): Promise<Funcionario> {
  return apiFetch<Funcionario>('/funcionarios/', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export async function atualizarFuncionario(
  id: number,
  dados: FuncionarioInput,
): Promise<Funcionario> {
  return apiFetch<Funcionario>(`/funcionarios/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  })
}

export async function excluirFuncionario(id: number): Promise<void> {
  await apiFetch<void>(`/funcionarios/${id}/`, {
    method: 'DELETE',
  })
}