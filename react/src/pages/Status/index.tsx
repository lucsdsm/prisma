import { useState } from 'react'
import { StatusList } from '../../components/status/list'
import { StatusForm } from '../../components/status/form'
import './styles.css'

export function StatusPage() {
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
    <div className="status-section">
      {successMessage && (
        <p className="status-section__success" role="status">{successMessage}</p>
      )}
      {viewMode === 'list' ? (
        <StatusList onAdd={handleOpenCreate} />
      ) : (
        <StatusForm onCancel={() => setViewMode('list')} onCreated={handleCreated} />
      )}
    </div>
  )
}
