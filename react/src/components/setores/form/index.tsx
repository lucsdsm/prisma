import { useState, type FormEvent } from 'react'
import { ArrowLeft, Save } from 'lucide-react'

import { Select } from '../../ui/select'

import {
  criarSetor,
} from '../../../services/setores/setores.service'

import './styles.css'

interface SetorFormProps {
  onCancel: () => void
  onCreated: (addAnother?: boolean) => void
}

interface FormValues {
  nome: string
  ordem: string
  ativo: boolean
}

const initialForm: FormValues = {
  nome: '',
  ordem: '0',
  ativo: true,
}

export function SetorForm({
  onCancel,
  onCreated,
}: SetorFormProps) {
  const [form, setForm] = useState<FormValues>(initialForm)
  const [submitError, setSubmitError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveAndAddAnother, setSaveAndAddAnother] = useState(false)

  const isDirty =
    form.nome !== initialForm.nome ||
    form.ordem !== initialForm.ordem ||
    form.ativo !== initialForm.ativo

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

    if (isSaving) {
      return
    }

    if (!form.nome.trim()) {
      setSubmitError('Informe o nome do setor.')
      return
    }

    const ordem = Number(form.ordem)

    if (
      form.ordem.trim() === '' ||
      !Number.isInteger(ordem) ||
      ordem < 0 ||
      ordem > 32767
    ) {
      setSubmitError('Informe uma ordem inteira entre 0 e 32767.')
      return
    }

    setIsSaving(true)
    setSubmitError('')

    try {
      await criarSetor({
        nome: form.nome.trim(),
        ordem,
        ativo: form.ativo,
      })
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Não foi possível cadastrar o setor.',
      )

      setIsSaving(false)
      return
    }

    setIsSaving(false)
    onCreated(saveAndAddAnother)
  }

  return (
    <div className="setor-form">
      <button
        className="setor-form__back"
        type="button"
        onClick={handleCancel}
        disabled={isSaving}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para a listagem
      </button>

      <header className="setor-form__header">
        <h2>Novo setor</h2>
        <p>
          Preencha os dados abaixo. Campos com * são obrigatórios.
        </p>
      </header>

      <form
        className="setor-form__body"
        onSubmit={handleSubmit}
        aria-busy={isSaving}
      >
        <fieldset
          className="setor-form__section"
          disabled={isSaving}
        >
          <legend className="setor-form__legend">
            Informações do setor
          </legend>

          <div className="setor-form__grid">
            <div className="setor-form__field setor-form__field--full">
              <label htmlFor="setor-nome">Nome *</label>

              <input
                id="setor-nome"
                value={form.nome}
                maxLength={150}
                placeholder="Ex.: Tecnologia da Informação"
                required
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
              />
            </div>

            <div className="setor-form__field">
              <label htmlFor="setor-ordem">Ordem *</label>

              <input
                id="setor-ordem"
                type="number"
                min={0}
                max={32767}
                step={1}
                value={form.ordem}
                required
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    ordem: event.target.value,
                  }))
                }
              />

              <p className="setor-form__hint">
                Usada quando a listagem está configurada para ordenar
                por este campo.
              </p>
            </div>

            <div className="setor-form__field">
              <label htmlFor="setor-ativo">Situação</label>

              <Select
                id="setor-ativo"
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
                disabled={isSaving}
              />

              <p className="setor-form__hint">
                Setores inativos permanecem cadastrados, mas não
                aparecem nas opções de novos vínculos do formulário
                de funcionários.
              </p>
            </div>
          </div>
        </fieldset>

        {submitError && (
          <p className="setor-form__error" role="alert">
            {submitError}
          </p>
        )}

        <div className="setor-form__actions">
          <button
            className="setor-form__cancel"
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancelar
          </button>

          <button
            className="setor-form__submit setor-form__submit--secondary"
            type="submit"
            disabled={isSaving}
            onClick={() => setSaveAndAddAnother(true)}
          >
            <Save size={16} aria-hidden="true" />
            {isSaving ? 'Salvando...' : 'Salvar e adicionar outro'}
          </button>

          <button
            className="setor-form__submit"
            type="submit"
            disabled={isSaving}
            onClick={() => setSaveAndAddAnother(false)}
          >
            <Save size={16} aria-hidden="true" />
            {isSaving ? 'Salvando...' : 'Salvar setor'}
          </button>
        </div>
      </form>
    </div>
  )
}