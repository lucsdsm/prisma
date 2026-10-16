export interface Setor {
  id: number
  nome: string
  ativo: boolean
  ordem: number
}

export interface SetorInput {
  nome: string
  ativo: boolean
  ordem: number
}

export interface SetoresList {
  items: Setor[]
  total: number
  hasNextPage: boolean
}