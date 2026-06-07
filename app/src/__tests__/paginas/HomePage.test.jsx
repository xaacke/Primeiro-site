import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '../../pages/HomePage'

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ session: null, role: 'cliente' }),
}))
vi.mock('../../contexts/CartContext', () => ({
  useCart: () => ({ adicionar: vi.fn(), totalItens: 0 }),
}))
vi.mock('../../contexts/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}))
vi.mock('../../components/Navbar', () => ({
  default: () => <nav>Navbar</nav>,
}))
vi.mock('../../components/QuickView', () => ({
  default: () => <div>QuickView</div>,
}))
vi.mock('../../services/produtoService', () => ({
  produtoService: {
    listarComEstoque: vi.fn().mockResolvedValue([
      { id: '1', nome: 'Teclado Mecânico', preco: 299.9, estoque: 10, categoria: 'Periféricos', descricao: 'Teclado RGB', imagem_url: null },
      { id: '2', nome: 'Mouse Gamer', preco: 149.9, estoque: 5, categoria: 'Periféricos', descricao: 'Mouse 7 botões', imagem_url: null },
    ]),
  },
}))

const renderHome = () => render(<MemoryRouter><HomePage /></MemoryRouter>)

describe('HomePage — testes de renderização', () => {
  it('exibe o hero com título da loja', () => {
    renderHome()
    expect(screen.getByRole('heading', { name: /techstock store/i })).toBeInTheDocument()
  })

  it('exibe mensagem de carregando inicialmente', () => {
    renderHome()
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('exibe os produtos após carregar', async () => {
    renderHome()
    await waitFor(() => {
      expect(screen.getByText('Teclado Mecânico')).toBeInTheDocument()
      expect(screen.getByText('Mouse Gamer')).toBeInTheDocument()
    })
  })

  it('exibe os 4 diferenciais', () => {
    renderHome()
    expect(screen.getByText('Entrega Rápida')).toBeInTheDocument()
    expect(screen.getByText('Compra Segura')).toBeInTheDocument()
    expect(screen.getByText('Frete Grátis')).toBeInTheDocument()
    expect(screen.getByText('Produtos Originais')).toBeInTheDocument()
  })

  it('exibe seção "Produtos em Destaque" após carregar', async () => {
    renderHome()
    await waitFor(() => {
      expect(screen.getByText('Produtos em Destaque')).toBeInTheDocument()
    })
  })

  it('botão pede login quando usuário não autenticado', async () => {
    renderHome()
    await waitFor(() => {
      const btns = screen.getAllByText(/faça login para comprar/i)
      expect(btns.length).toBeGreaterThan(0)
    })
  })
})
