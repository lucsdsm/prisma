import { useState } from 'react'
import { TipoList } from '../../components/tipos/list'
import { TipoForm } from '../../components/tipos/form'
import './styles.css'

export function TiposPage() {
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
    <div className="tipos-section">
      {successMessage && (
        <p className="tipos-section__success" role="status">{successMessage}</p>
      )}
      {viewMode === 'list' ? (
        <TipoList onAdd={handleOpenCreate} />
      ) : (
        <TipoForm onCancel={() => setViewMode('list')} onCreated={handleCreated} />
      )}
    </div>
  )
}
