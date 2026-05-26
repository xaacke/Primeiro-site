import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import styles from './QuickView.module.css'

export default function QuickView({ produto, onClose }) {
  const { session } = useAuth()
  const { adicionar } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [quantidade, setQuantidade] = useState(1)

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleAdicionar() {
    if (!session) { onClose(); return navigate('/login') }
    for (let i = 0; i < quantidade; i++) adicionar(produto)
    showToast(`${produto.nome} adicionado ao carrinho!`)
  }

  const emEstoque = produto.estoque > 0
  const estoqueBaixo = produto.estoque > 0 && produto.estoque <= (produto.estoque_minimo ?? 5)

  const Imagem = () => (
    <div className={styles.imagemCol}>
      {produto.imagem_url
        ? <img src={produto.imagem_url} alt={produto.nome} className={styles.imagem} />
        : <div className={styles.semImagem}>📦</div>
      }
    </div>
  )

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.handle} />
        <button className={styles.fecharBtn} onClick={onClose} aria-label="Fechar">✕</button>

        <div className={styles.layout}>
          {/* Topo mobile: imagem pequena + resumo lado a lado */}
          <div className={styles.topo}>
            <Imagem />
            <div className={styles.resumo}>
              <span className={styles.categoria}>{produto.categoria}</span>
              <h2 className={styles.nome}>{produto.nome}</h2>
              <span className={styles.preco}>R$ {produto.preco.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Corpo: detalhes completos */}
          <div className={styles.corpo}>
            {/* Visível só no desktop (CSS oculta no mobile via .resumo) */}
            <span className={styles.categoriaDesktop}>{produto.categoria}</span>
            <span className={styles.nomeDesktop}>{produto.nome}</span>
            <span className={styles.precoDesktop}>R$ {produto.preco.toFixed(2).replace('.', ',')}</span>

            <div className={styles.separador} />

            {produto.descricao && (
              <p className={styles.descricao}>{produto.descricao}</p>
            )}

            <div className={styles.estoque}>
              {!emEstoque && <span className={styles.semEstoque}>● Sem estoque</span>}
              {estoqueBaixo && <span className={styles.estoqueMinimo}>● Últimas {produto.estoque} unidades!</span>}
              {emEstoque && !estoqueBaixo && <span className={styles.emEstoque}>● Em estoque</span>}
            </div>

            {emEstoque && (
              <div className={styles.qtdRow}>
                <span className={styles.qtdLabel}>Quantidade</span>
                <div className={styles.qtdControle}>
                  <button onClick={() => setQuantidade(q => Math.max(1, q - 1))} disabled={quantidade <= 1}>−</button>
                  <span>{quantidade}</span>
                  <button onClick={() => setQuantidade(q => Math.min(produto.estoque, q + 1))} disabled={quantidade >= produto.estoque}>+</button>
                </div>
              </div>
            )}

            <button className={styles.adicionarBtn} onClick={handleAdicionar} disabled={!emEstoque}>
              {!session ? '🔒 Faça login para comprar' : !emEstoque ? 'Produto indisponível' : '+ Adicionar ao carrinho'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
