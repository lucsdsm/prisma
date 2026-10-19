export interface Tipo {
  id: number
  nome: string
  ativo: boolean
}

export interface TipoInput {
  nome: string
  ativo: boolean
}

export interface TipoListagem {
  items: Tipo[]
  total: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  currentPage: number
  totalPages: number
}
