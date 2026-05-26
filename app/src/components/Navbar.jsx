import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { authService } from '../services/authService'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { session, role } = useAuth()
  const { totalItens } = useCart()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)

  const nomeUsuario = session?.user?.user_metadata?.nome
    ?? session?.user?.email?.split('@')[0]
    ?? ''

  async function handleSair() {
    await authService.logout()
    setMenuAberto(false)
    navigate('/')
  }

  function fecharMenu() { setMenuAberto(false) }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={fecharMenu}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>TechStock</span>
        </Link>

        {/* Nav desktop */}
        <nav aria-label="Navegação principal" className={styles.nav}>
          <Link to="/" className={pathname === '/' ? styles.linkAtivo : styles.link}>Home</Link>
          <Link to="/shop" className={pathname === '/shop' ? styles.linkAtivo : styles.link}>Shop</Link>
          <Link to="/curiosidades" className={pathname === '/curiosidades' ? styles.linkAtivo : styles.link}>Curiosidades</Link>
          {role === 'admin' && (
            <Link to="/admin" className={pathname.startsWith('/admin') ? styles.linkAtivo : styles.link}>Painel Admin</Link>
          )}
        </nav>

        <div className={styles.direita}>
          <Link to="/carrinho" className={styles.carrinhoBtn}>
            🛒
            {totalItens > 0 && <span className={styles.badge}>{totalItens}</span>}
          </Link>
          {session ? (
            <>
              <span className={styles.nomeUsuario}>{nomeUsuario}</span>
              <button onClick={handleSair} className={styles.sairBtn}>↩ Sair</button>
            </>
          ) : (
            <Link to="/login" className={styles.entrarBtn}>Entrar</Link>
          )}
          <button
            className={styles.hamburger}
            onClick={() => setMenuAberto(v => !v)}
            aria-label="Menu"
            aria-expanded={menuAberto}
          >
            <span className={menuAberto ? styles.barraAberta : styles.barra} />
            <span className={menuAberto ? styles.barraSumida : styles.barra} />
            <span className={menuAberto ? styles.barraAbertaInvertida : styles.barra} />
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <nav className={styles.menuMobile} aria-label="Menu mobile">
          <Link to="/" className={pathname === '/' ? styles.menuLinkAtivo : styles.menuLink} onClick={fecharMenu}>Home</Link>
          <Link to="/shop" className={pathname === '/shop' ? styles.menuLinkAtivo : styles.menuLink} onClick={fecharMenu}>Shop</Link>
          <Link to="/curiosidades" className={pathname === '/curiosidades' ? styles.menuLinkAtivo : styles.menuLink} onClick={fecharMenu}>Curiosidades</Link>
          {role === 'admin' && (
            <Link to="/admin" className={pathname.startsWith('/admin') ? styles.menuLinkAtivo : styles.menuLink} onClick={fecharMenu}>Painel Admin</Link>
          )}
          {session ? (
            <>
              <span className={styles.menuUsuario}>{nomeUsuario}</span>
              <button onClick={handleSair} className={styles.menuSairBtn}>↩ Sair</button>
            </>
          ) : (
            <Link to="/login" className={styles.menuLink} onClick={fecharMenu}>Entrar</Link>
          )}
        </nav>
      )}
    </header>
  )
}
