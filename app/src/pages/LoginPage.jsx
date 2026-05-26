import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [modo, setModo] = useState('login') // 'login' | 'cadastro'
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      if (modo === 'login') {
        const data = await authService.login(email, senha)
        const role = authService.getRoleDoUsuario(data.session)
        navigate(role === 'admin' ? '/admin' : '/')
      } else {
        await authService.cadastrar(email, senha, nome)
        navigate('/')
      }
    } catch (err) {
      setErro(err.message ?? 'Erro ao autenticar. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>⬡</div>
          <h1 className={styles.logoTitle}>TechStock Pro</h1>
          <p className={styles.logoSubtitle}>Sistema de Gestão de Estoque</p>
        </div>

        <div className={styles.modoToggle}>
          <button
            className={modo === 'login' ? styles.modoAtivo : styles.modoBtn}
            onClick={() => setModo('login')}
            type="button"
          >
            Entrar
          </button>
          <button
            className={modo === 'cadastro' ? styles.modoAtivo : styles.modoBtn}
            onClick={() => setModo('cadastro')}
            type="button"
          >
            Cadastrar
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {modo === 'cadastro' && (
            <div className={styles.field}>
              <label className={styles.label}>Nome</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>E-mail</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>✉</span>
              <input
                className={styles.input}
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                className={styles.input}
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className={styles.olhoBtn}
                onClick={() => setMostrarSenha(v => !v)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <button className={styles.btn} type="submit" disabled={carregando}>
            {carregando ? 'Aguarde...' : modo === 'login' ? '🔒 Acessar Sistema' : '✓ Criar conta'}
          </button>
        </form>
      </div>
    </div>
  )
}
