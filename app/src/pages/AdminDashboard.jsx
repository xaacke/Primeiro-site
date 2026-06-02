import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { produtoService } from '../services/produtoService'
import { supabase } from '../lib/supabase'
import styles from './AdminDashboard.module.css'

function getStatus(estoque, estoqueMin) {
  if (estoque <= 0) return 'critico'
  if (estoque <= estoqueMin) return 'critico'
  if (estoque <= estoqueMin * 1.5) return 'atencao'
  return 'ok'
}

const statusLabel = { ok: 'OK', atencao: 'ATENÇÃO', critico: 'CRÍTICO' }

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [produtos, setProdutos] = useState([])
  const [totalPedidos, setTotalPedidos] = useState(0)
  const [valorTotal, setValorTotal] = useState(0)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const [prods, { data: pedidos }] = await Promise.all([
          produtoService.listarTodos(),
          supabase.from('pedidos').select('total'),
        ])
        setProdutos(prods)
        setTotalPedidos(pedidos?.length ?? 0)
        setValorTotal(pedidos?.reduce((acc, p) => acc + parseFloat(p.total), 0) ?? 0)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  const estoqueBaixo = produtos.filter(p => p.estoque <= p.estoque_minimo).length
  const recentes = [...produtos].sort((a, b) => a.estoque - b.estoque).slice(0, 8)

  const cards = [
    { label: 'Total de Produtos', valor: produtos.length, icon: '📦', cor: 'primary' },
    { label: 'Estoque Baixo', valor: estoqueBaixo, icon: '⚠️', cor: 'danger' },
    { label: 'Total de Pedidos', valor: totalPedidos, icon: '📈', cor: 'success' },
    { label: 'Valor em Pedidos', valor: `R$ ${valorTotal.toFixed(2).replace('.', ',')}`, icon: '💰', cor: 'secondary' },
  ]

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Visão geral do seu inventário</p>
        </div>

        {carregando ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Carregando...</p>
        ) : (
          <>
            <div className={styles.cardsGrid}>
              {cards.map(c => (
                <div key={c.label} className={`${styles.card} ${styles[`card__${c.cor}`]}`}>
                  <div className={styles.cardIcon}>{c.icon}</div>
                  <div>
                    <div className={styles.cardValor}>{c.valor}</div>
                    <div className={styles.cardLabel}>{c.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>⚡ Ações Rápidas</h2>
              <div className={styles.acoes}>
                <button className={styles.btnPrimary} onClick={() => navigate('/admin/produtos')}>+ Adicionar Produto</button>
                <button className={styles.btnSecondary} onClick={() => navigate('/admin/produtos')}>✏️ Gerenciar Produtos</button>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Produtos por Estoque</h2>
              <div className={styles.list}>
                {recentes.map(p => {
                  const status = getStatus(p.estoque, p.estoque_minimo)
                  const pct = Math.min(100, Math.round((p.estoque / ((p.estoque_minimo ?? 5) * 3)) * 100))
                  return (
                    <div key={p.id} className={styles.item}>
                      <span className={styles.itemNome}>{p.nome}</span>
                      <div className={styles.itemStatus}>
                        <span className={`${styles.statusBadge} ${styles[`status__${status}`]}`}>
                          {statusLabel[status]}
                        </span>
                      </div>
                      <div className={styles.itemDetalhes}>
                        <div className={styles.itemEstoque}>
                          <span className={styles.estoqueLabel}>Est. Atual</span>
                          <span className={styles.estoqueValor}>{p.estoque}</span>
                        </div>
                        <div className={styles.itemEstoque}>
                          <span className={styles.estoqueLabel}>Est. Mínimo</span>
                          <span className={styles.estoqueValor}>{p.estoque_minimo}</span>
                        </div>
                        <div className={styles.progressBar}>
                          <div
                            className={`${styles.progressFill} ${styles[`progress__${status}`]}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
