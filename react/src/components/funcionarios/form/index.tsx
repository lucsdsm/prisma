import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, Save } from 'lucide-react'

import { Select } from '../../ui/select'

import {
  criarFuncionario,
} from '../../../services/funcionarios/funcionarios.service'

import {
  carregarOpcoesFuncionario,
  type FuncionarioOptions,
} from '../../../services/funcionarios/funcionarios-options.service'

import './styles.css'

interface FuncionarioFormProps {
  onCancel: () => void
  onCreated: () => void
}

interface FormValues {
  nome: string
  setor: string
  cargo: string
  ativo: boolean
}

const initialForm: FormValues = {
  nome: '',
  setor: '',
  cargo: '',
  ativo: true,
}

export function FuncionarioForm({
  onCancel,
  onCreated,
}: FuncionarioFormProps) {
  const [form, setForm] = useState<FormValues>(initialForm)

  const [options, setOptions] = useState<FuncionarioOptions>({
    setores: [],
    cargos: [],
  })

  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  const [optionsError, setOptionsError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadOptions() {
      setIsLoadingOptions(true)
      setOptionsError('')

      try {
        const data = await carregarOpcoesFuncionario(controller.signal)

        if (!controller.signal.aborted) {
          setOptions(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setOptionsError(
            err instanceof Error
              ? err.message
              : 'Não foi possível carregar setores e cargos.',
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingOptions(false)
        }
      }
    }

    void loadOptions()

    return () => controller.abort()
  }, [reloadKey])

  const isDirty =
    form.nome !== initialForm.nome ||
    form.setor !== initialForm.setor ||
    form.cargo !== initialForm.cargo ||
    form.ativo !== initialForm.ativo

  const isFormDisabled =
    isSaving || isLoadingOptions || Boolean(optionsError)

  function handleCancel() {
    if (isSaving) {
      return
    }

    if (
      isDirty &&
      !window.confirm('Descartar os dados preenchidos e voltar à listagem?')
    ) {
      return
    }

    onCancel()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isFormDisabled) {
      return
    }

    if (!form.nome.trim() || !form.setor || !form.cargo) {
      setSubmitError('Informe o nome, o setor e o cargo.')
      return
    }

    setIsSaving(true)
    setSubmitError('')

    try {
      await criarFuncionario({
        nome: form.nome.trim(),
        setor: Number(form.setor),
        cargo: Number(form.cargo),
        ativo: form.ativo,
      })
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Não foi possível cadastrar o funcionário.',
      )

      setIsSaving(false)
      return
    }

    setIsSaving(false)
    onCreated()
  }

  return (
    <div className="funcionario-form">
      <button
        className="funcionario-form__back"
        type="button"
        onClick={handleCancel}
        disabled={isSaving}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para a listagem
      </button>

      <header className="funcionario-form__header">
        <h2>Novo funcionário</h2>
        <p>
          Preencha os dados abaixo. Campos com * são obrigatórios.
        </p>
      </header>

      {isLoadingOptions && (
        <p className="funcionario-form__notice" role="status">
          Carregando setores e cargos...
        </p>
      )}

      {optionsError && (
        <div className="funcionario-form__error" role="alert">
          <p>{optionsError}</p>

          <button
            className="funcionario-form__retry"
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
          >
            Tentar novamente
          </button>
        </div>
      )}

      <form
        className="funcionario-form__body"
        onSubmit={handleSubmit}
        aria-busy={isSaving || isLoadingOptions}
      >
        <fieldset
          className="funcionario-form__section"
          disabled={isFormDisabled}
        >
          <legend className="funcionario-form__legend">
            <span className="funcionario-form__number">01</span>
            Identificação
          </legend>

          <div className="funcionario-form__field">
            <label htmlFor="funcionario-nome">Nome completo *</label>

            <input
              id="funcionario-nome"
              value={form.nome}
              maxLength={200}
              autoComplete="name"
              placeholder="Nome do funcionário"
              required
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  nome: event.target.value,
                }))
              }
            />
          </div>
        </fieldset>

        <fieldset
          className="funcionario-form__section"
          disabled={isFormDisabled}
        >
          <legend className="funcionario-form__legend">
            <span className="funcionario-form__number">02</span>
            Vínculo organizacional
          </legend>

          <div className="funcionario-form__grid">
            <div className="funcionario-form__field">
              <label htmlFor="funcionario-setor">Setor *</label>

              <Select
                id="funcionario-setor"
                name="setor"
                value={form.setor}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    setor: value,
                  }))
                }
                options={options.setores.map((item) => ({
                  value: String(item.id),
                  label: item.nome,
                }))}
                placeholder="Selecione o setor"
                disabled={isFormDisabled}
                required
              />
            </div>

            <div className="funcionario-form__field">
              <label htmlFor="funcionario-cargo">Cargo *</label>

              <Select
                id="funcionario-cargo"
                name="cargo"
                value={form.cargo}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    cargo: value,
                  }))
                }
                options={options.cargos.map((item) => ({
                  value: String(item.id),
                  label: item.nome,
                }))}
                placeholder="Selecione o cargo"
                disabled={isFormDisabled}
                required
              />
            </div>

            <div className="funcionario-form__field funcionario-form__field--full">
              <label htmlFor="funcionario-ativo">Situação</label>

              <Select
                id="funcionario-ativo"
                name="situacao"
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
                disabled={isFormDisabled}
              />

              <p className="funcionario-form__hint">
                Funcionários inativos permanecem cadastrados, mas não
                aparecem nas opções de novos responsáveis por equipamentos.
              </p>
            </div>
          </div>
        </fieldset>

        {submitError && (
          <p className="funcionario-form__error" role="alert">
            {submitError}
          </p>
        )}

        <div className="funcionario-form__actions">
          <button
            className="funcionario-form__cancel"
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancelar
          </button>

          <button
            className="funcionario-form__submit"
            type="submit"
            disabled={isFormDisabled}
          >
            <Save size={16} aria-hidden="true" />
            {isSaving ? 'Salvando...' : 'Salvar funcionário'}
          </button>
        </div>
      </form>
    </div>
  )
}