import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [itens, setItens] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('carrinho')) ?? []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens))
  }, [itens])

  function adicionar(produto) {
    setItens(prev => {
      const existe = prev.find(i => i.id === produto.id)
      if (existe) {
        return prev.map(i =>
          i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
        )
      }
      return [...prev, { ...produto, quantidade: 1 }]
    })
  }

  function remover(id) {
    setItens(prev => prev.filter(i => i.id !== id))
  }

  function alterarQuantidade(id, quantidade) {
    if (quantidade < 1) return remover(id)
    setItens(prev => prev.map(i => i.id === id ? { ...i, quantidade } : i))
  }

  function limpar() {
    setItens([])
  }

  const total = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0)
  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0)

  return (
    <CartContext.Provider value={{ itens, adicionar, remover, alterarQuantidade, limpar, total, totalItens }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
