import { describe, it, expect } from 'vitest'
import { authService } from '../../services/authService'

describe('authService.getRoleDoUsuario — testes unitários', () => {
  it('retorna role do metadata quando existe', () => {
    const session = { user: { user_metadata: { role: 'admin' } } }
    expect(authService.getRoleDoUsuario(session)).toBe('admin')
  })

  it('retorna cliente quando role não está definida', () => {
    const session = { user: { user_metadata: {} } }
    expect(authService.getRoleDoUsuario(session)).toBe('cliente')
  })

  it('retorna cliente quando session é null', () => {
    expect(authService.getRoleDoUsuario(null)).toBe('cliente')
  })

  it('retorna cliente quando user_metadata é undefined', () => {
    const session = { user: {} }
    expect(authService.getRoleDoUsuario(session)).toBe('cliente')
  })

  it('distingue corretamente admin de cliente', () => {
    const admin = { user: { user_metadata: { role: 'admin' } } }
    const cliente = { user: { user_metadata: { role: 'cliente' } } }
    expect(authService.getRoleDoUsuario(admin)).not.toBe('cliente')
    expect(authService.getRoleDoUsuario(cliente)).not.toBe('admin')
  })
})
