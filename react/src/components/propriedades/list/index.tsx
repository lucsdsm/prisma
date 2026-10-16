import { useEffect, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { PropriedadeTable } from '../table'
import {
  listarPropriedade,
  atualizarPropriedade,
  excluirPropriedade,
} from '../../../services/propriedades/propriedades.service'
import type { Propriedade, PropriedadeInput, PropriedadeListagem } from '../../../types/propriedades'
import './styles.css'

interface PropriedadeListProps {
  onAdd: () => void
}

export function PropriedadeList({ onAdd }: PropriedadeListProps) {
  const [listagem, setListagem] = useState<PropriedadeListagem>({
    items: [], total: 0, hasNextPage: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function carregar() {
      setIsLoading(true)
      setError('')
      try {
        const data = await listarPropriedade(controller.signal)
        if (!controller.signal.aborted) setListagem(data)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar propriedades.')
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void carregar()
    return () => controller.abort()
  }, [reloadKey])

  async function handleSave(id: number, dados: PropriedadeInput): Promise<void> {
    const atualizado = await atualizarPropriedade(id, dados)
    setListagem((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id ? atualizado : item),
    }))
  }

  async function handleDelete(item: Propriedade): Promise<void> {
    await excluirPropriedade(item.id)
    setListagem((current) => ({
      ...current,
      items: current.items.filter((registro) => registro.id !== item.id),
      total: Math.max(0, current.total - 1),
    }))
  }

  return (
    <div className="propriedades-list">
      <div className="propriedades-list__toolbar">
        <p className="propriedades-list__count" aria-live="polite">
          {isLoading ? 'Carregando...' : error ? 'Listagem indisponível'
            : `${listagem.items.length} de ${listagem.total} registros`}
        </p>
        <div className="propriedades-list__actions">
          <button className="propriedades-list__refresh" type="button"
            onClick={() => setReloadKey((value) => value + 1)} disabled={isLoading}>
            <RefreshCw size={16} aria-hidden="true" />
            {error ? 'Tentar novamente' : 'Atualizar'}
          </button>
          <button className="propriedades-list__add" type="button" onClick={onAdd} disabled={isLoading}>
            <Plus size={16} aria-hidden="true" />
            Adicionar propriedade
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="propriedades-list__message" role="status">Buscando os registros...</div>
      ) : error ? (
        <div className="propriedades-list__error" role="alert">{error}</div>
      ) : listagem.items.length === 0 ? (
        <div className="propriedades-list__message">Nenhum registro encontrado.</div>
      ) : (
        <>
          <PropriedadeTable items={listagem.items} onSave={handleSave} onDelete={handleDelete} />
          {listagem.hasNextPage && (
            <p className="propriedades-list__hint">
              A API retornou apenas a primeira página. Existem mais registros;
              os controles de paginação ainda serão implementados.
            </p>
          )}
        </>
      )}
    </div>
  )
}
