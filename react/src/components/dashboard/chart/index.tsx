import { useId, useState } from 'react'
import { ArrowDownWideNarrow, ArrowUpAZ, X } from 'lucide-react'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { DashboardGroup } from '../../../types/dashboard'

import './styles.css'

type ChartVariant =
  | 'columns'
  | 'bars'
  | 'donut'
  | 'pie'
  | 'semi-donut'

interface DashboardChartProps {
  title: string
  description: string
  data: DashboardGroup[]
  variant?: ChartVariant
}

const COLORS = [
  '#8b5cf6',
  '#38bdf8',
  '#34d399',
  '#fbbf24',
  '#fb7185',
  '#a78bfa',
  '#2dd4bf',
  '#fb923c',
  '#60a5fa',
  '#e879f9',
]

const numberFormatter = new Intl.NumberFormat('pt-BR')

function percentage(value: number, total: number): string {
  if (total === 0) {
    return '0%'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value / total)
}

export function DashboardChart({
  title,
  description,
  data,
  variant = 'bars',
}: DashboardChartProps) {
  const titleId = useId()

  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const [sortMode, setSortMode] =
    useState<'quantity' | 'name'>('quantity')

  const items = data.map((item, index) => ({
    ...item,
    chartKey: `${item.id ?? item.nome}-${index}`,
    color: COLORS[index % COLORS.length],
  }))

  const total = items.reduce(
    (sum, item) => sum + item.quantidade,
    0,
  )

  const selected = items.find(
    (item) => item.chartKey === selectedKey,
  )

  const hasSelection = Boolean(selected)

  const isCircular =
    variant === 'donut' ||
    variant === 'pie' ||
    variant === 'semi-donut'

  const sortedItems = [...items].sort((a, b) =>
    sortMode === 'name'
      ? a.nome.localeCompare(b.nome, 'pt-BR')
      : b.quantidade - a.quantidade ||
        a.nome.localeCompare(b.nome, 'pt-BR'),
  )

  const plottedItems = isCircular ? items : sortedItems

  const chartHeight =
    variant === 'bars'
      ? Math.max(260, items.length * 37 + 30)
      : 290

  function toggleSelection(key: string) {
    setSelectedKey((current) => current === key ? null : key)
  }

  const tooltip = (
    <Tooltip
      cursor={
        isCircular
          ? false
          : { fill: 'var(--color-surface-muted)' }
      }
      contentStyle={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgb(0 0 0 / 15%)',
        color: 'var(--color-text)',
        fontSize: '12px',
        padding: '10px 14px',
      }}
      labelStyle={{
        color: 'var(--color-text)',
        marginBottom: '4px',
      }}
      itemStyle={{
        color: 'var(--color-text)',
      }}
      formatter={(value) => [
        `${numberFormatter.format(Number(value ?? 0))} · ${
          percentage(Number(value ?? 0), total)
        }`,
        'Equipamentos',
      ]}
    />
  )

  return (
    <section
      className={`dashboard-chart dashboard-chart--${variant}`}
      aria-labelledby={titleId}
    >
      <header className="dashboard-chart__header">
        <div>
          <h2 id={titleId}>{title}</h2>
          <p>{description}</p>
        </div>

        <span className="dashboard-chart__total">
          {numberFormatter.format(total)}
        </span>
      </header>

      {!isCircular && total > 0 && (
        <div
          className="dashboard-chart__sort"
          role="group"
          aria-label="Ordenação do gráfico"
        >
          <button
            type="button"
            aria-pressed={sortMode === 'quantity'}
            onClick={() => setSortMode('quantity')}
          >
            <ArrowDownWideNarrow size={14} aria-hidden="true" />
            Quantidade
          </button>

          <button
            type="button"
            aria-pressed={sortMode === 'name'}
            onClick={() => setSortMode('name')}
          >
            <ArrowUpAZ size={14} aria-hidden="true" />
            Nome
          </button>
        </div>
      )}

      {total === 0 ? (
        <div className="dashboard-chart__empty">
          Nenhum equipamento para exibir.
        </div>
      ) : (
        <>
          <div
            className="dashboard-chart__canvas"
            style={{ height: chartHeight }}
          >
            <ResponsiveContainer width="100%" height="100%">
              {isCircular ? (
                <PieChart accessibilityLayer>
                  {tooltip}

                  <Pie
                    data={plottedItems}
                    dataKey="quantidade"
                    nameKey="nome"
                    cx="50%"
                    cy={variant === 'semi-donut' ? '75%' : '50%'}
                    innerRadius={
                      variant === 'pie' ? 0 : '57%'
                    }
                    outerRadius="83%"
                    startAngle={
                      variant === 'semi-donut' ? 180 : 90
                    }
                    endAngle={
                      variant === 'semi-donut' ? 0 : -270
                    }
                    paddingAngle={variant === 'pie' ? 1 : 3}
                    cornerRadius={variant === 'pie' ? 0 : 5}
                    stroke="var(--color-surface)"
                    strokeWidth={3}
                    isAnimationActive={false}
                  >
                    {plottedItems.map((item) => (
                      <Cell
                        key={item.chartKey}
                        fill={item.color}
                        fillOpacity={
                          hasSelection &&
                          selected?.chartKey !== item.chartKey
                            ? 0.25
                            : 1
                        }
                        onClick={() =>
                          toggleSelection(item.chartKey)
                        }
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              ) : (
                <BarChart
                  data={plottedItems}
                  layout={
                    variant === 'bars'
                      ? 'vertical'
                      : 'horizontal'
                  }
                  margin={{
                    top: 20,
                    right: 35,
                    bottom: 10,
                    left: 0,
                  }}
                  accessibilityLayer
                >
                  <CartesianGrid
                    horizontal={variant === 'columns'}
                    vertical={variant === 'bars'}
                    stroke="var(--color-border)"
                    strokeDasharray="3 5"
                  />

                  {variant === 'bars' ? (
                    <>
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'var(--color-text-subtle)',
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        type="category"
                        dataKey="nome"
                        width={145}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'var(--color-text-muted)',
                          fontSize: 11,
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <XAxis
                        type="category"
                        dataKey="nome"
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'var(--color-text-muted)',
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        type="number"
                        allowDecimals={false}
                        width={35}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'var(--color-text-subtle)',
                          fontSize: 11,
                        }}
                      />
                    </>
                  )}

                  {tooltip}

                  <Bar
                    dataKey="quantidade"
                    name="Equipamentos"
                    radius={
                      variant === 'bars'
                        ? [0, 7, 7, 0]
                        : [7, 7, 0, 0]
                    }
                    maxBarSize={variant === 'bars' ? 20 : 58}
                    isAnimationActive={false}
                  >
                    {plottedItems.map((item) => (
                      <Cell
                        key={item.chartKey}
                        fill={item.color}
                        fillOpacity={
                          hasSelection &&
                          selected?.chartKey !== item.chartKey
                            ? 0.25
                            : 1
                        }
                        onClick={() =>
                          toggleSelection(item.chartKey)
                        }
                        style={{ cursor: 'pointer' }}
                      />
                    ))}

                    <LabelList
                      dataKey="quantidade"
                      position={
                        variant === 'bars' ? 'right' : 'top'
                      }
                      fill="var(--color-text-muted)"
                      fontSize={11}
                    />
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>

            {(variant === 'donut' ||
              variant === 'semi-donut') && (
              <div className="dashboard-chart__center">
                <strong>
                  {numberFormatter.format(
                    selected?.quantidade ?? total,
                  )}
                </strong>

                <span>
                  {selected ? 'selecionados' : 'equipamentos'}
                </span>
              </div>
            )}
          </div>

          <div
            className="dashboard-chart__selection"
            aria-live="polite"
          >
            {selected ? (
              <>
                <span>
                  {selected.nome}: {' '}
                  {numberFormatter.format(selected.quantidade)}
                  {' '}· {percentage(selected.quantidade, total)}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedKey(null)}
                  aria-label="Limpar destaque"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </>
            ) : (
              <span>
                Clique em uma categoria para destacar.
              </span>
            )}
          </div>

          <div
            className="dashboard-chart__legend"
            role="group"
            aria-label={`Categorias de ${title}`}
          >
            {plottedItems.map((item) => (
              <button
                key={item.chartKey}
                type="button"
                className="dashboard-chart__legend-item"
                aria-pressed={
                  selected?.chartKey === item.chartKey
                }
                onClick={() => toggleSelection(item.chartKey)}
              >
                <span
                  className="dashboard-chart__swatch"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />

                <span className="dashboard-chart__legend-name">
                  {item.nome}
                </span>

                <span className="dashboard-chart__legend-value">
                  {numberFormatter.format(item.quantidade)}
                </span>

                <span className="dashboard-chart__legend-percent">
                  {percentage(item.quantidade, total)}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}