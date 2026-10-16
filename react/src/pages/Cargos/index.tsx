import { useState } from 'react'
import { CargoList } from '../../components/cargos/list'
import { CargoForm } from '../../components/cargos/form'
import './styles.css'

export function CargosPage() {
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
    <div className="cargos-section">
      {successMessage && (
        <p className="cargos-section__success" role="status">{successMessage}</p>
      )}
      {viewMode === 'list' ? (
        <CargoList onAdd={handleOpenCreate} />
      ) : (
        <CargoForm onCancel={() => setViewMode('list')} onCreated={handleCreated} />
      )}
    </div>
  )
}
