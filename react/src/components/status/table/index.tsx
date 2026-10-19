import { useId, useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { Select } from '../../ui/select'
import { SortableColumn } from '../../ui/list-controls'
import type { Status, StatusInput } from '../../../types/status'
import './styles.css'

interface StatusTableProps {
  items: Status[]
  ordering: string
  onSort: (field: string) => void
  onSave: (id: number, dados: StatusInput) => Promise<void>
  onDelete: (item: Status) => Promise<void>
}

interface EditForm {
  nome: string
  ativo: boolean
}

export function StatusTable({ items, ordering, onSort, onSave, onDelete }: StatusTableProps) {
  const componentId = useId()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState<EditForm>({ nome: '', ativo: true })
  const isBusy = pendingId !== null

  function startEditing(item: Status) {
    if (isBusy || editingId !== null) return
    setError('')
    setForm({ nome: item.nome, ativo: item.ativo })
    setEditingId(item.id)
  }

  function cancelEditing() {
    if (isBusy) return
    setEditingId(null)
    setError('')
  }

  async function handleSave(id: number) {
    if (isBusy) return
    if (!form.nome.trim()) {
      setError('Informe o nome.')
      return
    }
    setPendingId(id)
    setError('')
    try {
      await onSave(id, { nome: form.nome.trim(), ativo: form.ativo })
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o registro.')
    } finally {
      setPendingId(null)
    }
  }

  async function handleDelete(item: Status) {
    if (isBusy || editingId !== null) return
    const confirmed = window.confirm(
      `Excluir status: ${item.nome}?\n\n` +
      'Registros vinculados não podem ser excluídos. Nesse caso, prefira inativar.\n\n' +
      'A exclusão não pode ser desfeita pela interface.',
    )
    if (!confirmed) return
    setPendingId(item.id)
    setError('')
    try {
      await onDelete(item)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível excluir o registro.')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="status-table-wrapper">
      {error && <p className="status-table__error" role="alert">{error}</p>}
      <div className="status-table__scroll" role="region"
        aria-label="Tabela de status" tabIndex={0} aria-busy={isBusy}>
        <table className="status-table">
          <caption className="status-table__sr-only">Tabela de status</caption>
          <thead>
            <tr>
              <th scope="col"><SortableColumn field="nome" label="Nome" ordering={ordering} onSort={onSort} /></th>
              <th scope="col"><SortableColumn field="ativo" label="Situação" ordering={ordering} onSort={onSort} /></th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isEditing = editingId === item.id
              const selectId = `${componentId}-${item.id}-ativo`
              return (
                <tr key={item.id}>
                  <td>
                    {isEditing ? (
                      <input className="status-table__input" aria-label="Nome"
                        value={form.nome} maxLength={100} disabled={isBusy}
                        onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))} />
                    ) : <span className="status-table__name">{item.nome}</span>}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="status-table__select">
                        <label className="status-table__sr-only" htmlFor={selectId}>Situação</label>
                        <Select id={selectId} value={form.ativo ? 'ativo' : 'inativo'}
                          onValueChange={(value) => setForm((current) => ({ ...current, ativo: value === 'ativo' }))}
                          options={[{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }]}
                          disabled={isBusy} />
                      </div>
                    ) : (
                      <span className={`status-table__badge ${item.ativo ? 'status-table__badge--active' : ''}`}>
                        {item.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="status-table__actions">
                      {isEditing ? (
                        <>
                          <button className="status-table__action" type="button" disabled={isBusy}
                            onClick={() => void handleSave(item.id)}>
                            <Check size={16} aria-hidden="true" />
                          </button>
                          <button className="status-table__action" type="button" disabled={isBusy} onClick={cancelEditing}>
                            <X size={16} aria-hidden="true" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="status-table__action" type="button"
                            disabled={isBusy || editingId !== null} onClick={() => startEditing(item)}>
                            <Pencil size={16} aria-hidden="true" />
                          </button>
                          <button className="status-table__action status-table__action--danger" type="button"
                            disabled={isBusy || editingId !== null} onClick={() => void handleDelete(item)}>
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
