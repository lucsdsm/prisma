import { useEffect, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { ListControls, ListPagination } from '../../ui/list-controls'

import { EquipamentoTable } from '../table'
import {
  listarEquipamentos,
  atualizarEquipamento,
  excluirEquipamento,
  type EquipamentoInlineUpdate,
} from '../../../services/equipamentos/equipamentos.service'

import type { Equipamento, EquipamentosList } from '../../../types/equipamento'
import { INITIAL_LIST_QUERY, type ListQuery } from '../../../types/listagem'

import './styles.css'

interface EquipamentoListProps {
  onAdd: () => void
}

export function EquipamentoList({
  onAdd,
}: EquipamentoListProps) {
  const [listagem, setListagem] = useState<EquipamentosList>({
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
  const [query, setQuery] = useState<ListQuery>({
    ...INITIAL_LIST_QUERY,
    ordering: 'tipo__nome',
  })

  useEffect(() => {
    const controller = new AbortController()

    async function carregarEquipamentos() {
      setIsLoading(true)
      setError('')

      try {
        const data = await listarEquipamentos(query, controller.signal)

        if (!controller.signal.aborted) {
          setListagem(data)
        }
      } catch (err) {
        if (controller.signal.aborted) {
          return
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar os equipamentos.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void carregarEquipamentos()

    return () => {
      controller.abort()
    }
  }, [reloadKey, query])

  function updateQuery(changes: Partial<ListQuery>) {
    setQuery((current) => ({ ...current, ...changes }))
  }

  function handleRefresh() {
    setReloadKey((value) => value + 1)
  }

  async function handleSave(
    id: number,
    dados: EquipamentoInlineUpdate,
  ): Promise<void> {
    const equipamentoAtualizado = await atualizarEquipamento(id, dados)

    setListagem((current) => ({
      ...current,
      items: current.items.map((equipamento) =>
        equipamento.id === id
          ? equipamentoAtualizado
          : equipamento,
      ),
    }))
  }

  async function handleDelete(
    equipamento: Equipamento,
  ): Promise<void> {
    await excluirEquipamento(equipamento.id)

    setListagem((current) => ({
      ...current,
      items: current.items.filter(
        (item) => item.id !== equipamento.id,
      ),
      total: Math.max(0, current.total - 1),
    }))
  }

  return (
    <div className="equipamentos-page">
      <div className="equipamentos-page__toolbar list-toolbar">
        <div className="list-toolbar__leading">
        <p className="equipamentos-page__count" aria-live="polite">
          {isLoading
            ? 'Carregando equipamentos...'
            : error
              ? 'Listagem indisponível'
              : `${listagem.items.length} de ${listagem.total} equipamentos`}
        </p>

        <ListControls query={query} isLoading={isLoading}
          onSearchChange={(search) => updateQuery({ search, page: 1 })} />
        </div>
        <ListPagination query={query} totalPages={listagem.totalPages} isLoading={isLoading} onPageChange={(page) => updateQuery({ page })} />
        <div className="equipamentos-page__actions">
            <button
                className="equipamentos-page__refresh"
                type="button"
                onClick={handleRefresh}
                disabled={isLoading}
            >
                <RefreshCw size={16} aria-hidden="true" />
                <span>{error ? 'Tentar novamente' : 'Atualizar'}</span>
            </button>

            <button
                className="equipamentos-page__add"
                type="button"
                onClick={onAdd}
                disabled={isLoading}
            >
                <Plus size={16} aria-hidden="true" />
                <span>Adicionar equipamento</span>
            </button>
        </div>
      </div>

      {isLoading ? (
        <div className="equipamentos-page__message" role="status">
          Buscando os equipamentos cadastrados...
        </div>
      ) : error ? (
        <div
          className="equipamentos-page__message equipamentos-page__message--error"
          role="alert"
        >
          {error}
        </div>
      ) : listagem.items.length === 0 ? (
        <div className="equipamentos-page__message">
          Nenhum equipamento cadastrado.
        </div>
      ) : (
        <>
          <EquipamentoTable equipamentos={listagem.items} ordering={query.ordering} onSort={(field) => updateQuery({ ordering: query.ordering === field ? `-${field}` : field, page: 1 })} onSave={handleSave} onDelete={handleDelete} />

        </>
      )}
    </div>
  )
}