import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ToastProvider, useToast } from '../../contexts/ToastContext'

function BotaoTeste() {
  const { showToast } = useToast()
  return <button onClick={() => showToast('Produto adicionado!')}>Acionar Toast</button>
}

function BotaoErro() {
  const { showToast } = useToast()
  return <button onClick={() => showToast('Algo deu errado', 'erro')}>Acionar Erro</button>
}

describe('ToastContext — testes unitários', () => {
  it('exibe toast de sucesso ao clicar', async () => {
    render(<ToastProvider><BotaoTeste /></ToastProvider>)
    await act(async () => fireEvent.click(screen.getByText('Acionar Toast')))
    expect(screen.getByText('Produto adicionado!')).toBeInTheDocument()
  })

  it('exibe toast de erro ao clicar', async () => {
    render(<ToastProvider><BotaoErro /></ToastProvider>)
    await act(async () => fireEvent.click(screen.getByText('Acionar Erro')))
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
  })

  it('pode disparar múltiplos toasts', async () => {
    render(<ToastProvider><BotaoTeste /></ToastProvider>)
    await act(async () => fireEvent.click(screen.getByText('Acionar Toast')))
    await act(async () => fireEvent.click(screen.getByText('Acionar Toast')))
    expect(screen.getAllByText('Produto adicionado!')).toHaveLength(2)
  })
})
