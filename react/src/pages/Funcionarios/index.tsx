import { useState } from 'react'

import { FuncionarioList } from '../../components/funcionarios/list'
import { FuncionarioForm } from '../../components/funcionarios/form'

import './styles.css'

type ViewMode = 'list' | 'create'

export function FuncionariosPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [successMessage, setSuccessMessage] = useState('')

  function handleOpenCreate() {
    setSuccessMessage('')
    setViewMode('create')
  }

  function handleCreated() {
    setSuccessMessage('Funcionário cadastrado com sucesso.')
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
          onCancel={() => setViewMode('list')}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}