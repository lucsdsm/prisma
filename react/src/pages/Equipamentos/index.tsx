import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

import { EquipamentoTable } from '../../components/equipamentos/table'
import {
  listarEquipamentos,
  atualizarEquipamento,
  excluirEquipamento,
  type EquipamentoInlineUpdate,
} from '../../services/equipamentos.service'

import type { Equipamento, EquipamentosList } from '../../types/equipamento'

import './styles.css'

export function EquipamentosPage() {
  const [listagem, setListagem] = useState<EquipamentosList>({
    items: [],
    total: 0,
    hasNextPage: false,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function carregarEquipamentos() {
      setIsLoading(true)
      setError('')

      try {
        const data = await listarEquipamentos(controller.signal)

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
  }, [reloadKey])

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
      <div className="equipamentos-page__toolbar">
        <p className="equipamentos-page__count" aria-live="polite">
          {isLoading
            ? 'Carregando equipamentos...'
            : error
              ? 'Listagem indisponível'
              : `${listagem.items.length} de ${listagem.total} equipamentos`}
        </p>

        <button
          className="equipamentos-page__refresh"
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw size={16} aria-hidden="true" />
          <span>{error ? 'Tentar novamente' : 'Atualizar'}</span>
        </button>
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
          <EquipamentoTable equipamentos={listagem.items} onSave={handleSave} onDelete={handleDelete} />

          {listagem.hasNextPage && (
            <p className="equipamentos-page__pagination-note">
              A API retornou apenas a primeira página. Existem outros
              equipamentos; os controles de paginação ainda serão implementados.
            </p>
          )}
        </>
      )}
    </div>
  )
}