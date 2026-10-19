import { useState } from 'react'

import { FuncionarioList } from '../../components/funcionarios/list'
import { FuncionarioForm } from '../../components/funcionarios/form'

import './styles.css'

type ViewMode = 'list' | 'create'

export function FuncionariosPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [successMessage, setSuccessMessage] = useState('')
  const [formKey, setFormKey] = useState(0)

  function handleOpenCreate() {
    setSuccessMessage('')
    setViewMode('create')
  }

  function handleCreated(addAnother = false) {
    setSuccessMessage(addAnother ? 'Funcionário cadastrado com sucesso. Você pode adicionar outro.' : 'Funcionário cadastrado com sucesso.')
    if (addAnother) {
      setFormKey((value) => value + 1)
      return
    }
    setViewMode('list')
  }

  return (
    <div className="funcionarios-section">
      {successMessage && (
        <p className="funcionarios-section__success" role="status">
          {successMessage}
        </p>
      )}

      {viewMode === 'list' ? (
        <FuncionarioList onAdd={handleOpenCreate} />
      ) : (
        <FuncionarioForm
          key={formKey}
          onCancel={() => setViewMode('list')}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}