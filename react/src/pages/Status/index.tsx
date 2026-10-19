import { useState } from 'react'
import { StatusList } from '../../components/status/list'
import { StatusForm } from '../../components/status/form'
import './styles.css'

export function StatusPage() {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list')
  const [successMessage, setSuccessMessage] = useState('')
  const [formKey, setFormKey] = useState(0)

  function handleOpenCreate() {
    setSuccessMessage('')
    setViewMode('create')
  }

  function handleCreated(addAnother = false) {
    setSuccessMessage(addAnother ? 'Status cadastrado com sucesso. Você pode adicionar outro.' : 'Cadastro realizado com sucesso.')
    if (addAnother) {
      setFormKey((value) => value + 1)
      return
    }
    setViewMode('list')
  }

  return (
    <div className="status-section">
      {successMessage && (
        <p className="status-section__success" role="status">{successMessage}</p>
      )}
      {viewMode === 'list' ? (
        <StatusList onAdd={handleOpenCreate} />
      ) : (
        <StatusForm key={formKey} onCancel={() => setViewMode('list')} onCreated={handleCreated} />
      )}
    </div>
  )
}
