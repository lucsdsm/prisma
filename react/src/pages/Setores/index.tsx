import { useState } from 'react'

import { SetorList } from '../../components/setores/list'
import { SetorForm } from '../../components/setores/form'

import './styles.css'

type ViewMode = 'list' | 'create'

export function SetoresPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [successMessage, setSuccessMessage] = useState('')

  function handleOpenCreate() {
    setSuccessMessage('')
    setViewMode('create')
  }

  function handleCreated() {
    setSuccessMessage('Setor cadastrado com sucesso.')
    setViewMode('list')
  }

  return (
    <div className="setores-section">
      {successMessage && (
        <p className="setores-section__success" role="status">
          {successMessage}
        </p>
      )}

      {viewMode === 'list' ? (
        <SetorList onAdd={handleOpenCreate} />
      ) : (
        <SetorForm
          onCancel={() => setViewMode('list')}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}