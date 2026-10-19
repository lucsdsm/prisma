export interface Propriedade {
  id: number
  nome: string
  ativo: boolean
}

export interface PropriedadeInput {
  nome: string
  ativo: boolean
}

export interface PropriedadeListagem {
  items: Propriedade[]
  total: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  currentPage: number
  totalPages: number
}
