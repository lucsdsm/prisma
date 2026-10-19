export interface Setor {
  id: number
  nome: string
  ativo: boolean
}

export interface SetorInput {
  nome: string
  ativo: boolean
}

export interface SetoresList {
  items: Setor[]
  total: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  currentPage: number
  totalPages: number
}