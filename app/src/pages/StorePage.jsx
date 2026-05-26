import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import styles from './StorePage.module.css'

const destaques = [
  { id: 1, codigo: 'TECH001', nome: 'Mouse Gamer RGB', preco: 149.90, imagem: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&q=80' },
  { id: 2, codigo: 'TECH002', nome: 'Teclado Mecânico', preco: 299.90, imagem: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80' },
  { id: 3, codigo: 'TECH003', nome: 'Headset Gamer 7.1', preco: 249.90, imagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
  { id: 4, codigo: 'TECH004', nome: 'Monitor 27" 144Hz', preco: 1299.90, imagem: 'https://images.unsplash.com/photo-1527443224154-c4a573d5f5ec?w=300&q=80' },
]

const maisVendidos = [
  { id: 5, codigo: 'TECH005', nome: 'Webcam Full HD', preco: 189.90, imagem: 'https://images.unsplash.com/photo-1586791965591-15a85a2f7e69?w=300&q=80' },
  { id: 6, codigo: 'TECH006', nome: 'SSD 1TB NVMe', preco: 499.90, imagem: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&q=80' },
  { id: 7, codigo: 'TECH007', nome: 'Cadeira Gamer', preco: 899.90, imagem: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&q=80' },
  { id: 8, codigo: 'TECH008', nome: 'Placa de Vídeo RTX', preco: 3499.90, imagem: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80' },
]

const diferenciais = [
  { icon: '⚡', titulo: 'Entrega Rápida', desc: 'Receba em até 24h' },
  { icon: '🛡', titulo: 'Compra Segura', desc: 'Proteção garantida' },
  { icon: '🚚', titulo: 'Frete Grátis', desc: 'Acima de R$ 299' },
  { icon: '✅', titulo: 'Produtos Originais', desc: '100% garantido' },
]

function ProdutoCard({ produto }) {
  return (
    <div className={styles.produtoCard}>
      <img src={produto.imagem} alt={produto.nome} className={styles.produtoImg} />
      <div className={styles.produtoInfo}>
        <span className={styles.produtoCodigo}>{produto.codigo}</span>
        <h3 className={styles.produtoNome}>{produto.nome}</h3>
        <span className={styles.produtoPreco}>R$ {produto.preco.toFixed(2).replace('.', ',')}</span>
        <button className={styles.addCarrinhoBtn}>+ Adicionar ao carrinho</button>
      </div>
    </div>
  )
}

export default function StorePage() {
  const { session, role } = useAuth()
  const navigate = useNavigate()

  const nomeUsuario = session?.user?.user_metadata?.nome
    ?? session?.user?.email?.split('@')[0]
    ?? 'Usuário'

  async function handleSair() {
    await authService.logout()
    navigate('/login')
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/loja" className={styles.logo}>
            <span className={styles.logoIcon}>⬡</span>
            <div>
              <div className={styles.logoTitle}>TechStock Store</div>
              <div className={styles.logoSub}>Tecnologia e Acessórios</div>
            </div>
          </Link>

          <nav className={styles.nav}>
            <Link to="/loja" className={styles.navLinkActive}>🏠 Home</Link>
            <Link to="/blog" className={styles.navLink}>📰 Curiosidades</Link>
            {role === 'admin' && (
              <Link to="/shop" className={styles.navLink}>⚙ Produtos</Link>
            )}
          </nav>

          <div className={styles.headerRight}>
            <span className={styles.userName}>{nomeUsuario}</span>
            <button className={styles.carrinhoBtn}>🛒 Carrinho <span className={styles.carrinhoBadge}>0</span></button>
            <button onClick={handleSair} className={styles.sairBtn}>↩ Sair</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>Novidades</span>
          <h1 className={styles.heroTitle}>Bem-vindo à<br />TechStock Store</h1>
          <p className={styles.heroSub}>Os melhores produtos de tecnologia e acessórios com os melhores preços do mercado</p>
          <Link to="/loja/produtos" className={styles.heroBtn}>🛍 Ver Todos os Produtos</Link>
        </div>
      </section>

      {/* Diferenciais */}
      <section className={styles.diferenciais}>
        {diferenciais.map(d => (
          <div key={d.titulo} className={styles.diferencialCard}>
            <span className={styles.diferencialIcon}>{d.icon}</span>
            <div>
              <div className={styles.diferencialTitulo}>{d.titulo}</div>
              <div className={styles.diferencialDesc}>{d.desc}</div>
            </div>
          </div>
        ))}
      </section>

      <main className={styles.main}>
        {/* Produtos em Destaque */}
        <section className={styles.secao}>
          <div className={styles.secaoHeader}>
            <div>
              <h2 className={styles.secaoTitulo}>Produtos em Destaque</h2>
              <p className={styles.secaoSub}>Os melhores produtos selecionados para você</p>
            </div>
            <button className={styles.verTodosBtn}>Ver Todos</button>
          </div>
          <div className={styles.produtosGrid}>
            {destaques.map(p => <ProdutoCard key={p.id} produto={p} />)}
          </div>
        </section>

        {/* Mais Vendidos */}
        <section className={styles.secao}>
          <div className={styles.secaoHeader}>
            <div>
              <h2 className={styles.secaoTitulo}>📈 Mais Vendidos</h2>
            </div>
          </div>
          <div className={styles.produtosGrid}>
            {maisVendidos.map(p => <ProdutoCard key={p.id} produto={p} />)}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerCol}>
            <h4>Sobre Nós</h4>
            <p>TechStock Store — Os melhores produtos de tecnologia e acessórios</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Atendimento</h4>
            <p>Segunda a Sexta: 8h – 18h</p>
            <p>Sábado: 8h – 14h</p>
            <p>contato@techstock.com</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Links Rápidos</h4>
            <Link to="/loja/produtos" className={styles.footerLink}>Produtos</Link>
            <Link to="/blog" className={styles.footerLink}>Curiosidades</Link>
            <Link to="/carrinho" className={styles.footerLink}>Carrinho</Link>
          </div>
          <div className={styles.footerCol}>
            <h4>Formas de Pagamento</h4>
            <p>Cartão de Crédito, Débito, Pix e Boleto</p>
          </div>
        </div>
        <div className={styles.footerCopy}>© 2026 TechStock Store. Todos os direitos reservados.</div>
      </footer>
    </div>
  )
}
