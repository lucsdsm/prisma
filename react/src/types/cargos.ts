export interface Cargo {
  id: number
  nome: string
  ativo: boolean
}

export interface CargoInput {
  nome: string
  ativo: boolean
}

export interface CargoListagem {
  items: Cargo[]
  total: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  currentPage: number
  totalPages: number
}
