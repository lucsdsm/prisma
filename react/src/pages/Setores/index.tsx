import { useState } from 'react'

import { SetorList } from '../../components/setores/list'
import { SetorForm } from '../../components/setores/form'

import './styles.css'

type ViewMode = 'list' | 'create'

export function SetoresPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [successMessage, setSuccessMessage] = useState('')
  const [formKey, setFormKey] = useState(0)

  function handleOpenCreate() {
    setSuccessMessage('')
    setViewMode('create')
  }

  function handleCreated(addAnother = false) {
    setSuccessMessage(addAnother ? 'Setor cadastrado com sucesso. Você pode adicionar outro.' : 'Setor cadastrado com sucesso.')
    if (addAnother) {
      setFormKey((value) => value + 1)
      return
    }
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
          key={formKey}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}