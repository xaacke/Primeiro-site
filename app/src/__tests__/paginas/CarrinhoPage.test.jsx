import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CarrinhoPage from '../../pages/CarrinhoPage'

const mockUseCart = vi.fn()

vi.mock('../../contexts/CartContext', () => ({
  useCart: () => mockUseCart(),
}))

////sempre retorna um usuário logado com role cliente
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ session: { user: { id: '1' } }, role: 'cliente' }),
}))


///Substitui a Navbar real por uma versão minimalista
vi.mock('../../components/Navbar', () => ({
  default: () => <nav>Navbar</nav>,
}))

const carritoVazio = {
  itens: [],
  remover: vi.fn(),
  alterarQuantidade: vi.fn(),
  total: 0,
  totalItens: 0,
}

const carritoComItens = {
  itens: [
    { id: '1', nome: 'Teclado Mecânico', preco: 299.9, quantidade: 2, imagem_url: null },
  ],
  remover: vi.fn(),
  alterarQuantidade: vi.fn(),
  total: 599.8,
  totalItens: 2,
}


////Antes de cada teste desse grupo, configura o mock para retornar o carrinho vazio
describe('CarrinhoPage — carrinho vazio', () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue(carritoVazio)
  })

  it('exibe mensagem de carrinho vazio', () => {
    render(<MemoryRouter><CarrinhoPage /></MemoryRouter>)
    expect(screen.getByText(/carrinho está vazio/i)).toBeInTheDocument()
  })

  it('exibe botão para ver produtos', () => {
    render(<MemoryRouter><CarrinhoPage /></MemoryRouter>)
    expect(screen.getByText(/ver produtos/i)).toBeInTheDocument()
  })
})


///carrinho com produto (Se aparece o título "Carrinho", e o nome do produto aparece na tela, Se o botão de finalizar pedido existe)
describe('CarrinhoPage — com itens', () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue(carritoComItens)
  })

  it('exibe o título Carrinho', () => {
    render(<MemoryRouter><CarrinhoPage /></MemoryRouter>)
    expect(screen.getByText('Carrinho')).toBeInTheDocument()
  })

  it('exibe nome do produto no carrinho', () => {
    render(<MemoryRouter><CarrinhoPage /></MemoryRouter>)
    expect(screen.getByText('Teclado Mecânico')).toBeInTheDocument()
  })

  it('exibe botão de finalizar pedido', () => {
    render(<MemoryRouter><CarrinhoPage /></MemoryRouter>)
    expect(screen.getByText(/finalizar pedido/i)).toBeInTheDocument()
  })
})
