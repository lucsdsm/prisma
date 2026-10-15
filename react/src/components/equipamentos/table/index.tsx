import { useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'

import type { Equipamento } from '../../../types/equipamento'

import type {
  EquipamentoInlineUpdate,
} from '../../../services/equipamentos/equipamentos.service'

import {
  carregarOpcoesEquipamento,
  type EquipamentoOptions,
} from '../../../services/equipamentos/equipamentos-options.service'

import { Select, type SelectOption } from '../../ui/select'

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
  tipo: string
  propriedade: string
  responsavel_atual: string
  status: string
}

function includeCurrentOption(
  options: SelectOption[],
  currentId: number | null,
  currentLabel: string,
): SelectOption[] {
  if (currentId === null) {
    return options
  }

  const value = String(currentId)

  if (options.some((option) => option.value === value)) {
    return options
  }

  return [
    {
      value,
      label: `${currentLabel} (vínculo atual)`,
    },
    ...options,
  ]
}

export function EquipamentoTable({
  equipamentos,
  onSave,
  onDelete,
}: EquipamentoTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [loadingOptionsId, setLoadingOptionsId] =
    useState<number | null>(null)

  const [error, setError] = useState('')

  const [form, setForm] = useState<EditForm>({
    tombo: '',
    marca: '',
    modelo: '',
    tipo: '',
    propriedade: '',
    responsavel_atual: '',
    status: '',
  })

  const [options, setOptions] = useState<EquipamentoOptions>({
    tipos: [],
    propriedades: [],
    status: [],
    funcionarios: [],
  })

  const isPending = pendingId !== null
  const isLoadingOptions = loadingOptionsId !== null
  const isBusy = isPending || isLoadingOptions

  function updateField(field: keyof EditForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function startEditing(equipamento: Equipamento) {
    if (isBusy || editingId !== null) {
      return
    }

    setError('')
    setLoadingOptionsId(equipamento.id)

    try {
      const data = await carregarOpcoesEquipamento()

      setOptions(data)

      setForm({
        tombo: equipamento.tombo || '',
        marca: equipamento.marca,
        modelo: equipamento.modelo,

        tipo: String(equipamento.tipo),
        propriedade: String(equipamento.propriedade),

        responsavel_atual:
          equipamento.responsavel_atual !== null
            ? String(equipamento.responsavel_atual)
            : '',

        status:
          equipamento.status !== null
            ? String(equipamento.status)
            : '',
      })

      setEditingId(equipamento.id)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar as opções de edição.',
      )
    } finally {
      setLoadingOptionsId(null)
    }
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

    if (!form.marca.trim() || !form.tipo || !form.propriedade) {
      setError('Informe a marca, o tipo e a propriedade.')
      return
    }

    setPendingId(id)
    setError('')

    try {
      await onSave(id, {
        tombo: form.tombo.trim() || null,
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),

        tipo: Number(form.tipo),
        propriedade: Number(form.propriedade),

        responsavel_atual: form.responsavel_atual
          ? Number(form.responsavel_atual)
          : null,

        status: form.status ? Number(form.status) : null,
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
    if (isBusy || editingId !== null) {
      return
    }

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

      {isLoadingOptions && (
        <p className="equipamento-table__notice" role="status">
          Carregando opções de edição...
        </p>
      )}

      <div
        className="equipamento-table__scroll"
        role="region"
        aria-label="Tabela de equipamentos"
        tabIndex={0}
        aria-busy={isBusy}
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
              const isThisRowLoading =
                loadingOptionsId === equipamento.id

              const fieldPrefix = `equipamento-${equipamento.id}`

              const selectedFuncionario = isEditing
                ? options.funcionarios.find(
                    (item) =>
                      String(item.id) === form.responsavel_atual,
                  )
                : undefined

              const currentResponsavelId =
                equipamento.responsavel_atual !== null
                  ? String(equipamento.responsavel_atual)
                  : ''

              let displayedSetor = equipamento.setor_atual || '—'

              if (isEditing) {
                if (!form.responsavel_atual) {
                  displayedSetor = '—'
                } else if (selectedFuncionario) {
                  displayedSetor = selectedFuncionario.setor_nome
                } else if (
                  form.responsavel_atual !== currentResponsavelId
                ) {
                  displayedSetor = '—'
                }
              }

              return (
                <tr key={equipamento.id}>
                  <td className="equipamento-table__identifier">
                    {isEditing ? (
                      <input
                        className="equipamento-table__input"
                        aria-label="Tombo patrimonial"
                        value={form.tombo}
                        maxLength={100}
                        disabled={isBusy}
                        onChange={(event) =>
                          updateField('tombo', event.target.value)
                        }
                      />
                    ) : (
                      equipamento.tombo || 'Sem tombo'
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <div className="equipamento-table__select">
                        <label
                          className="equipamento-table__sr-only"
                          htmlFor={`${fieldPrefix}-tipo`}
                        >
                          Tipo do equipamento
                        </label>

                        <Select
                          id={`${fieldPrefix}-tipo`}
                          value={form.tipo}
                          onValueChange={(value) =>
                            updateField('tipo', value)
                          }
                          options={includeCurrentOption(
                            options.tipos.map((item) => ({
                              value: String(item.id),
                              label: item.nome,
                            })),
                            equipamento.tipo,
                            equipamento.tipo_nome,
                          )}
                          placeholder="Selecione o tipo"
                          disabled={isBusy}
                          required
                        />
                      </div>
                    ) : (
                      equipamento.tipo_nome
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <div className="equipamento-table__product">
                        <input
                          className="equipamento-table__input"
                          aria-label="Marca"
                          value={form.marca}
                          maxLength={100}
                          disabled={isBusy}
                          onChange={(event) =>
                            updateField('marca', event.target.value)
                          }
                        />

                        <input
                          className="equipamento-table__input"
                          aria-label="Modelo"
                          value={form.modelo}
                          maxLength={150}
                          disabled={isBusy}
                          onChange={(event) =>
                            updateField('modelo', event.target.value)
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

                  <td>
                    {isEditing ? (
                      <div className="equipamento-table__select">
                        <label
                          className="equipamento-table__sr-only"
                          htmlFor={`${fieldPrefix}-propriedade`}
                        >
                          Propriedade do equipamento
                        </label>

                        <Select
                          id={`${fieldPrefix}-propriedade`}
                          value={form.propriedade}
                          onValueChange={(value) =>
                            updateField('propriedade', value)
                          }
                          options={includeCurrentOption(
                            options.propriedades.map((item) => ({
                              value: String(item.id),
                              label: item.nome,
                            })),
                            equipamento.propriedade,
                            equipamento.propriedade_nome,
                          )}
                          placeholder="Selecione a propriedade"
                          disabled={isBusy}
                          required
                        />
                      </div>
                    ) : (
                      equipamento.propriedade_nome
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <div className="equipamento-table__select equipamento-table__select--wide">
                        <label
                          className="equipamento-table__sr-only"
                          htmlFor={`${fieldPrefix}-responsavel`}
                        >
                          Responsável pelo equipamento
                        </label>

                        <Select
                          id={`${fieldPrefix}-responsavel`}
                          value={form.responsavel_atual}
                          onValueChange={(value) =>
                            updateField('responsavel_atual', value)
                          }
                          options={includeCurrentOption(
                            options.funcionarios.map((item) => ({
                              value: String(item.id),
                              label: `${item.nome} — ${item.setor_nome}`,
                            })),
                            equipamento.responsavel_atual,
                            equipamento.responsavel_nome ||
                              'Responsável atual',
                          )}
                          placeholder="Sem responsável"
                          disabled={isBusy}
                          allowEmpty
                          emptyLabel="Sem responsável"
                        />
                      </div>
                    ) : (
                      equipamento.responsavel_nome || 'Sem responsável'
                    )}
                  </td>

                  <td>
                    <span aria-live={isEditing ? 'polite' : undefined}>
                      {displayedSetor}
                    </span>
                  </td>

                  <td>
                    {isEditing ? (
                      <div className="equipamento-table__select">
                        <label
                          className="equipamento-table__sr-only"
                          htmlFor={`${fieldPrefix}-status`}
                        >
                          Status do equipamento
                        </label>

                        <Select
                          id={`${fieldPrefix}-status`}
                          value={form.status}
                          onValueChange={(value) =>
                            updateField('status', value)
                          }
                          options={includeCurrentOption(
                            options.status.map((item) => ({
                              value: String(item.id),
                              label: item.nome,
                            })),
                            equipamento.status,
                            equipamento.status_nome || 'Status atual',
                          )}
                          placeholder="Não informado"
                          disabled={isBusy}
                          allowEmpty
                          emptyLabel="Não informado"
                        />
                      </div>
                    ) : (
                      <span className="equipamento-table__status">
                        {equipamento.status_nome || 'Não informado'}
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="equipamento-table__actions">
                      {isEditing ? (
                        <>
                          <button
                            className="equipamento-table__action"
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              void handleSave(equipamento.id)
                            }
                          >
                            <Check size={16} aria-hidden="true" />
                            {isThisRowPending ? 'Salvando...' : 'Salvar'}
                          </button>

                          <button
                            className="equipamento-table__action"
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
                            className="equipamento-table__action"
                            type="button"
                            disabled={isBusy || editingId !== null}
                            onClick={() =>
                              void startEditing(equipamento)
                            }
                          >
                            <Pencil size={16} aria-hidden="true" />
                            {isThisRowLoading ? 'Carregando...' : 'Editar'}
                          </button>

                          <button
                            className="equipamento-table__action equipamento-table__action--danger"
                            type="button"
                            disabled={isBusy || editingId !== null}
                            onClick={() =>
                              void handleDelete(equipamento)
                            }
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