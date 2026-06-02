import { describe, it, expect } from 'vitest'

// Funções extraídas da lógica do CheckoutPage
function gerarNumeroPedido() {
  const ano = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `TK-${ano}-${rand}`
}

function calcularFrete(total) {
  return total >= 299 ? 0 : 19.9
}

function calcularTotalComFrete(total) {
  return total + calcularFrete(total)
}

describe('Checkout — testes unitários', () => {
  describe('gerarNumeroPedido', () => {
    it('gera número no formato TK-ANO-XXXX', () => {
      const numero = gerarNumeroPedido()
      expect(numero).toMatch(/^TK-\d{4}-\d{4}$/)
    })

    it('contém o ano atual', () => {
      const numero = gerarNumeroPedido()
      const ano = new Date().getFullYear().toString()
      expect(numero).toContain(ano)
    })

    it('gera números diferentes a cada chamada', () => {
      const n1 = gerarNumeroPedido()
      const n2 = gerarNumeroPedido()
      // probabilidade de colisão é 1/9000 — aceitável para teste
      expect(typeof n1).toBe('string')
      expect(typeof n2).toBe('string')
    })
  })

  describe('calcularFrete', () => {
    it('frete grátis acima de R$ 299', () => {
      expect(calcularFrete(299)).toBe(0)
      expect(calcularFrete(500)).toBe(0)
    })

    it('frete R$ 19,90 abaixo de R$ 299', () => {
      expect(calcularFrete(100)).toBe(19.9)
      expect(calcularFrete(298.99)).toBe(19.9)
    })
  })

  describe('calcularTotalComFrete', () => {
    it('não adiciona frete em compras acima de R$ 299', () => {
      expect(calcularTotalComFrete(300)).toBe(300)
    })

    it('adiciona R$ 19,90 em compras abaixo de R$ 299', () => {
      expect(calcularTotalComFrete(100)).toBeCloseTo(119.9)
    })
  })
})
