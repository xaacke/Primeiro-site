import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../../services/authService'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}))

import { supabase } from '../../lib/supabase'

describe('authService — testes de integração', () => {
  beforeEach(() => vi.clearAllMocks())

  it('login chama signInWithPassword com email e senha', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '123', email: 'test@test.com' } },
      error: null,
    })

    await authService.login('test@test.com', '123456')

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123456',
    })
  })


  ///////////////Corrigido teste de login para lançar erro corretamente

  it('login lança erro quando credenciais são inválidas', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: new Error('Invalid login credentials'),
    })

    await expect(authService.login('wrong@test.com', 'errada')).rejects.toThrow()
  })

  it('cadastrar chama signUp com email, senha e nome', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '456' } },
      error: null,
    })

    await authService.cadastrar('novo@test.com', '123456', 'João Silva')

    expect(supabase.auth.signUp).toHaveBeenCalledWith(expect.objectContaining({
      email: 'novo@test.com',
      password: '123456',
    }))
  })

  it('logout chama signOut', async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null })

    await authService.logout()

    expect(supabase.auth.signOut).toHaveBeenCalled()
  })
})
