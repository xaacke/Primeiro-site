import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '../../contexts/CartContext'

const produto1 = { id: '1', nome: 'Teclado Mecânico', preco: 299.9, imagem_url: null }
const produto2 = { id: '2', nome: 'Mouse Gamer', preco: 149.9, imagem_url: null }

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>

describe('CartContext — testes unitários', () => {
  beforeEach(() => localStorage.clear())

  it('começa com carrinho vazio', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.itens).toHaveLength(0)
    expect(result.current.total).toBe(0)
    expect(result.current.totalItens).toBe(0)
  })

  it('adiciona um produto ao carrinho', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.adicionar(produto1))
    expect(result.current.itens).toHaveLength(1)
    expect(result.current.itens[0].nome).toBe('Teclado Mecânico')
    expect(result.current.itens[0].quantidade).toBe(1)
  })

  it('incrementa quantidade ao adicionar o mesmo produto', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.adicionar(produto1))
    act(() => result.current.adicionar(produto1))
    expect(result.current.itens).toHaveLength(1)
    expect(result.current.itens[0].quantidade).toBe(2)
  })

  it('adiciona produtos diferentes como itens separados', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.adicionar(produto1))
    act(() => result.current.adicionar(produto2))
    expect(result.current.itens).toHaveLength(2)
  })

  it('remove um produto do carrinho', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.adicionar(produto1))
    act(() => result.current.remover(produto1.id))
    expect(result.current.itens).toHaveLength(0)
  })

  it('altera a quantidade de um produto', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.adicionar(produto1))
    act(() => result.current.alterarQuantidade(produto1.id, 5))
    expect(result.current.itens[0].quantidade).toBe(5)
  })

  it('remove o produto quando quantidade vai para 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.adicionar(produto1))
    act(() => result.current.alterarQuantidade(produto1.id, 0))
    expect(result.current.itens).toHaveLength(0)
  })

  it('calcula o total corretamente', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.adicionar(produto1))
    act(() => result.current.adicionar(produto2))
    act(() => result.current.alterarQuantidade(produto1.id, 2))
    // 299.90 * 2 + 149.90 * 1 = 749.70
    expect(result.current.total).toBeCloseTo(749.7)
  })

  it('conta o total de itens corretamente', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.adicionar(produto1))
    act(() => result.current.adicionar(produto1))
    act(() => result.current.adicionar(produto2))
    expect(result.current.totalItens).toBe(3)
  })

  it('limpa o carrinho', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.adicionar(produto1))
    act(() => result.current.adicionar(produto2))
    act(() => result.current.limpar())
    expect(result.current.itens).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })
})
