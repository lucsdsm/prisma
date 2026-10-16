import { useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'

import { Select } from '../../ui/select'

import type {
  Setor,
  SetorInput,
} from '../../../types/setor'

import './styles.css'

interface SetorTableProps {
  setores: Setor[]
  onSave: (id: number, dados: SetorInput) => Promise<void>
  onDelete: (setor: Setor) => Promise<void>
}

interface EditForm {
  nome: string
  ordem: string
  ativo: boolean
}

export function SetorTable({
  setores,
  onSave,
  onDelete,
}: SetorTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState<EditForm>({
    nome: '',
    ordem: '0',
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
      ordem: String(setor.ordem),
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

    const ordem = Number(form.ordem)

    if (
      form.ordem.trim() === '' ||
      !Number.isInteger(ordem) ||
      ordem < 0 ||
      ordem > 32767
    ) {
      setError('Informe uma ordem inteira entre 0 e 32767.')
      return
    }

    setPendingId(id)
    setError('')

    try {
      await onSave(id, {
        nome: form.nome.trim(),
        ordem,
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
              <th scope="col">Nome</th>
              <th scope="col">Ordem</th>
              <th scope="col">Situação</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>

          <tbody>
            {setores.map((setor) => {
              const isEditing = editingId === setor.id
              const isPending = pendingId === setor.id

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
                      <input
                        className="setor-table__input setor-table__input--order"
                        aria-label="Ordem do setor"
                        type="number"
                        min={0}
                        max={32767}
                        step={1}
                        value={form.ordem}
                        disabled={isBusy}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            ordem: event.target.value,
                          }))
                        }
                      />
                    ) : (
                      setor.ordem
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
                            {isPending ? 'Salvando...' : 'Salvar'}
                          </button>

                          <button
                            className="setor-table__action"
                            type="button"
                            disabled={isBusy}
                            onClick={cancelEditing}
                          >
                            <X size={16} aria-hidden="true" />
                            Cancelar
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
                            Editar
                          </button>

                          <button
                            className="setor-table__action setor-table__action--danger"
                            type="button"
                            disabled={isBusy || editingId !== null}
                            onClick={() => void handleDelete(setor)}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                            {isPending ? 'Excluindo...' : 'Excluir'}
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