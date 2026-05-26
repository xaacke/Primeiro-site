import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import styles from './Header.module.css'

/**
 * Header compartilhado entre todas as páginas internas.
 * @param {string} activeRoute - rota atual para destacar o link ativo
 */
export default function Header({ activeRoute }) {
  const { session, role } = useAuth()
  const navigate = useNavigate()

  const nomeUsuario = session?.user?.user_metadata?.nome
    ?? session?.user?.email?.split('@')[0]
    ?? 'Usuário'

  const roleLabel = role === 'admin' ? 'Administrador' : 'Cliente'

  async function handleSair() {
    await authService.logout()
    navigate('/login')
  }

  // Admin vê o link do Dashboard, cliente não
  const links = [
    { to: '/blog', label: 'Home' },
    { to: '/shop', label: 'Produtos' },
    ...(role === 'admin' ? [{ to: '/admin', label: 'Dashboard' }] : []),
  ]

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/blog" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <div>
            <div className={styles.logoTitle}>TechStock Pro</div>
            <div className={styles.logoSub}>Gestão Inteligente</div>
          </div>
        </Link>

        <nav aria-label="Navegação principal" className={styles.nav}>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={activeRoute === link.to ? styles.navLinkActive : styles.navLink}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className={styles.right}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{nomeUsuario}</span>
          <span className={styles.userRole}>{roleLabel}</span>
        </div>
        <button onClick={handleSair} className={styles.sairBtn}>↩ Sair</button>
      </div>
    </header>
  )
}
