import { useId, useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { Select } from '../../ui/select'
import type { Tipo, TipoInput } from '../../../types/tipos'
import './styles.css'

interface TipoTableProps {
  items: Tipo[]
  onSave: (id: number, dados: TipoInput) => Promise<void>
  onDelete: (item: Tipo) => Promise<void>
}

interface EditForm {
  nome: string
  ordem: string
  ativo: boolean
}

export function TipoTable({ items, onSave, onDelete }: TipoTableProps) {
  const componentId = useId()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState<EditForm>({ nome: '', ordem: '0', ativo: true })
  const isBusy = pendingId !== null

  function startEditing(item: Tipo) {
    if (isBusy || editingId !== null) return
    setError('')
    setForm({ nome: item.nome, ordem: String(item.ordem), ativo: item.ativo })
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
    const ordem = Number(form.ordem)
    if (form.ordem.trim() === '' || !Number.isInteger(ordem) || ordem < 0 || ordem > 32767) {
      setError('Informe uma ordem inteira entre 0 e 32767.')
      return
    }
    setPendingId(id)
    setError('')
    try {
      await onSave(id, { nome: form.nome.trim(), ordem, ativo: form.ativo })
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o registro.')
    } finally {
      setPendingId(null)
    }
  }

  async function handleDelete(item: Tipo) {
    if (isBusy || editingId !== null) return
    const confirmed = window.confirm(
      `Excluir tipo de equipamento: ${item.nome}?\n\n` +
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
    <div className="tipos-table-wrapper">
      {error && <p className="tipos-table__error" role="alert">{error}</p>}
      <div className="tipos-table__scroll" role="region"
        aria-label="Tabela de tipos de equipamento" tabIndex={0} aria-busy={isBusy}>
        <table className="tipos-table">
          <caption className="tipos-table__sr-only">Tabela de tipos de equipamento</caption>
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Ordem</th>
              <th scope="col">Situação</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isEditing = editingId === item.id
              const isPending = pendingId === item.id
              const selectId = `${componentId}-${item.id}-ativo`
              return (
                <tr key={item.id}>
                  <td>
                    {isEditing ? (
                      <input className="tipos-table__input" aria-label="Nome"
                        value={form.nome} maxLength={100} disabled={isBusy}
                        onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))} />
                    ) : <span className="tipos-table__name">{item.nome}</span>}
                  </td>
                  <td>
                    {isEditing ? (
                      <input className="tipos-table__input tipos-table__input--order"
                        aria-label="Ordem" type="number" min={0} max={32767} step={1}
                        value={form.ordem} disabled={isBusy}
                        onChange={(event) => setForm((current) => ({ ...current, ordem: event.target.value }))} />
                    ) : item.ordem}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="tipos-table__select">
                        <label className="tipos-table__sr-only" htmlFor={selectId}>Situação</label>
                        <Select id={selectId} value={form.ativo ? 'ativo' : 'inativo'}
                          onValueChange={(value) => setForm((current) => ({ ...current, ativo: value === 'ativo' }))}
                          options={[{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }]}
                          disabled={isBusy} />
                      </div>
                    ) : (
                      <span className={`tipos-table__badge ${item.ativo ? 'tipos-table__badge--active' : ''}`}>
                        {item.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="tipos-table__actions">
                      {isEditing ? (
                        <>
                          <button className="tipos-table__action" type="button" disabled={isBusy}
                            onClick={() => void handleSave(item.id)}>
                            <Check size={16} aria-hidden="true" />{isPending ? 'Salvando...' : 'Salvar'}
                          </button>
                          <button className="tipos-table__action" type="button" disabled={isBusy} onClick={cancelEditing}>
                            <X size={16} aria-hidden="true" />Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="tipos-table__action" type="button"
                            disabled={isBusy || editingId !== null} onClick={() => startEditing(item)}>
                            <Pencil size={16} aria-hidden="true" />Editar
                          </button>
                          <button className="tipos-table__action tipos-table__action--danger" type="button"
                            disabled={isBusy || editingId !== null} onClick={() => void handleDelete(item)}>
                            <Trash2 size={16} aria-hidden="true" />{isPending ? 'Excluindo...' : 'Excluir'}
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
