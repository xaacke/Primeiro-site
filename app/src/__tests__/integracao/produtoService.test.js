import { describe, it, expect, vi, beforeEach } from 'vitest'
import { produtoService } from '../../services/produtoService'

// Mock do cliente Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
    })),
    rpc: vi.fn(),
  },
}))

import { supabase } from '../../lib/supabase'

const produtosMock = [
  { id: '1', nome: 'Teclado Mecânico', preco: 299.9, estoque: 10, categoria: 'Periféricos' },
  { id: '2', nome: 'Mouse Gamer', preco: 149.9, estoque: 5, categoria: 'Periféricos' },
]

describe('produtoService — testes de integração', () => {
  beforeEach(() => vi.clearAllMocks())

  it('listarTodos retorna lista de produtos', async () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: produtosMock, error: null }),
    })

    const result = await produtoService.listarTodos()
    expect(result).toHaveLength(2)
    expect(result[0].nome).toBe('Teclado Mecânico')
  })

  it('listarTodos lança erro quando Supabase falha', async () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: new Error('Erro de conexão') }),
    })

    await expect(produtoService.listarTodos()).rejects.toThrow('Erro de conexão')
  })

  it('listarComEstoque filtra produtos com estoque > 0', async () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: produtosMock, error: null }),
    })

    const result = await produtoService.listarComEstoque()
    expect(result).toHaveLength(2)
  })

  it('criar chama RPC criar_produto com os dados corretos', async () => {
    supabase.rpc.mockResolvedValue({ error: null })

    await produtoService.criar({
      nome: 'Webcam HD', descricao: 'Webcam 1080p', preco: 199.9,
      estoque: 20, estoque_minimo: 5, categoria: 'Periféricos', imagem_url: null,
    })

    expect(supabase.rpc).toHaveBeenCalledWith('criar_produto', expect.objectContaining({
      p_nome: 'Webcam HD',
      p_preco: 199.9,
    }))
  })

  it('deletar chama RPC deletar_produto com o id correto', async () => {
    supabase.rpc.mockResolvedValue({ error: null })

    await produtoService.deletar('abc-123')

    expect(supabase.rpc).toHaveBeenCalledWith('deletar_produto', { p_id: 'abc-123' })
  })

  it('atualizar lança erro quando RPC falha', async () => {
    supabase.rpc.mockResolvedValue({ error: new Error('RPC falhou') })

    await expect(produtoService.atualizar('abc-123', {
      nome: 'Teste', descricao: '', preco: 10,
      estoque: 1, estoque_minimo: 1, categoria: 'X',
    })).rejects.toThrow('RPC falhou')
  })
})
