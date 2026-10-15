import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

import { RegistroTable } from '../../components/registros/table'
import { listarRegistros } from '../../services/registros/registros.service'

import type { RegistrosList } from '../../types/registro'

import './styles.css'

export function RegistrosPage() {
  const [listagem, setListagem] = useState<RegistrosList>({
    items: [],
    total: 0,
    hasNextPage: false,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function carregarRegistros() {
      setIsLoading(true)
      setError('')

      try {
        const data = await listarRegistros(controller.signal)

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
            : 'Não foi possível carregar os registros de auditoria.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void carregarRegistros()

    return () => {
      controller.abort()
    }
  }, [reloadKey])

  function handleRefresh() {
    setReloadKey((value) => value + 1)
  }

  return (
    <div className="registros-page">
      <div className="registros-page__toolbar">
        <p className="registros-page__count" aria-live="polite">
          {isLoading
            ? 'Carregando registros...'
            : error
              ? 'Listagem indisponível'
              : `${listagem.items.length} de ${listagem.total} registros`}
        </p>

        <button
          className="registros-page__refresh"
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw size={16} aria-hidden="true" />

          <span>
            {error ? 'Tentar novamente' : 'Atualizar'}
          </span>
        </button>
      </div>

      {isLoading ? (
        <div className="registros-page__message" role="status">
          Buscando os registros de auditoria...
        </div>
      ) : error ? (
        <div
          className="registros-page__message registros-page__message--error"
          role="alert"
        >
          {error}
        </div>
      ) : listagem.items.length === 0 ? (
        <div className="registros-page__message">
          Nenhum registro de auditoria encontrado.
        </div>
      ) : (
        <>
          <RegistroTable registros={listagem.items} />

          {listagem.hasNextPage && (
            <p className="registros-page__pagination-note">
              A API retornou apenas a primeira página. Existem mais
              registros; os controles de paginação ainda serão implementados.
            </p>
          )}
        </>
      )}
    </div>
  )
}