import { PAGE_SIZE, type ListQuery, type Listagem, type PaginatedResponse } from '../types/listagem'

export function criarQueryString(query: ListQuery): string {
  const params = new URLSearchParams()
  params.set('page', String(query.page))
  params.set('search', query.search)
  params.set('ordering', query.ordering)
  return `?${params.toString()}`
}

export function normalizarListagem<T>(
  response: T[] | PaginatedResponse<T>,
  page: number,
  pageSize = PAGE_SIZE,
): Listagem<T> {
  if (Array.isArray(response)) {
    return {
      items: response,
      total: response.length,
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    }
  }

  return {
    items: response.results,
    total: response.count,
    hasNextPage: response.next !== null,
    hasPreviousPage: response.previous !== null,
    currentPage: page,
    totalPages: Math.max(1, Math.ceil(response.count / pageSize)),
  }
}
