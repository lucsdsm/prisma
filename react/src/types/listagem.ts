export interface ListQuery {
  page: number
  search: string
  ordering: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Listagem<T> {
  items: T[]
  total: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  currentPage: number
  totalPages: number
}

export const PAGE_SIZE = 10

export const INITIAL_LIST_QUERY: ListQuery = {
  page: 1,
  search: '',
  ordering: 'nome',
}
