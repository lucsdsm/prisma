import { useEffect, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { ListControls, ListPagination } from '../../ui/list-controls'

import { FuncionarioTable } from '../table'

import {
  listarFuncionarios,
  atualizarFuncionario,
  excluirFuncionario,
} from '../../../services/funcionarios/funcionarios.service'

import type {
  Funcionario,
  FuncionarioInput,
  FuncionariosList,
} from '../../../types/funcionario'
import { INITIAL_LIST_QUERY, type ListQuery } from '../../../types/listagem'

import './styles.css'

interface FuncionarioListProps {
  onAdd: () => void
}

export function FuncionarioList({
  onAdd,
}: FuncionarioListProps) {
  const [listagem, setListagem] = useState<FuncionariosList>({
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

    async function carregarFuncionarios() {
      setIsLoading(true)
      setError('')

      try {
        const data = await listarFuncionarios(query, controller.signal)

        if (!controller.signal.aborted) {
          setListagem(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Não foi possível carregar os funcionários.',
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void carregarFuncionarios()

    return () => controller.abort()
  }, [reloadKey, query])

  function updateQuery(changes: Partial<ListQuery>) {
    setQuery((current) => ({ ...current, ...changes }))
  }

  async function handleSave(
    id: number,
    dados: FuncionarioInput,
  ): Promise<void> {
    const atualizado = await atualizarFuncionario(id, dados)

    setListagem((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? atualizado : item,
      ),
    }))
  }

  async function handleDelete(
    funcionario: Funcionario,
  ): Promise<void> {
    await excluirFuncionario(funcionario.id)

    setListagem((current) => ({
      ...current,
      items: current.items.filter(
        (item) => item.id !== funcionario.id,
      ),
      total: Math.max(0, current.total - 1),
    }))
  }

  return (
    <div className="funcionarios-list">
      <div className="funcionarios-list__toolbar list-toolbar">
        <div className="list-toolbar__leading">
        <p className="funcionarios-list__count" aria-live="polite">
          {isLoading
            ? 'Carregando funcionários...'
            : error
              ? 'Listagem indisponível'
              : `${listagem.items.length} de ${listagem.total} funcionários`}
        </p>

        <ListControls query={query} isLoading={isLoading}
          onSearchChange={(search) => updateQuery({ search, page: 1 })} />
        </div>
        <ListPagination query={query} totalPages={listagem.totalPages} isLoading={isLoading} onPageChange={(page) => updateQuery({ page })} />
        <div className="funcionarios-list__actions">
          <button
            className="funcionarios-list__refresh"
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            disabled={isLoading}
          >
            <RefreshCw size={16} aria-hidden="true" />
            {error ? 'Tentar novamente' : 'Atualizar'}
          </button>

          <button
            className="funcionarios-list__add"
            type="button"
            onClick={onAdd}
            disabled={isLoading}
          >
            <Plus size={16} aria-hidden="true" />
            Adicionar funcionário
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="funcionarios-list__message" role="status">
          Buscando os funcionários cadastrados...
        </div>
      ) : error ? (
        <div
          className="funcionarios-list__message funcionarios-list__message--error"
          role="alert"
        >
          {error}
        </div>
      ) : listagem.items.length === 0 ? (
        <div className="funcionarios-list__message">
          Nenhum funcionário cadastrado.
        </div>
      ) : (
        <>
          <FuncionarioTable ordering={query.ordering} onSort={(field) => updateQuery({ ordering: query.ordering === field ? `-${field}` : field, page: 1 })}
            funcionarios={listagem.items}
            onSave={handleSave}
            onDelete={handleDelete}
          />

        </>
      )}
    </div>
  )
}