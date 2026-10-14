import { PrismaLogo } from '../brand'
import { ThemeSwitch } from '../theme-switch'

import {
  navigationGroups,
  type SectionId,
} from './navigation'

import './styles.css'

interface SidebarProps {
  activeSection: SectionId
  onNavigate: (section: SectionId) => void
  onLogout: () => void
}

export function Sidebar({
  activeSection,
  onNavigate,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Menu do Prisma">
      <div className="sidebar__brand">
        <span className="sidebar__logo">
          <PrismaLogo size={28} />
        </span>

        <div className="sidebar__brand-text">
          <span className="sidebar__name">Prisma</span>
          <span className="sidebar__subtitle">Gestão de ativos de TI</span>
        </div>
      </div>

      <nav className="sidebar__navigation" aria-label="Navegação principal">
        {navigationGroups.map((group) => (
          <section
            className="sidebar__group"
            key={group.label}
            aria-label={group.label}
          >
            <h2 className="sidebar__group-title">
              {group.label}
            </h2>

            <ul className="sidebar__list">
              {group.items.map((item) => {
                const isActive = activeSection === item.id
                const Icon = item.icon

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`sidebar__item ${
                        isActive ? 'sidebar__item--active' : ''
                      }`}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => onNavigate(item.id)}
                    >
                      <Icon
                        className="sidebar__item-icon"
                        size={18}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />

                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </nav>

      <footer className="sidebar__footer">
        <div className="sidebar__theme">
          <span>Aparência</span>
          <ThemeSwitch />
        </div>

        <button
          className="sidebar__logout"
          type="button"
          onClick={onLogout}
        >
          Sair do sistema
        </button>
      </footer>
    </aside>
  )
}