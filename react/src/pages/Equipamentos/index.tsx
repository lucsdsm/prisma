import { useState } from 'react'

import { EquipamentoList } from '../../components/equipamentos/list'
import { EquipamentoForm } from '../../components/equipamentos/form'

import './styles.css'

type ViewMode = 'list' | 'create'

export function EquipamentosPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [successMessage, setSuccessMessage] = useState('')
  const [formKey, setFormKey] = useState(0)

  function handleOpenCreate() {
    setSuccessMessage('')
    setViewMode('create')
  }

  function handleCancelCreate() {
    setViewMode('list')
  }

  function handleCreated(addAnother = false) {
    setSuccessMessage(addAnother ? 'Equipamento cadastrado com sucesso. Você pode adicionar outro.' : 'Equipamento cadastrado com sucesso.')
    if (addAnother) {
      setFormKey((value) => value + 1)
      return
    }
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
          key={formKey}
          onCancel={handleCancelCreate}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}