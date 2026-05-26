import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    authService.sessaoAtual().then(s => {
      setSession(s)
      setCarregando(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

  const role = authService.getRoleDoUsuario(session)

  return (
    <AuthContext.Provider value={{ session, role, carregando }}>
      {!carregando && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
