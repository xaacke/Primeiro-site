import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import styles from './CheckoutPage.module.css'

const ENDERECO_VAZIO = {
  nome: '', cep: '', rua: '', numero: '', complemento: '', cidade: '', estado: '',
}

const PAGAMENTOS = [
  { id: 'pix',      label: 'Pix',                    icon: '⚡', desc: 'Aprovação imediata' },
  { id: 'cartao',   label: 'Cartão de Crédito',       icon: '💳', desc: 'Em até 12x sem juros' },
  { id: 'boleto',   label: 'Boleto Bancário',         icon: '📄', desc: 'Vencimento em 3 dias úteis' },
  { id: 'dinheiro', label: 'Dinheiro na Entrega',     icon: '💵', desc: 'Pague no recebimento' },
]

function gerarNumeroPedido() {
  const ano = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `TK-${ano}-${rand}`
}

const frete = (total) => total >= 299 ? 0 : 19.9
const totalComFrete = (total) => total + frete(total)

export default function CheckoutPage() {
  const { itens, total, limpar } = useCart()
  const { session } = useAuth()
  const navigate = useNavigate()

  const [etapa, setEtapa] = useState(1)
  const [endereco, setEndereco] = useState(ENDERECO_VAZIO)
  const [pagamento, setPagamento] = useState('pix')
  const [cartao, setCartao] = useState({ numero: '', nome: '', validade: '', cvv: '' })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [numeroPedido, setNumeroPedido] = useState('')

  if (!session) { navigate('/login'); return null }
  if (itens.length === 0 && etapa !== 3) { navigate('/carrinho'); return null }

  function handleEndereco(e) {
    setEndereco(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleCartao(e) {
    let val = e.target.value
    if (e.target.name === 'numero') val = val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    if (e.target.name === 'validade') val = val.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2')
    if (e.target.name === 'cvv') val = val.replace(/\D/g, '').slice(0, 3)
    setCartao(prev => ({ ...prev, [e.target.name]: val }))
  }

  async function handleConfirmar() {
    setSalvando(true)
    setErro('')
    try {
      const numero = gerarNumeroPedido()
      const totalFinal = totalComFrete(total)
      const { error } = await supabase.from('pedidos').insert({
        usuario_id: session.user.id,
        numero,
        total: totalFinal,
        endereco,
        pagamento,
        itens: itens.map(i => ({
          produto_id: i.id,
          nome: i.nome,
          quantidade: i.quantidade,
          preco_unitario: i.preco,
        })),
      })
      if (error) throw error
      setNumeroPedido(numero)
      limpar()
      setEtapa(3)
    } catch {
      setErro('Erro ao finalizar pedido. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const fmt = (v) => v.toFixed(2).replace('.', ',')

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>

        {/* Steps */}
        {etapa < 3 && (
          <div className={styles.steps}>
            {['Entrega', 'Pagamento', 'Confirmação'].map((s, i) => (
              <div key={s} className={styles.stepItem}>
                <div className={`${styles.stepCircle} ${etapa > i + 1 ? styles.stepDone : etapa === i + 1 ? styles.stepAtivo : ''}`}>
                  {etapa > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`${styles.stepLabel} ${etapa === i + 1 ? styles.stepLabelAtivo : ''}`}>{s}</span>
                {i < 2 && <div className={`${styles.stepLinha} ${etapa > i + 1 ? styles.stepLinhaAtiva : ''}`} />}
              </div>
            ))}
          </div>
        )}

        <div className={styles.layout}>

          {/* ── Etapa 1: Entrega ── */}
          {etapa === 1 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitulo}>📦 Endereço de Entrega</h2>
              <div className={styles.formGrid}>
                <div className={`${styles.campo} ${styles.full}`}>
                  <label>Nome completo *</label>
                  <input name="nome" value={endereco.nome} onChange={handleEndereco} placeholder="João da Silva" required />
                </div>
                <div className={styles.campo}>
                  <label>CEP *</label>
                  <input name="cep" value={endereco.cep} onChange={handleEndereco} placeholder="00000-000" maxLength={9} required />
                </div>
                <div className={`${styles.campo} ${styles.flex2}`}>
                  <label>Rua / Avenida *</label>
                  <input name="rua" value={endereco.rua} onChange={handleEndereco} placeholder="Rua das Flores" required />
                </div>
                <div className={styles.campo}>
                  <label>Número *</label>
                  <input name="numero" value={endereco.numero} onChange={handleEndereco} placeholder="123" required />
                </div>
                <div className={`${styles.campo} ${styles.flex2}`}>
                  <label>Complemento</label>
                  <input name="complemento" value={endereco.complemento} onChange={handleEndereco} placeholder="Apto 4B" />
                </div>
                <div className={`${styles.campo} ${styles.flex2}`}>
                  <label>Cidade *</label>
                  <input name="cidade" value={endereco.cidade} onChange={handleEndereco} placeholder="São Paulo" required />
                </div>
                <div className={styles.campo}>
                  <label>Estado *</label>
                  <select name="estado" value={endereco.estado} onChange={handleEndereco} required>
                    <option value="">UF</option>
                    {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                className={styles.btnAvancar}
                onClick={() => setEtapa(2)}
                disabled={!endereco.nome || !endereco.cep || !endereco.rua || !endereco.numero || !endereco.cidade || !endereco.estado}
              >
                Continuar para Pagamento →
              </button>
            </div>
          )}

          {/* ── Etapa 2: Pagamento ── */}
          {etapa === 2 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitulo}>💳 Forma de Pagamento</h2>
              <div className={styles.pagamentos}>
                {PAGAMENTOS.map(p => (
                  <label key={p.id} className={`${styles.pagamentoOpcao} ${pagamento === p.id ? styles.pagamentoSelecionado : ''}`}>
                    <input type="radio" name="pagamento" value={p.id} checked={pagamento === p.id} onChange={() => setPagamento(p.id)} />
                    <span className={styles.pagamentoIcon}>{p.icon}</span>
                    <div>
                      <div className={styles.pagamentoLabel}>{p.label}</div>
                      <div className={styles.pagamentoDesc}>{p.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {pagamento === 'pix' && (
                <div className={styles.pixBox}>
                  <div className={styles.pixQr}>⬛⬛⬛<br/>⬜⬛⬜<br/>⬛⬛⬛</div>
                  <p className={styles.pixChave}>Chave Pix: <strong>contato@techstock.com</strong></p>
                  <p className={styles.pixInfo}>O QR Code será gerado após confirmação do pedido.</p>
                </div>
              )}

              {pagamento === 'cartao' && (
                <div className={styles.cartaoForm}>
                  <div className={styles.campo}>
                    <label>Número do cartão</label>
                    <input name="numero" value={cartao.numero} onChange={handleCartao} placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className={styles.campo}>
                    <label>Nome no cartão</label>
                    <input name="nome" value={cartao.nome} onChange={handleCartao} placeholder="JOAO DA SILVA" style={{ textTransform: 'uppercase' }} />
                  </div>
                  <div className={styles.cartaoRow}>
                    <div className={styles.campo}>
                      <label>Validade</label>
                      <input name="validade" value={cartao.validade} onChange={handleCartao} placeholder="MM/AA" />
                    </div>
                    <div className={styles.campo}>
                      <label>CVV</label>
                      <input name="cvv" value={cartao.cvv} onChange={handleCartao} placeholder="000" />
                    </div>
                  </div>
                </div>
              )}

              {pagamento === 'boleto' && (
                <div className={styles.boletoBox}>
                  <p>O boleto será gerado após a confirmação e enviado para o seu e-mail.</p>
                  <p className={styles.boletoAviso}>⚠️ O pedido será confirmado após o pagamento (até 3 dias úteis).</p>
                </div>
              )}

              {pagamento === 'dinheiro' && (
                <div className={styles.boletoBox}>
                  <p>Você pagará em dinheiro no momento da entrega.</p>
                  <p className={styles.boletoAviso}>💵 Tenha o valor exato disponível: <strong>R$ {fmt(totalComFrete(total))}</strong></p>
                </div>
              )}

              {erro && <p className={styles.erro}>{erro}</p>}

              <div className={styles.etapaAcoes}>
                <button className={styles.btnVoltar} onClick={() => setEtapa(1)}>← Voltar</button>
                <button className={styles.btnAvancar} onClick={handleConfirmar} disabled={salvando}>
                  {salvando ? 'Processando...' : 'Confirmar Pedido'}
                </button>
              </div>
            </div>
          )}

          {/* ── Etapa 3: Sucesso ── */}
          {etapa === 3 && (
            <div className={styles.sucesso}>
              <div className={styles.sucessoIcone}>✅</div>
              <h2 className={styles.sucessoTitulo}>Pedido confirmado!</h2>
              <div className={styles.numeroPedido}>
                <span>Número do pedido</span>
                <strong>{numeroPedido}</strong>
              </div>
              <p className={styles.sucessoMsg}>
                Obrigado pela sua compra! Você receberá um e-mail com os detalhes do pedido em breve.
              </p>
              <div className={styles.sucessoAcoes}>
                <button className={styles.btnShop} onClick={() => navigate('/shop')}>Continuar comprando</button>
              </div>
            </div>
          )}

          {/* ── Resumo do pedido ── */}
          {etapa < 3 && (
            <div className={styles.resumo}>
              <h3 className={styles.resumoTitulo}>Resumo do Pedido</h3>
              <div className={styles.resumoItens}>
                {itens.map(i => (
                  <div key={i.id} className={styles.resumoItem}>
                    <span className={styles.resumoNome}>{i.nome} <span className={styles.resumoQtd}>×{i.quantidade}</span></span>
                    <span>R$ {fmt(i.preco * i.quantidade)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.resumoLinha}>
                <span>Subtotal</span>
                <span>R$ {fmt(total)}</span>
              </div>
              <div className={styles.resumoLinha}>
                <span>Frete</span>
                <span className={frete(total) === 0 ? styles.gratis : ''}>{frete(total) === 0 ? 'Grátis' : `R$ ${fmt(frete(total))}`}</span>
              </div>
              <div className={styles.resumoTotal}>
                <span>Total</span>
                <span>R$ {fmt(totalComFrete(total))}</span>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
