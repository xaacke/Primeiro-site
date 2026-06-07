import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { produtoService } from '../services/produtoService'
import { useToast } from '../contexts/ToastContext'
import styles from './AdminProdutos.module.css'

const FORM_VAZIO = {
  nome: '', descricao: '', preco: '', estoque: '',
  estoque_minimo: '', categoria: '', imagem_url: '',
}

export default function AdminProdutos() {
  const { showToast } = useToast()
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [salvando, setSalvando] = useState(false)
  const [confirmarDelete, setConfirmarDelete] = useState(null)
  const [busca, setBusca] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setCarregando(true)
    try {
      const data = await produtoService.listarTodos()
      setProdutos(data)
    } catch {
      showToast('Erro ao carregar produtos.', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  function abrirCriar() {
    setEditando(null)
    setForm(FORM_VAZIO)
    setModalAberto(true)
  }

  function abrirEditar(produto) {
    setEditando(produto.id)
    setForm({
      nome: produto.nome ?? '',
      descricao: produto.descricao ?? '',
      preco: produto.preco ?? '',
      estoque: produto.estoque ?? '',
      estoque_minimo: produto.estoque_minimo ?? '',
      categoria: produto.categoria ?? '',
      imagem_url: produto.imagem_url ?? '',
    })
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setEditando(null)
    setForm(FORM_VAZIO)
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      const payload = {
        ...form,
        preco: parseFloat(form.preco),
        estoque: parseInt(form.estoque),
        estoque_minimo: parseInt(form.estoque_minimo),
      }
      if (editando) {
        await produtoService.atualizar(editando, payload)
        showToast('Produto atualizado!')
      } else {
        await produtoService.criar(payload)
        showToast('Produto criado!')
      }
      fecharModal()
      carregar()
    } catch {
      showToast('Erro ao salvar produto.', 'erro')
    } finally {
      setSalvando(false)
    }
  }

  async function handleDeletar(id) {
    try {
      await produtoService.deletar(id)
      showToast('Produto removido.')
      setConfirmarDelete(null)
      carregar()
    } catch {
      showToast('Erro ao remover produto.', 'erro')
    }
  }

  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Gerenciar Produtos</h1>
            <p className={styles.pageSubtitle}>{produtos.length} produtos cadastrados</p>
          </div>
          <button className={styles.btnNovo} onClick={abrirCriar}>+ Novo Produto</button>
        </div>

        <input
          className={styles.busca}
          placeholder="Buscar por nome ou categoria..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />

        {carregando ? (
          <p className={styles.info}>Carregando...</p>
        ) : filtrados.length === 0 ? (
          <p className={styles.info}>Nenhum produto encontrado.</p>
        ) : (
          <div className={styles.tabela}>
            <div className={styles.tabelaHeader}>
              <span>Produto</span>
              <span>Categoria</span>
              <span>Preço</span>
              <span>Estoque</span>
              <span>Ações</span>
            </div>
            {filtrados.map(p => (
              <div key={p.id} className={styles.tabelaRow}>
                <div className={styles.colProduto}>
                  {p.imagem_url
                    ? <img src={p.imagem_url} alt={p.nome} className={styles.thumb} />
                    : <div className={styles.thumbPlaceholder}>📦</div>
                  }
                  <div className={styles.colProdutoInfo}>
                    <span className={styles.nomeProduto}>{p.nome}</span>
                    {p.descricao && <span className={styles.descProduto}>{p.descricao}</span>}
                  </div>
                </div>
                <span className={styles.colCategoria}>{p.categoria}</span>
                <span className={styles.colPreco}>R$ {parseFloat(p.preco).toFixed(2).replace('.', ',')}</span>
                <div className={styles.colEstoque}>
                  <span className={
                    p.estoque <= 0 ? styles.estoqueZero :
                    p.estoque <= p.estoque_minimo ? styles.estoqueAlerta :
                    styles.estoqueOk
                  }>{p.estoque}</span>
                  <span className={styles.estoqueMin}>mín. {p.estoque_minimo}</span>
                </div>
                <div className={styles.colAcoes}>
                  <button className={styles.btnEditar} onClick={() => abrirEditar(p)}>✏️</button>
                  <button className={styles.btnDeletar} onClick={() => setConfirmarDelete(p)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal criar/editar */}
      {modalAberto && (
        <div className={styles.overlay} onClick={fecharModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitulo}>{editando ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button className={styles.fecharBtn} onClick={fecharModal}>✕</button>
            </div>
            <form className={styles.form} onSubmit={handleSalvar}>
              <div className={styles.formGrid}>
                <div className={styles.campo}>
                  <label>Nome *</label>
                  <input name="nome" value={form.nome} onChange={handleChange} required />
                </div>
                <div className={styles.campo}>
                  <label>Categoria *</label>
                  <input name="categoria" value={form.categoria} onChange={handleChange} required />
                </div>
                <div className={styles.campo}>
                  <label>Preço (R$) *</label>
                  <input name="preco" type="number" step="0.01" min="0" value={form.preco} onChange={handleChange} required />
                </div>
                <div className={styles.campo}>
                  <label>Estoque *</label>
                  <input name="estoque" type="number" min="0" value={form.estoque} onChange={handleChange} required />
                </div>
                <div className={styles.campo}>
                  <label>Estoque Mínimo *</label>
                  <input name="estoque_minimo" type="number" min="0" value={form.estoque_minimo} onChange={handleChange} required />
                </div>
                <div className={styles.campo}>
                  <label>URL da Imagem</label>
                  <input name="imagem_url" value={form.imagem_url} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>
              <div className={styles.campoFull}>
                <label>Descrição *</label>
                <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={3} required />
              </div>
              <div className={styles.formAcoes}>
                <button type="button" className={styles.btnCancelar} onClick={fecharModal}>Cancelar</button>
                <button type="submit" className={styles.btnSalvar} disabled={salvando}>
                  {salvando ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Criar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmar delete */}
      {confirmarDelete && (
        <div className={styles.overlay} onClick={() => setConfirmarDelete(null)}>
          <div className={styles.modalDelete} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitulo}>Remover produto?</h2>
            <p className={styles.deleteMsg}>
              Tem certeza que deseja remover <strong>{confirmarDelete.nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className={styles.formAcoes}>
              <button className={styles.btnCancelar} onClick={() => setConfirmarDelete(null)}>Cancelar</button>
              <button className={styles.btnDeletarConfirm} onClick={() => handleDeletar(confirmarDelete.id)}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
