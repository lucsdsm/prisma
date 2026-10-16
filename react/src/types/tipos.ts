export interface Tipo {
  id: number
  nome: string
  ativo: boolean
  ordem: number
}

export interface TipoInput {
  nome: string
  ativo: boolean
  ordem: number
}

export interface TipoListagem {
  items: Tipo[]
  total: number
  hasNextPage: boolean
}
