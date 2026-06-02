import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import styles from './CarrinhoPage.module.css'

export default function CarrinhoPage() {
  const { itens, remover, alterarQuantidade, total, totalItens } = useCart()
  const { session } = useAuth()
  const navigate = useNavigate()

  function handleFinalizar() {
    if (!session) return navigate('/login')
    navigate('/checkout')
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.titulo}>Carrinho</h1>

        {itens.length === 0 ? (
          <div className={styles.vazio}>
            <span className={styles.vazioIcon}>🛒</span>
            <p>Seu carrinho está vazio.</p>
            <button className={styles.btnVoltar} onClick={() => navigate('/shop')}>
              Ver produtos
            </button>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.itens}>
              {itens.map(item => (
                <div key={item.id} className={styles.item}>
                  <img src={item.imagem_url} alt={item.nome} className={styles.itemImg} />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemNome}>{item.nome}</span>
                    <span className={styles.itemPreco}>
                      R$ {item.preco.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className={styles.itemQtd}>
                    <button onClick={() => alterarQuantidade(item.id, item.quantidade - 1)}>−</button>
                    <span>{item.quantidade}</span>
                    <button onClick={() => alterarQuantidade(item.id, item.quantidade + 1)}>+</button>
                  </div>
                  <span className={styles.itemSubtotal}>
                    R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                  </span>
                  <button className={styles.removerBtn} onClick={() => remover(item.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className={styles.resumo}>
              <h2 className={styles.resumoTitulo}>Resumo</h2>
              <div className={styles.resumoLinha}>
                <span>{totalItens} {totalItens === 1 ? 'item' : 'itens'}</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className={styles.resumoLinha}>
                <span>Frete</span>
                <span className={styles.gratis}>{total >= 299 ? 'Grátis' : 'R$ 19,90'}</span>
              </div>
              <div className={styles.resumoTotal}>
                <span>Total</span>
                <span>R$ {(total >= 299 ? total : total + 19.9).toFixed(2).replace('.', ',')}</span>
              </div>
              <button className={styles.finalizarBtn} onClick={handleFinalizar}>
                {session ? 'Finalizar Pedido →' : '🔒 Faça login para finalizar'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
