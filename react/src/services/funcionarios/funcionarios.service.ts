import { apiFetch } from '../api'

import type {
  Funcionario,
  FuncionarioInput,
  FuncionariosList,
} from '../../types/funcionario'
import { criarQueryString, normalizarListagem } from '../listagem'
import type { ListQuery, PaginatedResponse } from '../../types/listagem'

export async function listarFuncionarios(
  query: ListQuery,
  signal?: AbortSignal,
): Promise<FuncionariosList> {
  const response = await apiFetch<
    Funcionario[] | PaginatedResponse<Funcionario>
  >(`/funcionarios/${criarQueryString(query)}`, {
    method: 'GET',
    signal,
  })

  return normalizarListagem(response, query.page)
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