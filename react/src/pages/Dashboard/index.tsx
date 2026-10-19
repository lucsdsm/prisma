import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

import { DashboardChart } from '../../components/dashboard/chart'
import { carregarDashboard } from '../../services/dashboard/dashboard.service'

import type { DashboardData } from '../../types/dashboard'

import './styles.css'

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function carregar() {
      setIsLoading(true)
      setError('')

      try {
        const response = await carregarDashboard(controller.signal)

        if (!controller.signal.aborted) {
          setData(response)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Não foi possível carregar a dashboard.',
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void carregar()

    return () => controller.abort()
  }, [reloadKey])

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__toolbar">
        <p className="dashboard-page__summary" aria-live="polite">
          {isLoading
            ? 'Carregando indicadores...'
            : error
              ? 'Indicadores indisponíveis'
              : `${data?.total_equipamentos ?? 0} equipamentos cadastrados`}
        </p>

        <button
          className="dashboard-page__refresh"
          type="button"
          onClick={() => setReloadKey((value) => value + 1)}
          disabled={isLoading}
        >
          <RefreshCw size={16} aria-hidden="true" />
          {error ? 'Tentar novamente' : 'Atualizar'}
        </button>
      </div>

      {isLoading ? (
        <div className="dashboard-page__message" role="status">
          Preparando os gráficos...
        </div>
      ) : error ? (
        <div className="dashboard-page__error" role="alert">
          {error}
        </div>
      ) : data ? (
        <>
          <div className="dashboard-page__grid">
            <DashboardChart
                title="Composição do inventário"
                description="Quantidade de equipamentos por tipo."
                data={data.por_tipo}
                variant="columns"
            />

            <DashboardChart
                title="Propriedade dos equipamentos"
                description="Participação de cada classificação no total do inventário."
                data={data.por_propriedade}
                variant="donut"
            />

            <DashboardChart
                title="Situação dos equipamentos"
                description="Distribuição conforme o status cadastrado."
                data={data.por_status}
                variant="pie"
            />

            <DashboardChart
                title="Vínculo com responsáveis"
                description="Composição entre equipamentos com e sem funcionário associado."
                data={data.por_responsabilidade}
                variant="semi-donut"
            />

            <DashboardChart
                title="Distribuição por setor"
                description="Quantidade por setor do responsável atual."
                data={data.por_setor}
                variant="bars"
            />

            <DashboardChart
                title="Marcas do inventário"
                description="Quantidade de equipamentos por marca cadastrada."
                data={data.por_marca}
                variant="bars"
            />
            </div>

          <p className="dashboard-page__updated">
            Atualizado em{' '}
            <time dateTime={data.gerado_em}>
              {new Date(data.gerado_em).toLocaleString('pt-BR')}
            </time>
          </p>
        </>
      ) : null}
    </div>
  )
}