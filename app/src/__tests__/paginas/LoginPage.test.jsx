import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../../pages/LoginPage'

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ session: null, role: 'cliente', carregando: false }),
}))

vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn().mockResolvedValue({}),
    cadastrar: vi.fn().mockResolvedValue({}),
    getRoleDoUsuario: vi.fn().mockReturnValue('cliente'),
  },
}))

const renderLogin = () => render(
  <MemoryRouter><LoginPage /></MemoryRouter>
)

describe('LoginPage — testes de renderização', () => {
  it('renderiza o formulário de login', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument()
  })

  it('exibe botão de entrar no modo login', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('permite alternar para modo de cadastro', () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))
    expect(screen.getByPlaceholderText('Seu nome completo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument()
  })

  it('campos de email e senha aceitam entrada do usuário', () => {
    renderLogin()
    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const senhaInput = screen.getByPlaceholderText('Digite sua senha')
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
    fireEvent.change(senhaInput, { target: { value: '123456' } })
    expect(emailInput.value).toBe('test@test.com')
    expect(senhaInput.value).toBe('123456')
  })
})
