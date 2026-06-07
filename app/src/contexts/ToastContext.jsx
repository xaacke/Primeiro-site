import { createContext, useContext, useState, useCallback } from 'react'
import styles from './Toast.module.css'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((mensagem, tipo = 'sucesso') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, mensagem, tipo }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <div className={styles.container}>
          {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

function ToastItem({ toast }) {
  const icone = toast.tipo === 'sucesso' ? '✓' : toast.tipo === 'erro' ? '✕' : 'ℹ'
  const cor = toast.tipo === 'sucesso' ? '#4ade80' : toast.tipo === 'erro' ? '#f87171' : '#51A2FF'

  return (
    <div className={styles.item} style={{ borderLeftColor: cor }}>
      <span className={styles.icone} style={{ color: cor }}>{icone}</span>
      <span className={styles.texto}>{toast.mensagem}</span>
    </div>
  )
}
