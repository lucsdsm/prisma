import { useState } from 'react'
import { CargoList } from '../../components/cargos/list'
import { CargoForm } from '../../components/cargos/form'
import './styles.css'

export function CargosPage() {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list')
  const [successMessage, setSuccessMessage] = useState('')
  const [formKey, setFormKey] = useState(0)

  function handleOpenCreate() {
    setSuccessMessage('')
    setViewMode('create')
  }

  function handleCreated(addAnother = false) {
    setSuccessMessage(addAnother ? 'Cargo cadastrado com sucesso. Você pode adicionar outro.' : 'Cadastro realizado com sucesso.')
    if (addAnother) {
      setFormKey((value) => value + 1)
      return
    }
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
        <CargoForm key={formKey} onCancel={() => setViewMode('list')} onCreated={handleCreated} />
      )}
    </div>
  )
}
