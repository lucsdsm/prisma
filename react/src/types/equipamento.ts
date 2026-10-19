export interface Equipamento {
  id: number

  tipo: number
  tipo_nome: string

  marca: string
  modelo: string

  propriedade: number
  propriedade_nome: string

  tombo: string | null

  responsavel_atual: number | null
  responsavel_nome: string | null
  setor_atual: string | null

  status: number | null
  status_nome: string | null

  data_fornecimento: string | null
  data_entrega_atual: string | null

  descricao: string
  observacoes: string

  criado_em: string
  atualizado_em: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface EquipamentosList {
  items: Equipamento[]
  total: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  currentPage: number
  totalPages: number
}

export interface EquipamentoCreate {
  tipo: number
  marca: string
  modelo: string

  propriedade: number
  tombo: string | null

  responsavel_atual: number | null
  status: number | null

  data_fornecimento: string | null
  data_entrega_atual: string | null

  descricao: string
  observacoes: string
}