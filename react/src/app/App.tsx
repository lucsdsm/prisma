import { useState } from 'react'
import { LoginPage } from '../pages/Login/LoginPage'
import { isAuthenticated, logout } from '../services/auth.service'
import './App.css'

export default function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated())

  function handleLoginSuccess() {
    setAuthenticated(true)
  }

  function handleLogout() {
    logout()
    setAuthenticated(false)
  }

  if (!authenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <main className="app-dashboard">
      <section className="app-dashboard__content">
        <p className="app-dashboard__eyebrow">Acesso autenticado</p>

        <h1>Bem-vindo ao inventário de TI</h1>

        <p>
          O login foi realizado com sucesso. Nesta área você poderá montar,
          posteriormente, o dashboard e as telas de equipamentos.
        </p>

        <button type="button" onClick={handleLogout}>
          Sair
        </button>
      </section>
    </main>
  )
}