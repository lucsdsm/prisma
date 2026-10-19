import { useEffect, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { ListControls, ListPagination } from '../../ui/list-controls'
import { StatusTable } from '../table'
import {
  listarStatus,
  atualizarStatus,
  excluirStatus,
} from '../../../services/status/status.service'
import type { Status, StatusInput, StatusListagem } from '../../../types/status'
import { INITIAL_LIST_QUERY, type ListQuery } from '../../../types/listagem'
import './styles.css'

interface StatusListProps {
  onAdd: () => void
}

export function StatusList({ onAdd }: StatusListProps) {
  const [listagem, setListagem] = useState<StatusListagem>({
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
        const data = await listarStatus(query, controller.signal)
        if (!controller.signal.aborted) setListagem(data)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar status.')
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

  async function handleSave(id: number, dados: StatusInput): Promise<void> {
    const atualizado = await atualizarStatus(id, dados)
    setListagem((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id ? atualizado : item),
    }))
  }

  async function handleDelete(item: Status): Promise<void> {
    await excluirStatus(item.id)
    setListagem((current) => ({
      ...current,
      items: current.items.filter((registro) => registro.id !== item.id),
      total: Math.max(0, current.total - 1),
    }))
  }

  return (
    <div className="status-list">
      <div className="status-list__toolbar list-toolbar">
        <div className="list-toolbar__leading">
        <p className="status-list__count" aria-live="polite">
          {isLoading ? 'Carregando...' : error ? 'Listagem indisponível'
            : `${listagem.items.length} de ${listagem.total} registros`}
        </p>
        <ListControls query={query} isLoading={isLoading}
          onSearchChange={(search) => updateQuery({ search, page: 1 })} />
        </div>
        <ListPagination query={query} totalPages={listagem.totalPages} isLoading={isLoading} onPageChange={(page) => updateQuery({ page })} />
        <div className="status-list__actions">
          <button className="status-list__refresh" type="button"
            onClick={() => setReloadKey((value) => value + 1)} disabled={isLoading}>
            <RefreshCw size={16} aria-hidden="true" />
            {error ? 'Tentar novamente' : 'Atualizar'}
          </button>
          <button className="status-list__add" type="button" onClick={onAdd} disabled={isLoading}>
            <Plus size={16} aria-hidden="true" />
            Adicionar status
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="status-list__message" role="status">Buscando os registros...</div>
      ) : error ? (
        <div className="status-list__error" role="alert">{error}</div>
      ) : listagem.items.length === 0 ? (
        <div className="status-list__message">Nenhum registro encontrado.</div>
      ) : (
        <>
          <StatusTable items={listagem.items} ordering={query.ordering} onSort={(field) => updateQuery({ ordering: query.ordering === field ? `-${field}` : field, page: 1 })} onSave={handleSave} onDelete={handleDelete} />
        </>
      )}
    </div>
  )
}
