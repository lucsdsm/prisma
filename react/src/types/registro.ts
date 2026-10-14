export type AcaoRegistro =
  | 'CRIACAO'
  | 'ALTERACAO'
  | 'EXCLUSAO'

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export interface Registro {
  id: number
  acao: AcaoRegistro

  content_type: number
  content_type_nome: string

  object_id: number
  representacao_objeto: string

  dados_anteriores: JsonValue
  dados_novos: JsonValue

  criado_em: string

  autor: number | null
  autor_nome: string | null
}

export interface RegistrosList {
  items: Registro[]
  total: number
  hasNextPage: boolean
}