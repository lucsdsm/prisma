import { useId, useState, type FormEvent } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { Select } from '../../ui/select'
import { criarStatus } from '../../../services/status/status.service'
import './styles.css'

interface StatusFormProps {
  onCancel: () => void
  onCreated: (addAnother?: boolean) => void
}

interface FormValues {
  nome: string
  ativo: boolean
}

const initialForm: FormValues = { nome: '', ativo: true }

export function StatusForm({ onCancel, onCreated }: StatusFormProps) {
  const formId = useId()
  const [form, setForm] = useState<FormValues>(initialForm)
  const [submitError, setSubmitError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveAndAddAnother, setSaveAndAddAnother] = useState(false)
  const isDirty = form.nome !== initialForm.nome || form.ativo !== initialForm.ativo

  function handleCancel() {
    if (isSaving) return
    if (isDirty && !window.confirm('Descartar os dados preenchidos e voltar à listagem?')) return
    onCancel()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSaving) return
    if (!form.nome.trim()) {
      setSubmitError('Informe o nome.')
      return
    }
    setIsSaving(true)
    setSubmitError('')
    try {
      await criarStatus({ nome: form.nome.trim(), ativo: form.ativo })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Não foi possível realizar o cadastro.')
      setIsSaving(false)
      return
    }
    setIsSaving(false)
    onCreated(saveAndAddAnother)
  }

  return (
    <div className="status-form">
      <button className="status-form__back" type="button" onClick={handleCancel} disabled={isSaving}>
        <ArrowLeft size={16} aria-hidden="true" />Voltar para a listagem
      </button>
      <header className="status-form__header">
        <h2>Novo status</h2>
        <p>Preencha os dados abaixo. Campos com * são obrigatórios.</p>
      </header>
      <form className="status-form__body" onSubmit={handleSubmit} aria-busy={isSaving}>
        <fieldset className="status-form__section" disabled={isSaving}>
          <legend className="status-form__legend">Informações do cadastro</legend>
          <div className="status-form__grid">
            <div className="status-form__field status-form__field--full">
              <label htmlFor={`${formId}-nome`}>Nome *</label>
              <input id={`${formId}-nome`} value={form.nome} maxLength={100}
                placeholder="Ex.: Em manutenção" required
                onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))} />
            </div>
            <div className="status-form__field">
              <label htmlFor={`${formId}-ativo`}>Situação</label>
              <Select id={`${formId}-ativo`} name="situacao" value={form.ativo ? 'ativo' : 'inativo'}
                onValueChange={(value) => setForm((current) => ({ ...current, ativo: value === 'ativo' }))}
                options={[{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }]}
                disabled={isSaving} />
              <p className="status-form__hint">Inativar preserva os vínculos existentes.</p>
            </div>
          </div>
        </fieldset>
        {submitError && <p className="status-form__error" role="alert">{submitError}</p>}
        <div className="status-form__actions">
          <button className="status-form__cancel" type="button" onClick={handleCancel} disabled={isSaving}>Cancelar</button>
          <button className="status-form__submit status-form__submit--secondary" type="submit" disabled={isSaving}
            onClick={() => setSaveAndAddAnother(true)}>
            <Save size={16} aria-hidden="true" />{isSaving ? 'Salvando...' : 'Salvar e adicionar outro'}
          </button>
          <button className="status-form__submit" type="submit" disabled={isSaving}
            onClick={() => setSaveAndAddAnother(false)}>
            <Save size={16} aria-hidden="true" />{isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
