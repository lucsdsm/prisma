import { useEffect, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { ListControls, ListPagination } from '../../ui/list-controls'

import { SetorTable } from '../table'

import {
  listarSetores,
  atualizarSetor,
  excluirSetor,
} from '../../../services/setores/setores.service'

import type {
  Setor,
  SetorInput,
  SetoresList,
} from '../../../types/setor'
import { INITIAL_LIST_QUERY, type ListQuery } from '../../../types/listagem'

import './styles.css'

interface SetorListProps {
  onAdd: () => void
}

export function SetorList({ onAdd }: SetorListProps) {
  const [listagem, setListagem] = useState<SetoresList>({
    items: [],
    total: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    currentPage: 1,
    totalPages: 1,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState<ListQuery>(INITIAL_LIST_QUERY)

  useEffect(() => {
    const controller = new AbortController()

    async function carregarSetores() {
      setIsLoading(true)
      setError('')

      try {
        const data = await listarSetores(query, controller.signal)

        if (!controller.signal.aborted) {
          setListagem(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Não foi possível carregar os setores.',
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void carregarSetores()

    return () => controller.abort()
  }, [reloadKey, query])

  function updateQuery(changes: Partial<ListQuery>) {
    setQuery((current) => ({ ...current, ...changes }))
  }

  async function handleSave(
    id: number,
    dados: SetorInput,
  ): Promise<void> {
    const atualizado = await atualizarSetor(id, dados)

    setListagem((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? atualizado : item,
      ),
    }))
  }

  async function handleDelete(setor: Setor): Promise<void> {
    await excluirSetor(setor.id)

    setListagem((current) => ({
      ...current,
      items: current.items.filter(
        (item) => item.id !== setor.id,
      ),
      total: Math.max(0, current.total - 1),
    }))
  }

  return (
    <div className="setores-list">
      <div className="setores-list__toolbar list-toolbar">
        <div className="list-toolbar__leading">
        <p className="setores-list__count" aria-live="polite">
          {isLoading
            ? 'Carregando setores...'
            : error
              ? 'Listagem indisponível'
              : `${listagem.items.length} de ${listagem.total} setores`}
        </p>

        <ListControls query={query} isLoading={isLoading}
          onSearchChange={(search) => updateQuery({ search, page: 1 })} />
        </div>
        <ListPagination query={query} totalPages={listagem.totalPages} isLoading={isLoading} onPageChange={(page) => updateQuery({ page })} />
        <div className="setores-list__actions">
          <button
            className="setores-list__refresh"
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            disabled={isLoading}
          >
            <RefreshCw size={16} aria-hidden="true" />
            {error ? 'Tentar novamente' : 'Atualizar'}
          </button>

          <button
            className="setores-list__add"
            type="button"
            onClick={onAdd}
            disabled={isLoading}
          >
            <Plus size={16} aria-hidden="true" />
            Adicionar setor
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="setores-list__message" role="status">
          Buscando os setores cadastrados...
        </div>
      ) : error ? (
        <div
          className="setores-list__message setores-list__message--error"
          role="alert"
        >
          {error}
        </div>
      ) : listagem.items.length === 0 ? (
        <div className="setores-list__message">
          Nenhum setor cadastrado.
        </div>
      ) : (
        <>
          <SetorTable ordering={query.ordering} onSort={(field) => updateQuery({ ordering: query.ordering === field ? `-${field}` : field, page: 1 })}
            setores={listagem.items}
            onSave={handleSave}
            onDelete={handleDelete}
          />

        </>
      )}
    </div>
  )
}