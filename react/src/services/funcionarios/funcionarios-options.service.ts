import { apiFetch } from '../api'

export interface FuncionarioOption {
  id: number
  nome: string
  ativo: boolean
}

export interface FuncionarioOptions {
  setores: FuncionarioOption[]
  cargos: FuncionarioOption[]
}

interface PaginatedOptions<T> {
  results: T[]
  next: string | null
}

async function listarTodasOpcoes<T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<T[]> {
  const items: T[] = []
  let currentEndpoint: string | null = endpoint

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

      currentEndpoint = `${endpoint}${nextUrl.search}`
    } else {
      currentEndpoint = null
    }
  }

  return items
}

export async function carregarOpcoesFuncionario(
  signal?: AbortSignal,
): Promise<FuncionarioOptions> {
  const [setores, cargos] = await Promise.all([
    listarTodasOpcoes<FuncionarioOption>('/setores/', signal),
    listarTodasOpcoes<FuncionarioOption>('/cargos/', signal),
  ])

  return {
    setores: setores.filter((item) => item.ativo),
    cargos: cargos.filter((item) => item.ativo),
  }
}