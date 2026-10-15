export interface Funcionario {
  id: number
  nome: string

  setor: number
  setor_nome: string

  cargo: number
  cargo_nome: string

  ativo: boolean
}

export interface FuncionarioInput {
  nome: string
  setor: number
  cargo: number
  ativo: boolean
}

export interface FuncionariosList {
  items: Funcionario[]
  total: number
  hasNextPage: boolean
}