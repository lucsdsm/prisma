export type ThemeMode = 'dark' | 'light'

/** Tokens semânticos de cor consumidos pelas variáveis CSS da aplicação. */
export interface ThemeColors {
  pageBackground: string
  surface: string
  surfaceMuted: string
  border: string
  text: string
  textMuted: string
  textSubtle: string
  accent: string
  accentContrast: string
  focus: string
  danger: string
  dangerBackground: string
}

/** Paleta completa de cada tema suportado pela aplicação. */
export const themeColors: Record<ThemeMode, ThemeColors> = {
  dark: {
    pageBackground: '#050505',
    surface: '#0b0b0c',
    surfaceMuted: 'rgba(255, 255, 255, 0.04)',
    border: 'rgba(255, 255, 255, 0.12)',
    text: '#fafafa',
    textMuted: 'rgba(255, 255, 255, 0.68)',
    textSubtle: 'rgba(255, 255, 255, 0.28)',
    accent: '#f4f4f5',
    accentContrast: '#0a0a0a',
    focus: 'rgba(255, 255, 255, 0.38)',
    danger: '#fca5a5',
    dangerBackground: 'rgba(220, 38, 38, 0.12)',
  },
  light: {
    pageBackground: '#f1f5f9',
    surface: '#ffffff',
    surfaceMuted: '#f8fafc',
    border: '#cbd5e1',
    text: '#0f172a',
    textMuted: '#475569',
    textSubtle: '#64748b',
    accent: '#0f172a',
    accentContrast: '#ffffff',
    focus: '#64748b',
    danger: '#b91c1c',
    dangerBackground: '#fef2f2',
  },
}
