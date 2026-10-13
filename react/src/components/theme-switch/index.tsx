import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { themeColors, type ThemeMode } from '../../types/theme'
import { ThemeContext, useTheme } from './context'
import './styles.css'

const THEME_STORAGE_KEY = 'prisma-theme'

/** Retorna o tema persistido ou o tema padrão quando ainda não há preferência. */
function getInitialTheme(): ThemeMode {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)

  return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark'
}

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Expõe o estado do tema e coordena a transição visual entre as paletas.
 * As variáveis CSS ativas permanecem inalteradas até o fim do slide.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)
  const [appliedTheme, setAppliedTheme] = useState<ThemeMode>(theme)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = appliedTheme
    root.dataset.themeTransitioning = String(theme !== appliedTheme)
    root.style.setProperty(
      '--color-transition-background',
      themeColors[theme].pageBackground,
    )

    Object.entries(themeColors[appliedTheme]).forEach(([name, value]) => {
      root.style.setProperty(`--color-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value)
    })
  }, [appliedTheme, theme])

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (theme === appliedTheme) {
      return
    }

    const transitionTimeout = window.setTimeout(() => {
      setAppliedTheme(theme)
    }, 420)

    return () => window.clearTimeout(transitionTimeout)
  }, [theme, appliedTheme])

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      {theme !== appliedTheme && (
        <div
          className="theme-transition"
          style={{ backgroundColor: themeColors[theme].pageBackground }}
          aria-hidden="true"
        />
      )}
    </ThemeContext.Provider>
  )
}

/** Controle acessível, somente com ícone, para alternar entre os temas. */
export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      className="theme-switch"
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? 'Ativar tema escuro' : 'Ativar tema claro'}
      aria-pressed={isLight}
    >
      <span className="theme-switch__icon" aria-hidden="true">
        {isLight ? (
          <svg viewBox="0 0 24 24" role="presentation">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" role="presentation">
            <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5 8.5 8.5 0 1 0 20.5 14.6Z" />
          </svg>
        )}
      </span>
    </button>
  )
}
