export interface Status {
  id: number
  nome: string
  ativo: boolean
  ordem: number
}

export interface StatusInput {
  nome: string
  ativo: boolean
  ordem: number
}

export interface StatusListagem {
  items: Status[]
  total: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  currentPage: number
  totalPages: number
}
