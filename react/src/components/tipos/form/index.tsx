import { useId, useState, type FormEvent } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { Select } from '../../ui/select'
import { criarTipo } from '../../../services/tipos/tipos.service'
import './styles.css'

interface TipoFormProps {
  onCancel: () => void
  onCreated: () => void
}

interface FormValues {
  nome: string
  ordem: string
  ativo: boolean
}

const initialForm: FormValues = { nome: '', ordem: '0', ativo: true }

export function TipoForm({ onCancel, onCreated }: TipoFormProps) {
  const formId = useId()
  const [form, setForm] = useState<FormValues>(initialForm)
  const [submitError, setSubmitError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const isDirty = form.nome !== initialForm.nome || form.ordem !== initialForm.ordem || form.ativo !== initialForm.ativo

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
    const ordem = Number(form.ordem)
    if (form.ordem.trim() === '' || !Number.isInteger(ordem) || ordem < 0 || ordem > 32767) {
      setSubmitError('Informe uma ordem inteira entre 0 e 32767.')
      return
    }
    setIsSaving(true)
    setSubmitError('')
    try {
      await criarTipo({ nome: form.nome.trim(), ordem, ativo: form.ativo })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Não foi possível realizar o cadastro.')
      setIsSaving(false)
      return
    }
    setIsSaving(false)
    onCreated()
  }

  return (
    <div className="tipos-form">
      <button className="tipos-form__back" type="button" onClick={handleCancel} disabled={isSaving}>
        <ArrowLeft size={16} aria-hidden="true" />Voltar para a listagem
      </button>
      <header className="tipos-form__header">
        <h2>Novo tipo de equipamento</h2>
        <p>Preencha os dados abaixo. Campos com * são obrigatórios.</p>
      </header>
      <form className="tipos-form__body" onSubmit={handleSubmit} aria-busy={isSaving}>
        <fieldset className="tipos-form__section" disabled={isSaving}>
          <legend className="tipos-form__legend">Informações do cadastro</legend>
          <div className="tipos-form__grid">
            <div className="tipos-form__field tipos-form__field--full">
              <label htmlFor={`${formId}-nome`}>Nome *</label>
              <input id={`${formId}-nome`} value={form.nome} maxLength={100}
                placeholder="Ex.: Notebook" required
                onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))} />
            </div>
            <div className="tipos-form__field">
              <label htmlFor={`${formId}-ordem`}>Ordem *</label>
              <input id={`${formId}-ordem`} type="number" min={0} max={32767} step={1}
                value={form.ordem} required
                onChange={(event) => setForm((current) => ({ ...current, ordem: event.target.value }))} />
              <p className="tipos-form__hint">Valores menores aparecem primeiro na ordenação padrão.</p>
            </div>
            <div className="tipos-form__field">
              <label htmlFor={`${formId}-ativo`}>Situação</label>
              <Select id={`${formId}-ativo`} name="situacao" value={form.ativo ? 'ativo' : 'inativo'}
                onValueChange={(value) => setForm((current) => ({ ...current, ativo: value === 'ativo' }))}
                options={[{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }]}
                disabled={isSaving} />
              <p className="tipos-form__hint">Inativar preserva os vínculos existentes.</p>
            </div>
          </div>
        </fieldset>
        {submitError && <p className="tipos-form__error" role="alert">{submitError}</p>}
        <div className="tipos-form__actions">
          <button className="tipos-form__cancel" type="button" onClick={handleCancel} disabled={isSaving}>Cancelar</button>
          <button className="tipos-form__submit" type="submit" disabled={isSaving}>
            <Save size={16} aria-hidden="true" />{isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
