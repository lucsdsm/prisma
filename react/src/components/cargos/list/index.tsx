import { useEffect, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { ListControls, ListPagination } from '../../ui/list-controls'
import { CargoTable } from '../table'
import {
  listarCargo,
  atualizarCargo,
  excluirCargo,
} from '../../../services/cargos/cargos.service'
import type { Cargo, CargoInput, CargoListagem } from '../../../types/cargos'
import { INITIAL_LIST_QUERY, type ListQuery } from '../../../types/listagem'
import './styles.css'

interface CargoListProps {
  onAdd: () => void
}

export function CargoList({ onAdd }: CargoListProps) {
  const [listagem, setListagem] = useState<CargoListagem>({
    items: [], total: 0, hasNextPage: false, hasPreviousPage: false, currentPage: 1, totalPages: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState<ListQuery>(INITIAL_LIST_QUERY)

  useEffect(() => {
    const controller = new AbortController()

    async function carregar() {
      setIsLoading(true)
      setError('')
      try {
        const data = await listarCargo(query, controller.signal)
        if (!controller.signal.aborted) setListagem(data)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar cargos.')
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void carregar()
    return () => controller.abort()
  }, [reloadKey, query])

  function updateQuery(changes: Partial<ListQuery>) {
    setQuery((current) => ({ ...current, ...changes }))
  }

  async function handleSave(id: number, dados: CargoInput): Promise<void> {
    const atualizado = await atualizarCargo(id, dados)
    setListagem((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id ? atualizado : item),
    }))
  }

  async function handleDelete(item: Cargo): Promise<void> {
    await excluirCargo(item.id)
    setListagem((current) => ({
      ...current,
      items: current.items.filter((registro) => registro.id !== item.id),
      total: Math.max(0, current.total - 1),
    }))
  }

  return (
    <div className="cargos-list">
      <div className="cargos-list__toolbar list-toolbar">
        <div className="list-toolbar__leading">
        <p className="cargos-list__count" aria-live="polite">
          {isLoading ? 'Carregando...' : error ? 'Listagem indisponível'
            : `${listagem.items.length} de ${listagem.total} registros`}
        </p>
        <ListControls query={query} isLoading={isLoading}
          onSearchChange={(search) => updateQuery({ search, page: 1 })} />
        </div>
        <ListPagination query={query} totalPages={listagem.totalPages} isLoading={isLoading} onPageChange={(page) => updateQuery({ page })} />
        <div className="cargos-list__actions">
          <button className="cargos-list__refresh" type="button"
            onClick={() => setReloadKey((value) => value + 1)} disabled={isLoading}>
            <RefreshCw size={16} aria-hidden="true" />
            {error ? 'Tentar novamente' : 'Atualizar'}
          </button>
          <button className="cargos-list__add" type="button" onClick={onAdd} disabled={isLoading}>
            <Plus size={16} aria-hidden="true" />
            Adicionar cargo
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="cargos-list__message" role="status">Buscando os registros...</div>
      ) : error ? (
        <div className="cargos-list__error" role="alert">{error}</div>
      ) : listagem.items.length === 0 ? (
        <div className="cargos-list__message">Nenhum registro encontrado.</div>
      ) : (
        <>
          <CargoTable items={listagem.items} ordering={query.ordering} onSort={(field) => updateQuery({ ordering: query.ordering === field ? `-${field}` : field, page: 1 })} onSave={handleSave} onDelete={handleDelete} />
        </>
      )}
    </div>
  )
}
