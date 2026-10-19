import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, Save } from 'lucide-react'

import { criarEquipamento } from '../../../services/equipamentos/equipamentos.service'

import {
  carregarOpcoesEquipamento,
  type EquipamentoOptions,
} from '../../../services/equipamentos/equipamentos-options.service'

import { Select } from '../../ui/select'

import './styles.css'

interface EquipamentoFormProps {
  onCancel: () => void
  onCreated: (addAnother?: boolean) => void
}

interface FormValues {
  tipo: string
  marca: string
  modelo: string
  propriedade: string
  tombo: string
  responsavel_atual: string
  status: string
  data_fornecimento: string
  data_entrega_atual: string
  descricao: string
  observacoes: string
}

const initialForm: FormValues = {
  tipo: '',
  marca: '',
  modelo: '',
  propriedade: '',
  tombo: '',
  responsavel_atual: '',
  status: '',
  data_fornecimento: '',
  data_entrega_atual: '',
  descricao: '',
  observacoes: '',
}

export function EquipamentoForm({
  onCancel,
  onCreated,
}: EquipamentoFormProps) {
  const [form, setForm] = useState<FormValues>(initialForm)

  const [options, setOptions] = useState<EquipamentoOptions>({
    tipos: [],
    propriedades: [],
    status: [],
    funcionarios: [],
  })

  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  const [optionsError, setOptionsError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveAndAddAnother, setSaveAndAddAnother] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadOptions() {
      setIsLoadingOptions(true)
      setOptionsError('')

      try {
        const data = await carregarOpcoesEquipamento(controller.signal)

        if (!controller.signal.aborted) {
          setOptions(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setOptionsError(
            err instanceof Error
              ? err.message
              : 'Não foi possível carregar as opções do formulário.',
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

  function updateField(field: keyof FormValues, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const isDirty = (
    Object.keys(initialForm) as Array<keyof FormValues>
  ).some((field) => form[field] !== initialForm[field])

  const selectedFuncionario = options.funcionarios.find(
    (item) => String(item.id) === form.responsavel_atual,
  )

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

    if (isSaving || isLoadingOptions || optionsError) {
      return
    }

    if (!form.tipo || !form.propriedade || !form.marca.trim()) {
      setSubmitError('Informe o tipo, a marca e a propriedade.')
      return
    }

    setIsSaving(true)
    setSubmitError('')

    try {
      await criarEquipamento({
        tipo: Number(form.tipo),
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        propriedade: Number(form.propriedade),
        tombo: form.tombo.trim() || null,
        responsavel_atual: form.responsavel_atual
          ? Number(form.responsavel_atual)
          : null,
        status: form.status ? Number(form.status) : null,
        data_fornecimento: form.data_fornecimento || null,
        data_entrega_atual: form.data_entrega_atual || null,
        descricao: form.descricao.trim(),
        observacoes: form.observacoes.trim(),
      })
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Não foi possível cadastrar o equipamento.',
      )

      setIsSaving(false)
      return
    }

    setIsSaving(false)
    onCreated(saveAndAddAnother)
  }

  const isFormDisabled = isSaving || isLoadingOptions || Boolean(optionsError)

  return (
    <div className="equipamento-form">
      <button
        className="equipamento-form__back"
        type="button"
        onClick={handleCancel}
        disabled={isSaving}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para a listagem
      </button>

      <header className="equipamento-form__header">
        <h2>Novo equipamento</h2>
        <p>
          Preencha os dados abaixo. Campos com * são obrigatórios.
        </p>
      </header>

      {isLoadingOptions && (
        <p className="equipamento-form__notice" role="status">
          Carregando opções do formulário...
        </p>
      )}

      {optionsError && (
        <div className="equipamento-form__error" role="alert">
          <p>{optionsError}</p>

          <button
            className="equipamento-form__retry"
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
          >
            Tentar novamente
          </button>
        </div>
      )}

      <form
        className="equipamento-form__body"
        onSubmit={handleSubmit}
        aria-busy={isSaving || isLoadingOptions}
      >
        <fieldset
          className="equipamento-form__section"
          disabled={isFormDisabled}
        >
          <legend className="equipamento-form__legend">
            <span className="equipamento-form__number">01</span>
            Identificação
          </legend>

          <div className="equipamento-form__grid">
            <div className="equipamento-form__field">
              <label htmlFor="equipamento-tipo">Tipo *</label>

              <Select
                id="equipamento-tipo"
                name="tipo"
                value={form.tipo}
                onValueChange={(value) => updateField('tipo', value)}
                options={options.tipos.map((item) => ({
                  value: String(item.id),
                  label: item.nome,
                }))}
                placeholder="Selecione o tipo"
                disabled={isFormDisabled}
                required
              />
            </div>

            <div className="equipamento-form__field">
              <label htmlFor="equipamento-marca">Marca *</label>

              <input
                id="equipamento-marca"
                value={form.marca}
                onChange={(event) =>
                  updateField('marca', event.target.value)
                }
                placeholder="Ex.: Dell"
                maxLength={100}
                required
              />
            </div>

            <div className="equipamento-form__field">
              <label htmlFor="equipamento-modelo">Modelo</label>

              <input
                id="equipamento-modelo"
                value={form.modelo}
                onChange={(event) =>
                  updateField('modelo', event.target.value)
                }
                placeholder="Ex.: Positivo 5420"
                maxLength={150}
              />
            </div>

            <div className="equipamento-form__field">
              <label htmlFor="equipamento-tombo">Tombo</label>

              <input
                id="equipamento-tombo"
                value={form.tombo}
                onChange={(event) =>
                  updateField('tombo', event.target.value)
                }
                placeholder="Número patrimonial"
                maxLength={100}
              />
            </div>

            <div className="equipamento-form__field">
              <label htmlFor="equipamento-propriedade">
                Propriedade *
              </label>

              <Select
                id="equipamento-propriedade"
                name="propriedade"
                value={form.propriedade}
                onValueChange={(value) =>
                  updateField('propriedade', value)
                }
                options={options.propriedades.map((item) => ({
                  value: String(item.id),
                  label: item.nome,
                }))}
                placeholder="Selecione a propriedade"
                disabled={isFormDisabled}
                required
              />
            </div>

            <div className="equipamento-form__field">
              <label htmlFor="equipamento-status">Status</label>

              <Select
                id="equipamento-status"
                name="status"
                value={form.status}
                onValueChange={(value) => updateField('status', value)}
                options={options.status.map((item) => ({
                  value: String(item.id),
                  label: item.nome,
                }))}
                placeholder="Não informado"
                disabled={isFormDisabled}
                allowEmpty
                emptyLabel="Não informado"
              />
            </div>
          </div>
        </fieldset>

        <fieldset
          className="equipamento-form__section"
          disabled={isFormDisabled}
        >
          <legend className="equipamento-form__legend">
            <span className="equipamento-form__number">02</span>
            Responsabilidade e datas
          </legend>

          <div className="equipamento-form__grid">
            <div className="equipamento-form__field equipamento-form__field--full">
              <label htmlFor="equipamento-responsavel">
                Responsável
              </label>

              <Select
                id="equipamento-responsavel"
                name="responsavel_atual"
                value={form.responsavel_atual}
                onValueChange={(value) =>
                  updateField('responsavel_atual', value)
                }
                options={options.funcionarios.map((item) => ({
                  value: String(item.id),
                  label: `${item.nome} — ${item.setor_nome}`,
                }))}
                placeholder="Sem responsável"
                disabled={isFormDisabled}
                allowEmpty
                emptyLabel="Sem responsável"
              />

              <p
                className="equipamento-form__hint"
                aria-live="polite"
              >
                {selectedFuncionario
                  ? `Setor: ${selectedFuncionario.setor_nome}`
                  : 'O setor será identificado a partir do responsável.'}
              </p>
            </div>

            <div className="equipamento-form__field">
              <label htmlFor="equipamento-fornecimento">
                Data de fornecimento
              </label>

              <input
                id="equipamento-fornecimento"
                type="date"
                value={form.data_fornecimento}
                onChange={(event) =>
                  updateField('data_fornecimento', event.target.value)
                }
              />

              <p className="equipamento-form__hint">
                Entrada do equipamento no patrimônio ou contrato.
              </p>
            </div>

            <div className="equipamento-form__field">
              <label htmlFor="equipamento-entrega">
                Data de entrega
              </label>

              <input
                id="equipamento-entrega"
                type="date"
                value={form.data_entrega_atual}
                onChange={(event) =>
                  updateField('data_entrega_atual', event.target.value)
                }
              />

              <p className="equipamento-form__hint">
                Entrega ao responsável atual.
              </p>
            </div>
          </div>
        </fieldset>

        <fieldset
          className="equipamento-form__section"
          disabled={isFormDisabled}
        >
          <legend className="equipamento-form__legend">
            <span className="equipamento-form__number">03</span>
            Informações complementares
          </legend>

          <div className="equipamento-form__grid">
            <div className="equipamento-form__field equipamento-form__field--full">
              <label htmlFor="equipamento-descricao">
                Descrição
              </label>

              <textarea
                id="equipamento-descricao"
                rows={3}
                value={form.descricao}
                onChange={(event) =>
                  updateField('descricao', event.target.value)
                }
                placeholder="Características técnicas e detalhes do equipamento."
              />
            </div>

            <div className="equipamento-form__field equipamento-form__field--full">
              <label htmlFor="equipamento-observacoes">
                Observações
              </label>

              <textarea
                id="equipamento-observacoes"
                rows={2}
                value={form.observacoes}
                onChange={(event) =>
                  updateField('observacoes', event.target.value)
                }
                placeholder="Informações adicionais, se necessário."
              />
            </div>
          </div>
        </fieldset>

        {submitError && (
          <p className="equipamento-form__error" role="alert">
            {submitError}
          </p>
        )}

        <div className="equipamento-form__actions">
          <button
            className="equipamento-form__cancel"
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancelar
          </button>

          <button
            className="equipamento-form__submit equipamento-form__submit--secondary"
            type="submit"
            disabled={isFormDisabled}
            onClick={() => setSaveAndAddAnother(true)}
          >
            <Save size={16} aria-hidden="true" />
            {isSaving ? 'Salvando...' : 'Salvar e adicionar outro'}
          </button>

          <button
            className="equipamento-form__submit"
            type="submit"
            disabled={isFormDisabled}
            onClick={() => setSaveAndAddAnother(false)}
          >
            <Save size={16} aria-hidden="true" />
            {isSaving ? 'Salvando...' : 'Salvar equipamento'}
          </button>
        </div>
      </form>
    </div>
  )
}