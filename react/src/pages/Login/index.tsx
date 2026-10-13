import { LoginForm } from '../../components/auth'
import { PrismaLogo } from '../../components/brand'
import { ThemeSwitch } from '../../components/theme-switch'
import './styles.css'

interface LoginPageProps {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
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

        <LoginForm onSuccess={onLoginSuccess} />
      </section>

      <p className="login-page__footer">
        Prisma · Plataforma de Registro, Inventário, Suprimentos, Materiais e Ativos
      </p>
    </main>
  )
}
