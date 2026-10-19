import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Search } from 'lucide-react'
import type { ListQuery } from '../../../types/listagem'
import './styles.css'

interface ListControlsProps {
  query: ListQuery
  isLoading: boolean
  onSearchChange: (value: string) => void
}

export function ListControls({
  query,
  isLoading,
  onSearchChange,
}: ListControlsProps) {
  return (
    <div className="list-controls">
      <label className="list-controls__search">
        <Search size={16} aria-hidden="true" />
        <span className="list-controls__sr-only">Filtrar registros</span>
        <input
          type="search"
          value={query.search}
          placeholder="Filtrar registros..."
          onChange={(event) => onSearchChange(event.target.value)}
          aria-busy={isLoading}
        />
      </label>
    </div>
  )
}

interface ListPaginationProps {
  query: ListQuery
  totalPages: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

export function ListPagination({
  query,
  totalPages,
  isLoading,
  onPageChange,
}: ListPaginationProps) {
  return totalPages > 1 ? (
    <div className="list-controls__pagination" aria-label="Paginação">
      <button type="button" onClick={() => onPageChange(query.page - 1)}
        disabled={isLoading || query.page <= 1} aria-label="Página anterior">
        <ArrowLeft size={16} aria-hidden="true" />
      </button>
      <span>Página {query.page} de {totalPages}</span>
      <button type="button" onClick={() => onPageChange(query.page + 1)}
        disabled={isLoading || query.page >= totalPages} aria-label="Próxima página">
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
  ) : null
}

interface SortableColumnProps {
  field: string
  label: string
  ordering: string
  disabled?: boolean
  onSort: (field: string) => void
}

export function SortableColumn({
  field,
  label,
  ordering,
  disabled = false,
  onSort,
}: SortableColumnProps) {
  const isActive = ordering === field || ordering === `-${field}`
  const isDescending = ordering === `-${field}`

  return (
    <button className="list-controls__column-sort" type="button"
      onClick={() => onSort(field)} disabled={disabled}
      aria-label={`Ordenar por ${label} ${isDescending ? 'crescente' : 'decrescente'}`}>
      <span>{label}</span>
      {isActive && (isDescending ? <ArrowDown size={14} aria-hidden="true" /> : <ArrowUp size={14} aria-hidden="true" />)}
    </button>
  )
}
