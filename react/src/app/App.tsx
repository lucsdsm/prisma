import { useEffect, useState } from 'react'

import { LoginPage } from '../pages/Login'
import { Sidebar } from '../components/sidebar'

import {
  getNavigationItem,
  type SectionId,
} from '../components/sidebar/navigation'

import {
  isAuthenticated,
  logout,
} from '../services/login/login.service'

import { section } from './section'

import './App.css'

export default function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated)

  const [activeSection, setActiveSection] =
    useState<SectionId>('equipamentos')

  useEffect(() => {
    function handleSessionExpired() {
      setAuthenticated(false)
      setActiveSection('equipamentos')
    }

    window.addEventListener('auth:logout', handleSessionExpired)
    return () => window.removeEventListener('auth:logout', handleSessionExpired)
  }, [])

  function handleLoginSuccess() {
    setActiveSection('equipamentos')
    setAuthenticated(true)
  }

  function handleLogout() {
    logout()
    setAuthenticated(false)
    setActiveSection('equipamentos')
  }

  if (!authenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  const currentSection = getNavigationItem(activeSection)
  const CurrentPage = section[activeSection]

  return (
    <div className="app-layout">
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={handleLogout}
      />

      <main className="app-main">
        <header className="app-main__header">
          <p className="app-main__eyebrow">Prisma</p>

          <h1>{currentSection.label}</h1>

          <p className="app-main__description">
            {currentSection.description}
          </p>
        </header>

        <section
          className="app-main__panel"
          aria-label={`Conteúdo de ${currentSection.label}`}
        >
          <CurrentPage />
        </section>
      </main>
    </div>
  )
}