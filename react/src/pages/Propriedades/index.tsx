import { useState } from 'react'
import { PropriedadeList } from '../../components/propriedades/list'
import { PropriedadeForm } from '../../components/propriedades/form'
import './styles.css'

export function PropriedadesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list')
  const [successMessage, setSuccessMessage] = useState('')
  const [formKey, setFormKey] = useState(0)

  function handleOpenCreate() {
    setSuccessMessage('')
    setViewMode('create')
  }

  function handleCreated(addAnother = false) {
    setSuccessMessage(addAnother ? 'Propriedade cadastrada com sucesso. Você pode adicionar outra.' : 'Cadastro realizado com sucesso.')
    if (addAnother) {
      setFormKey((value) => value + 1)
      return
    }
    setViewMode('list')
  }

  return (
    <div className="propriedades-section">
      {successMessage && (
        <p className="propriedades-section__success" role="status">{successMessage}</p>
      )}
      {viewMode === 'list' ? (
        <PropriedadeList onAdd={handleOpenCreate} />
      ) : (
        <PropriedadeForm key={formKey} onCancel={() => setViewMode('list')} onCreated={handleCreated} />
      )}
    </div>
  )
}
