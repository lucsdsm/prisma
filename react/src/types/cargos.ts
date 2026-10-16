export interface Cargo {
  id: number
  nome: string
  ativo: boolean
  ordem: number
}

export interface CargoInput {
  nome: string
  ativo: boolean
  ordem: number
}

export interface CargoListagem {
  items: Cargo[]
  total: number
  hasNextPage: boolean
}
