import { useState } from 'react'
import { TipoList } from '../../components/tipos/list'
import { TipoForm } from '../../components/tipos/form'
import './styles.css'

export function TiposPage() {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list')
  const [successMessage, setSuccessMessage] = useState('')
  const [formKey, setFormKey] = useState(0)

  function handleOpenCreate() {
    setSuccessMessage('')
    setViewMode('create')
  }

  function handleCreated(addAnother = false) {
    setSuccessMessage(addAnother ? 'Tipo cadastrado com sucesso. Você pode adicionar outro.' : 'Cadastro realizado com sucesso.')
    if (addAnother) {
      setFormKey((value) => value + 1)
      return
    }
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
        <TipoForm key={formKey} onCancel={() => setViewMode('list')} onCreated={handleCreated} />
      )}
    </div>
  )
}
