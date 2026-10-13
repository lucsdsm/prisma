import { createContext, useContext } from 'react'
import type { ThemeMode } from '../../types/theme'

export interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
}

/** Contexto separado para que o Fast Refresh preserve o estado dos componentes. */
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
)

/** Lê o contexto e falha explicitamente quando usado fora do provedor. */
export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider.')
  }

  return context
}
