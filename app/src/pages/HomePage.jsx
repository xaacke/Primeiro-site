import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import Navbar from '../components/Navbar'
import QuickView from '../components/QuickView'
import { produtoService } from '../services/produtoService'
import styles from './HomePage.module.css'

const diferenciais = [
  { icon: '⚡', titulo: 'Entrega Rápida', desc: 'Receba em até 24h' },
  { icon: '🛡', titulo: 'Compra Segura', desc: 'Proteção garantida' },
  { icon: '🚚', titulo: 'Frete Grátis', desc: 'Acima de R$ 299' },
  { icon: '✅', titulo: 'Produtos Originais', desc: '100% garantido' },
]

function ProdutoCard({ produto, onVerDetalhes }) {
  const { session } = useAuth()
  const { adicionar } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  function handleComprar(e) {
    e.stopPropagation()
    if (!session) return navigate('/login')
    adicionar(produto)
    showToast(`${produto.nome} adicionado ao carrinho!`)
  }

  return (
    <div className={styles.produtoCard} onClick={() => onVerDetalhes(produto)}>
      {produto.imagem_url
        ? <img src={produto.imagem_url} alt={produto.nome} className={styles.produtoImg} />
        : <div className={styles.produtoImgPlaceholder}>📦</div>
      }
      <div className={styles.produtoInfo}>
        <span className={styles.produtoCodigo}>{produto.categoria}</span>
        <h3 className={styles.produtoNome}>{produto.nome}</h3>
        {produto.descricao && (
          <p className={styles.produtoDesc}>{produto.descricao}</p>
        )}
        <span className={styles.produtoPreco}>
          R$ {produto.preco.toFixed(2).replace('.', ',')}
        </span>
        <button className={styles.verDetalhesBtn} onClick={e => { e.stopPropagation(); onVerDetalhes(produto) }}>
          Ver detalhes
        </button>
        <button className={styles.addCarrinhoBtn} onClick={handleComprar}>
          {!session ? '🔒 Faça login para comprar' : '+ Adicionar ao carrinho'}
        </button>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)

  useEffect(() => {
    produtoService.listarComEstoque()
      .then(setProdutos)
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))
  }, [])

  const destaques = produtos.slice(0, 4)
  const maisVendidos = produtos.slice(4)

  return (
    <div className={styles.page}>
      <Navbar />
      {produtoSelecionado && (
        <QuickView produto={produtoSelecionado} onClose={() => setProdutoSelecionado(null)} />
      )}

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>Novidades</span>
          <h1 className={styles.heroTitle}>Bem-vindo à<br />TechStock Store</h1>
          <p className={styles.heroSub}>
            Os melhores produtos de tecnologia e acessórios com os melhores preços do mercado
          </p>
          <Link to="/shop" className={styles.heroBtn}>🛍 Ver Todos os Produtos</Link>
        </div>
      </section>

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
        {carregando && <p className={styles.info}>Carregando produtos...</p>}
        {erro && <p className={styles.erro}>{erro}</p>}

        {!carregando && !erro && (
          <>
            <section className={styles.secao}>
              <div className={styles.secaoHeader}>
                <div>
                  <h2 className={styles.secaoTitulo}>Produtos em Destaque</h2>
                  <p className={styles.secaoSub}>Os melhores produtos selecionados para você</p>
                </div>
                <Link to="/shop" className={styles.verTodosBtn}>Ver Todos</Link>
              </div>
              <div className={styles.produtosGrid}>
                {destaques.map(p => <ProdutoCard key={p.id} produto={p} onVerDetalhes={setProdutoSelecionado} />)}
              </div>
            </section>

            {maisVendidos.length > 0 && (
              <section className={styles.secao}>
                <h2 className={styles.secaoTitulo}>📈 Mais Produtos</h2>
                <div className={styles.produtosGrid}>
                  {maisVendidos.map(p => <ProdutoCard key={p.id} produto={p} onVerDetalhes={setProdutoSelecionado} />)}
                </div>
              </section>
            )}
          </>
        )}
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
            <Link to="/shop" className={styles.footerLink}>Shop</Link>
            <Link to="/curiosidades" className={styles.footerLink}>Curiosidades</Link>
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
