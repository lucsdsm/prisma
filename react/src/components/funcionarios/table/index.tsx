import { useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'

import { Select, type SelectOption } from '../../ui/select'
import { SortableColumn } from '../../ui/list-controls'

import {
  carregarOpcoesFuncionario,
  type FuncionarioOptions,
} from '../../../services/funcionarios/funcionarios-options.service'

import type {
  Funcionario,
  FuncionarioInput,
} from '../../../types/funcionario'

import './styles.css'

interface FuncionarioTableProps {
  funcionarios: Funcionario[]
  ordering: string
  onSort: (field: string) => void
  onSave: (
    id: number,
    dados: FuncionarioInput,
  ) => Promise<void>
  onDelete: (funcionario: Funcionario) => Promise<void>
}

interface EditForm {
  nome: string
  setor: string
  cargo: string
  ativo: boolean
}

function includeCurrentOption(
  options: SelectOption[],
  currentId: number,
  currentLabel: string,
): SelectOption[] {
  const value = String(currentId)

  if (options.some((item) => item.value === value)) {
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

export function FuncionarioTable({
  funcionarios,
  ordering,
  onSort,
  onSave,
  onDelete,
}: FuncionarioTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [loadingOptionsId, setLoadingOptionsId] =
    useState<number | null>(null)

  const [error, setError] = useState('')

  const [form, setForm] = useState<EditForm>({
    nome: '',
    setor: '',
    cargo: '',
    ativo: true,
  })

  const [options, setOptions] = useState<FuncionarioOptions>({
    setores: [],
    cargos: [],
  })

  const isBusy = pendingId !== null || loadingOptionsId !== null

  async function startEditing(funcionario: Funcionario) {
    if (isBusy || editingId !== null) {
      return
    }

    setError('')
    setLoadingOptionsId(funcionario.id)

    try {
      const data = await carregarOpcoesFuncionario()

      setOptions(data)

      setForm({
        nome: funcionario.nome,
        setor: String(funcionario.setor),
        cargo: String(funcionario.cargo),
        ativo: funcionario.ativo,
      })

      setEditingId(funcionario.id)
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

    if (!form.nome.trim() || !form.setor || !form.cargo) {
      setError('Informe o nome, o setor e o cargo.')
      return
    }

    setPendingId(id)
    setError('')

    try {
      await onSave(id, {
        nome: form.nome.trim(),
        setor: Number(form.setor),
        cargo: Number(form.cargo),
        ativo: form.ativo,
      })

      setEditingId(null)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar o funcionário.',
      )
    } finally {
      setPendingId(null)
    }
  }

  async function handleDelete(funcionario: Funcionario) {
    if (isBusy || editingId !== null) {
      return
    }

    const confirmed = window.confirm(
      `Excluir o funcionário ${funcionario.nome}?\n\n` +
        'Os equipamentos vinculados a ele ficarão sem responsável. ' +
        'Se deseja preservar o cadastro, prefira marcar como inativo.\n\n' +
        'A exclusão não pode ser desfeita pela interface.',
    )

    if (!confirmed) {
      return
    }

    setPendingId(funcionario.id)
    setError('')

    try {
      await onDelete(funcionario)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível excluir o funcionário.',
      )
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="funcionario-table-wrapper">
      {error && (
        <p className="funcionario-table__error" role="alert">
          {error}
        </p>
      )}

      {loadingOptionsId !== null && (
        <p className="funcionario-table__notice" role="status">
          Carregando opções de edição...
        </p>
      )}

      <div
        className="funcionario-table__scroll"
        role="region"
        aria-label="Tabela de funcionários"
        tabIndex={0}
        aria-busy={isBusy}
      >
        <table className="funcionario-table">
          <caption className="funcionario-table__sr-only">
            Funcionários cadastrados
          </caption>

          <thead>
            <tr>
              <th scope="col"><SortableColumn field="nome" label="Nome" ordering={ordering} onSort={onSort} /></th>
              <th scope="col"><SortableColumn field="setor__nome" label="Setor" ordering={ordering} onSort={onSort} /></th>
              <th scope="col"><SortableColumn field="cargo__nome" label="Cargo" ordering={ordering} onSort={onSort} /></th>
              <th scope="col"><SortableColumn field="ativo" label="Situação" ordering={ordering} onSort={onSort} /></th>
              <th scope="col">Ações</th>
            </tr>
          </thead>

          <tbody>
            {funcionarios.map((funcionario) => {
              const isEditing = editingId === funcionario.id
              const isPending = pendingId === funcionario.id
              const prefix = `funcionario-${funcionario.id}`

              return (
                <tr key={funcionario.id}>
                  <td>
                    {isEditing ? (
                      <input
                        className="funcionario-table__input"
                        aria-label="Nome do funcionário"
                        value={form.nome}
                        maxLength={200}
                        disabled={isBusy}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            nome: event.target.value,
                          }))
                        }
                      />
                    ) : (
                      <span className="funcionario-table__name">
                        {funcionario.nome}
                      </span>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <div className="funcionario-table__select">
                        <label
                          className="funcionario-table__sr-only"
                          htmlFor={`${prefix}-setor`}
                        >
                          Setor do funcionário
                        </label>

                        <Select
                          id={`${prefix}-setor`}
                          value={form.setor}
                          onValueChange={(value) =>
                            setForm((current) => ({
                              ...current,
                              setor: value,
                            }))
                          }
                          options={includeCurrentOption(
                            options.setores.map((item) => ({
                              value: String(item.id),
                              label: item.nome,
                            })),
                            funcionario.setor,
                            funcionario.setor_nome,
                          )}
                          disabled={isBusy}
                          required
                        />
                      </div>
                    ) : (
                      funcionario.setor_nome
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <div className="funcionario-table__select">
                        <label
                          className="funcionario-table__sr-only"
                          htmlFor={`${prefix}-cargo`}
                        >
                          Cargo do funcionário
                        </label>

                        <Select
                          id={`${prefix}-cargo`}
                          value={form.cargo}
                          onValueChange={(value) =>
                            setForm((current) => ({
                              ...current,
                              cargo: value,
                            }))
                          }
                          options={includeCurrentOption(
                            options.cargos.map((item) => ({
                              value: String(item.id),
                              label: item.nome,
                            })),
                            funcionario.cargo,
                            funcionario.cargo_nome,
                          )}
                          disabled={isBusy}
                          required
                        />
                      </div>
                    ) : (
                      funcionario.cargo_nome
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <div className="funcionario-table__select">
                        <label
                          className="funcionario-table__sr-only"
                          htmlFor={`${prefix}-ativo`}
                        >
                          Situação do funcionário
                        </label>

                        <Select
                          id={`${prefix}-ativo`}
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
                        className={`funcionario-table__badge ${
                          funcionario.ativo
                            ? 'funcionario-table__badge--active'
                            : ''
                        }`}
                      >
                        {funcionario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="funcionario-table__actions">
                      {isEditing ? (
                        <>
                          <button
                            className="funcionario-table__action"
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              void handleSave(funcionario.id)
                            }
                          >
                            <Check size={16} aria-hidden="true" />
                            {isPending ? 'Salvando...' : 'Salvar'}
                          </button>

                          <button
                            className="funcionario-table__action"
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
                            className="funcionario-table__action"
                            type="button"
                            disabled={isBusy || editingId !== null}
                            onClick={() =>
                              void startEditing(funcionario)
                            }
                          >
                            <Pencil size={16} aria-hidden="true" />
                          </button>

                          <button
                            className="funcionario-table__action funcionario-table__action--danger"
                            type="button"
                            disabled={isBusy || editingId !== null}
                            onClick={() =>
                              void handleDelete(funcionario)
                            }
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