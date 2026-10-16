import { useEffect, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { TipoTable } from '../table'
import {
  listarTipo,
  atualizarTipo,
  excluirTipo,
} from '../../../services/tipos/tipos.service'
import type { Tipo, TipoInput, TipoListagem } from '../../../types/tipos'
import './styles.css'

interface TipoListProps {
  onAdd: () => void
}

export function TipoList({ onAdd }: TipoListProps) {
  const [listagem, setListagem] = useState<TipoListagem>({
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
        const data = await listarTipo(controller.signal)
        if (!controller.signal.aborted) setListagem(data)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar tipos de equipamento.')
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void carregar()
    return () => controller.abort()
  }, [reloadKey])

  async function handleSave(id: number, dados: TipoInput): Promise<void> {
    const atualizado = await atualizarTipo(id, dados)
    setListagem((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id ? atualizado : item),
    }))
  }

  async function handleDelete(item: Tipo): Promise<void> {
    await excluirTipo(item.id)
    setListagem((current) => ({
      ...current,
      items: current.items.filter((registro) => registro.id !== item.id),
      total: Math.max(0, current.total - 1),
    }))
  }

  return (
    <div className="tipos-list">
      <div className="tipos-list__toolbar">
        <p className="tipos-list__count" aria-live="polite">
          {isLoading ? 'Carregando...' : error ? 'Listagem indisponível'
            : `${listagem.items.length} de ${listagem.total} registros`}
        </p>
        <div className="tipos-list__actions">
          <button className="tipos-list__refresh" type="button"
            onClick={() => setReloadKey((value) => value + 1)} disabled={isLoading}>
            <RefreshCw size={16} aria-hidden="true" />
            {error ? 'Tentar novamente' : 'Atualizar'}
          </button>
          <button className="tipos-list__add" type="button" onClick={onAdd} disabled={isLoading}>
            <Plus size={16} aria-hidden="true" />
            Adicionar tipo
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="tipos-list__message" role="status">Buscando os registros...</div>
      ) : error ? (
        <div className="tipos-list__error" role="alert">{error}</div>
      ) : listagem.items.length === 0 ? (
        <div className="tipos-list__message">Nenhum registro encontrado.</div>
      ) : (
        <>
          <TipoTable items={listagem.items} onSave={handleSave} onDelete={handleDelete} />
          {listagem.hasNextPage && (
            <p className="tipos-list__hint">
              A API retornou apenas a primeira página. Existem mais registros;
              os controles de paginação ainda serão implementados.
            </p>
          )}
        </>
      )}
    </div>
  )
}
