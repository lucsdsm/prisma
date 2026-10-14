import { useState, type FormEvent } from 'react'
import { PrismaLogo } from '../../components/brand'
import { ThemeSwitch } from '../../components/theme-switch'
import { login } from '../../services/auth.service'
import './styles.css'

interface LoginPageProps {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await login({ email, password })
      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
      onLoginSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível realizar o login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-page__theme-switch">
        <ThemeSwitch />
      </div>

      <section className="login-page__card" aria-labelledby="login-title">
        <div className="login-page__brand">
          <span className="login-page__badge">
            <PrismaLogo size={26} />
          </span>

          <div>
            <h1 id="login-title">Prisma</h1>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__field">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="nome@organizacao.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={isLoading} />
          </div>
          <div className="login-form__field">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Digite sua senha" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={isLoading} />
          </div>
          {error && <p className="login-form__error" role="alert">{error}</p>}
          <button className="login-form__submit" type="submit" disabled={isLoading}>{isLoading ? 'Entrando...' : 'Entrar'}</button>
        </form>
      </section>

      <p className="login-page__footer">
        Prisma · Plataforma de Registro, Inventário, Suprimentos, Materiais e Ativos
      </p>
    </main>
  )
}
