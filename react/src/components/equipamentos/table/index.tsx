import { useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'

import type { Equipamento } from '../../../types/equipamento'

import type {
  EquipamentoInlineUpdate,
} from '../../../services/equipamentos.service'

import './styles.css'

interface EquipamentoTableProps {
  equipamentos: Equipamento[]
  onSave: (
    id: number,
    dados: EquipamentoInlineUpdate,
  ) => Promise<void>
  onDelete: (equipamento: Equipamento) => Promise<void>
}

interface EditForm {
  tombo: string
  marca: string
  modelo: string
}

export function EquipamentoTable({
  equipamentos,
  onSave,
  onDelete,
}: EquipamentoTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState<EditForm>({
    tombo: '',
    marca: '',
    modelo: '',
  })

  const isPending = pendingId !== null

  function startEditing(equipamento: Equipamento) {
    setError('')
    setEditingId(equipamento.id)

    setForm({
      tombo: equipamento.tombo || '',
      marca: equipamento.marca,
      modelo: equipamento.modelo,
    })
  }

  function cancelEditing() {
    setEditingId(null)
    setError('')
  }

  async function handleSave(id: number) {
    if (!form.marca.trim()) {
      setError('Informe a marca do equipamento.')
      return
    }

    setPendingId(id)
    setError('')

    try {
      await onSave(id, {
        tombo: form.tombo.trim() || null,
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
      })

      setEditingId(null)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar o equipamento.',
      )
    } finally {
      setPendingId(null)
    }
  }

  async function handleDelete(equipamento: Equipamento) {
    const identificador =
      equipamento.tombo || `ID ${equipamento.id}`

    const confirmed = window.confirm(
      `Excluir o equipamento ${equipamento.tipo_nome} — ${identificador}?\n\n` +
      'Essa ação remove o registro do banco de dados e não pode ser desfeita pela interface.',
    )

    if (!confirmed) {
      return
    }

    setPendingId(equipamento.id)
    setError('')

    try {
      await onDelete(equipamento)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível excluir o equipamento.',
      )
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="equipamento-table-wrapper">
      {error && (
        <p className="equipamento-table__error" role="alert">
          {error}
        </p>
      )}

      <div
        className="equipamento-table__scroll"
        role="region"
        aria-label="Tabela de equipamentos"
        tabIndex={0}
        aria-busy={isPending}
      >
        <table className="equipamento-table">
          <caption className="equipamento-table__caption">
            Equipamentos cadastrados no inventário
          </caption>

          <thead>
            <tr>
              <th scope="col">Tombo</th>
              <th scope="col">Tipo</th>
              <th scope="col">Marca / modelo</th>
              <th scope="col">Propriedade</th>
              <th scope="col">Responsável</th>
              <th scope="col">Setor</th>
              <th scope="col">Status</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>

          <tbody>
            {equipamentos.map((equipamento) => {
              const isEditing = editingId === equipamento.id
              const isThisRowPending = pendingId === equipamento.id

              return (
                <tr key={equipamento.id}>
                  <td className="equipamento-table__identifier">
                    {isEditing ? (
                      <input
                        className="equipamento-table__input"
                        aria-label="Tombo patrimonial"
                        value={form.tombo}
                        maxLength={100}
                        disabled={isPending}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            tombo: event.target.value,
                          }))
                        }
                      />
                    ) : (
                      equipamento.tombo || 'Sem tombo'
                    )}
                  </td>

                  <td>{equipamento.tipo_nome}</td>

                  <td>
                    {isEditing ? (
                      <div className="equipamento-table__product">
                        <input
                          className="equipamento-table__input"
                          aria-label="Marca"
                          value={form.marca}
                          maxLength={100}
                          disabled={isPending}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              marca: event.target.value,
                            }))
                          }
                        />

                        <input
                          className="equipamento-table__input"
                          aria-label="Modelo"
                          value={form.modelo}
                          maxLength={150}
                          disabled={isPending}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              modelo: event.target.value,
                            }))
                          }
                        />
                      </div>
                    ) : (
                      <div className="equipamento-table__product">
                        <span>{equipamento.marca}</span>

                        <span className="equipamento-table__secondary">
                          {equipamento.modelo || 'Modelo não informado'}
                        </span>
                      </div>
                    )}
                  </td>

                  <td>{equipamento.propriedade_nome}</td>

                  <td>
                    {equipamento.responsavel_nome || 'Sem responsável'}
                  </td>

                  <td>{equipamento.setor_atual || '—'}</td>

                  <td>
                    <span className="equipamento-table__status">
                      {equipamento.status_nome || 'Não informado'}
                    </span>
                  </td>

                  <td>
                    <div className="equipamento-table__actions">
                      {isEditing ? (
                        <>
                          <button
                            className="equipamento-table__action"
                            type="button"
                            disabled={isPending}
                            onClick={() => void handleSave(equipamento.id)}
                          >
                            <Check size={16} aria-hidden="true" />
                            {isThisRowPending ? 'Salvando...' : 'Salvar'}
                          </button>

                          <button
                            className="equipamento-table__action"
                            type="button"
                            disabled={isPending}
                            onClick={cancelEditing}
                          >
                            <X size={16} aria-hidden="true" />
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="equipamento-table__action"
                            type="button"
                            disabled={isPending || editingId !== null}
                            onClick={() => startEditing(equipamento)}
                          >
                            <Pencil size={16} aria-hidden="true" />
                            Editar
                          </button>

                          <button
                            className="equipamento-table__action equipamento-table__action--danger"
                            type="button"
                            disabled={isPending || editingId !== null}
                            onClick={() => void handleDelete(equipamento)}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                            {isThisRowPending ? 'Excluindo...' : 'Excluir'}
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