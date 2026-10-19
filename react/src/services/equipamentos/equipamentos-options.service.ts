import { apiFetch } from '../api'

export interface CadastroOption {
  id: number
  nome: string
  ativo: boolean
}

export interface FuncionarioOption extends CadastroOption {
  setor: number
  setor_nome: string
}

interface PaginatedOptions<T> {
  results: T[]
  next: string | null
}

export interface EquipamentoOptions {
  tipos: CadastroOption[]
  propriedades: CadastroOption[]
  status: CadastroOption[]
  funcionarios: FuncionarioOption[]
}

async function listarTodasOpcoes<T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<T[]> {
  const items: T[] = []
  let currentEndpoint: string | null = `${endpoint}?page_size=1000`

  while (currentEndpoint) {
    const response: T[] | PaginatedOptions<T> = await apiFetch<
      T[] | PaginatedOptions<T>
    >(currentEndpoint, { signal })

    if (Array.isArray(response)) {
      items.push(...response)
      break
    }

    items.push(...response.results)

    if (response.next) {
      const nextUrl: URL = new URL(
        response.next,
        window.location.origin,
      )

      // Mantém a chamada na API configurada e reaproveita a consulta da próxima página.
      currentEndpoint = `${endpoint}${nextUrl.search}`
    } else {
      currentEndpoint = null
    }
  }

  return items
}

export async function carregarOpcoesEquipamento(
  signal?: AbortSignal,
): Promise<EquipamentoOptions> {
  const [tipos, propriedades, status, funcionarios] =
    await Promise.all([
      listarTodasOpcoes<CadastroOption>('/tipos/', signal),
      listarTodasOpcoes<CadastroOption>('/propriedades/', signal),
      listarTodasOpcoes<CadastroOption>('/status/', signal),
      listarTodasOpcoes<FuncionarioOption>('/funcionarios/', signal),
    ])

  return {
    tipos: tipos.filter((item) => item.ativo),
    propriedades: propriedades.filter((item) => item.ativo),
    status: status.filter((item) => item.ativo),
    funcionarios: funcionarios.filter((item) => item.ativo),
  }
}