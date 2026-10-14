import { apiFetch } from './api'

import type {
  Registro,
  RegistrosList,
} from '../types/registro'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function listarRegistros(
  signal?: AbortSignal,
): Promise<RegistrosList> {
  const response = await apiFetch<
    Registro[] | PaginatedResponse<Registro>
  >('/auditoria/', {
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