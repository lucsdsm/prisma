import { useState } from 'react'

import { EquipamentoList } from '../../components/equipamentos/list'
import { EquipamentoForm } from '../../components/equipamentos/form'

import './styles.css'

type ViewMode = 'list' | 'create'

export function EquipamentosPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [successMessage, setSuccessMessage] = useState('')

  function handleOpenCreate() {
    setSuccessMessage('')
    setViewMode('create')
  }

  function handleCancelCreate() {
    setViewMode('list')
  }

  function handleCreated() {
    setSuccessMessage('Equipamento cadastrado com sucesso.')
    setViewMode('list')
  }

  return (
    <div className="equipamentos-section">
      {successMessage && (
        <p className="equipamentos-section__success" role="status">
          {successMessage}
        </p>
      )}

      {viewMode === 'list' ? (
        <EquipamentoList onAdd={handleOpenCreate} />
      ) : (
        <EquipamentoForm
          onCancel={handleCancelCreate}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}