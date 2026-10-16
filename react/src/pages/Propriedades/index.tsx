import { useState } from 'react'
import { PropriedadeList } from '../../components/propriedades/list'
import { PropriedadeForm } from '../../components/propriedades/form'
import './styles.css'

export function PropriedadesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list')
  const [successMessage, setSuccessMessage] = useState('')

  function handleOpenCreate() {
    setSuccessMessage('')
    setViewMode('create')
  }

  function handleCreated() {
    setSuccessMessage('Cadastro realizado com sucesso.')
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
        <PropriedadeForm onCancel={() => setViewMode('list')} onCreated={handleCreated} />
      )}
    </div>
  )
}
