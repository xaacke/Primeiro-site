import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CheckoutPage from '../../pages/CheckoutPage'

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ session: { user: { id: '1', email: 'test@test.com' } } }),
}))

vi.mock('../../contexts/CartContext', () => ({
  useCart: () => ({
    itens: [{ id: '1', nome: 'Mouse Gamer', preco: 149.9, quantidade: 1 }],
    total: 149.9,
    limpar: vi.fn(),
  }),
}))

vi.mock('../../contexts/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}))

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}))

vi.mock('../../components/Navbar', () => ({
  default: () => <nav>Navbar</nav>,
}))

const renderCheckout = () => render(<MemoryRouter><CheckoutPage /></MemoryRouter>)

describe('CheckoutPage — testes de renderização', () => {
  it('renderiza a etapa 1 por padrão', () => {
    renderCheckout()
    expect(screen.getByText(/endereço de entrega/i)).toBeInTheDocument()
  })

  it('exibe os 3 steps no topo', () => {
    renderCheckout()
    expect(screen.getByText('Entrega')).toBeInTheDocument()
    expect(screen.getByText('Pagamento')).toBeInTheDocument()
    expect(screen.getByText('Confirmação')).toBeInTheDocument()
  })

  it('exibe campos de endereço na etapa 1', () => {
    renderCheckout()
    expect(screen.getByPlaceholderText(/joão da silva/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/00000-000/i)).toBeInTheDocument()
  })

  it('botão continuar fica desabilitado com campos vazios', () => {
    renderCheckout()
    const btn = screen.getByText(/continuar para pagamento/i)
    expect(btn).toBeDisabled()
  })

  it('exibe resumo do pedido com item do carrinho', () => {
    renderCheckout()
    expect(screen.getByText('Mouse Gamer')).toBeInTheDocument()
  })

  it('avança para etapa 2 ao preencher endereço', () => {
    renderCheckout()
    fireEvent.change(screen.getByPlaceholderText(/joão da silva/i), { target: { value: 'Maria Silva' } })
    fireEvent.change(screen.getByPlaceholderText(/00000-000/i), { target: { value: '01310-100' } })
    fireEvent.change(screen.getByPlaceholderText(/rua das flores/i), { target: { value: 'Av. Paulista' } })
    fireEvent.change(screen.getByPlaceholderText(/123/i), { target: { value: '1000' } })
    fireEvent.change(screen.getByPlaceholderText(/são paulo/i), { target: { value: 'São Paulo' } })
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'SP' } })
    const btn = screen.getByText(/continuar para pagamento/i)
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/forma de pagamento/i)).toBeInTheDocument()
  })
})
