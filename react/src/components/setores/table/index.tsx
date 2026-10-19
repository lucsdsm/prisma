import { useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'

import { Select } from '../../ui/select'
import { SortableColumn } from '../../ui/list-controls'

import type {
  Setor,
  SetorInput,
} from '../../../types/setor'

import './styles.css'

interface SetorTableProps {
  setores: Setor[]
  ordering: string
  onSort: (field: string) => void
  onSave: (id: number, dados: SetorInput) => Promise<void>
  onDelete: (setor: Setor) => Promise<void>
}

interface EditForm {
  nome: string
  ativo: boolean
}

export function SetorTable({
  setores,
  ordering,
  onSort,
  onSave,
  onDelete,
}: SetorTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState<EditForm>({
    nome: '',
    ativo: true,
  })

  const isBusy = pendingId !== null

  function startEditing(setor: Setor) {
    if (isBusy || editingId !== null) {
      return
    }

    setError('')
    setEditingId(setor.id)

    setForm({
      nome: setor.nome,
      ativo: setor.ativo,
    })
  }

  function cancelEditing() {
    if (isBusy) {
      return
    }

    setEditingId(null)
    setError('')
  }

  async function handleSave(id: number) {
    if (isBusy) {
      return
    }

    if (!form.nome.trim()) {
      setError('Informe o nome do setor.')
      return
    }

    setPendingId(id)
    setError('')

    try {
      await onSave(id, {
        nome: form.nome.trim(),
        ativo: form.ativo,
      })

      setEditingId(null)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar o setor.',
      )
    } finally {
      setPendingId(null)
    }
  }

  async function handleDelete(setor: Setor) {
    if (isBusy || editingId !== null) {
      return
    }

    const confirmed = window.confirm(
      `Excluir o setor ${setor.nome}?\n\n` +
        'Setores com funcionários vinculados não podem ser excluídos. ' +
        'Se deseja preservar o cadastro, prefira marcar como inativo.\n\n' +
        'A exclusão não pode ser desfeita pela interface.',
    )

    if (!confirmed) {
      return
    }

    setPendingId(setor.id)
    setError('')

    try {
      await onDelete(setor)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível excluir o setor.',
      )
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="setor-table-wrapper">
      {error && (
        <p className="setor-table__error" role="alert">
          {error}
        </p>
      )}

      <div
        className="setor-table__scroll"
        role="region"
        aria-label="Tabela de setores"
        tabIndex={0}
        aria-busy={isBusy}
      >
        <table className="setor-table">
          <caption className="setor-table__sr-only">
            Setores cadastrados
          </caption>

          <thead>
            <tr>
              <th scope="col"><SortableColumn field="nome" label="Nome" ordering={ordering} onSort={onSort} /></th>
              <th scope="col"><SortableColumn field="ativo" label="Situação" ordering={ordering} onSort={onSort} /></th>
              <th scope="col">Ações</th>
            </tr>
          </thead>

          <tbody>
            {setores.map((setor) => {
              const isEditing = editingId === setor.id

              return (
                <tr key={setor.id}>
                  <td>
                    {isEditing ? (
                      <input
                        className="setor-table__input"
                        aria-label="Nome do setor"
                        value={form.nome}
                        maxLength={150}
                        disabled={isBusy}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            nome: event.target.value,
                          }))
                        }
                      />
                    ) : (
                      <span className="setor-table__name">
                        {setor.nome}
                      </span>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <div className="setor-table__select">
                        <label
                          className="setor-table__sr-only"
                          htmlFor={`setor-${setor.id}-ativo`}
                        >
                          Situação do setor
                        </label>

                        <Select
                          id={`setor-${setor.id}-ativo`}
                          value={form.ativo ? 'ativo' : 'inativo'}
                          onValueChange={(value) =>
                            setForm((current) => ({
                              ...current,
                              ativo: value === 'ativo',
                            }))
                          }
                          options={[
                            { value: 'ativo', label: 'Ativo' },
                            { value: 'inativo', label: 'Inativo' },
                          ]}
                          disabled={isBusy}
                        />
                      </div>
                    ) : (
                      <span
                        className={`setor-table__badge ${
                          setor.ativo
                            ? 'setor-table__badge--active'
                            : ''
                        }`}
                      >
                        {setor.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="setor-table__actions">
                      {isEditing ? (
                        <>
                          <button
                            className="setor-table__action"
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleSave(setor.id)}
                          >
                            <Check size={16} aria-hidden="true" />
                          </button>

                          <button
                            className="setor-table__action"
                            type="button"
                            disabled={isBusy}
                            onClick={cancelEditing}
                          >
                            <X size={16} aria-hidden="true" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="setor-table__action"
                            type="button"
                            disabled={isBusy || editingId !== null}
                            onClick={() => startEditing(setor)}
                          >
                            <Pencil size={16} aria-hidden="true" />
                            
                          </button>

                          <button
                            className="setor-table__action setor-table__action--danger"
                            type="button"
                            disabled={isBusy || editingId !== null}
                            onClick={() => void handleDelete(setor)}
                          >
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