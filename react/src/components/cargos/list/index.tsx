import { useEffect, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { CargoTable } from '../table'
import {
  listarCargo,
  atualizarCargo,
  excluirCargo,
} from '../../../services/cargos/cargos.service'
import type { Cargo, CargoInput, CargoListagem } from '../../../types/cargos'
import './styles.css'

interface CargoListProps {
  onAdd: () => void
}

export function CargoList({ onAdd }: CargoListProps) {
  const [listagem, setListagem] = useState<CargoListagem>({
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
        const data = await listarCargo(controller.signal)
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
  }, [reloadKey])

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
      <div className="cargos-list__toolbar">
        <p className="cargos-list__count" aria-live="polite">
          {isLoading ? 'Carregando...' : error ? 'Listagem indisponível'
            : `${listagem.items.length} de ${listagem.total} registros`}
        </p>
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
          <CargoTable items={listagem.items} onSave={handleSave} onDelete={handleDelete} />
          {listagem.hasNextPage && (
            <p className="cargos-list__hint">
              A API retornou apenas a primeira página. Existem mais registros;
              os controles de paginação ainda serão implementados.
            </p>
          )}
        </>
      )}
    </div>
  )
}
