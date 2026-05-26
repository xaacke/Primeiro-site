import { supabase } from '../lib/supabase'

export const authService = {
  async login(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) throw error
    return data
  },

  async cadastrar(email, senha, nome) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome, role: 'cliente' } },
    })
    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async sessaoAtual() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  getRoleDoUsuario(session) {
    return session?.user?.user_metadata?.role ?? 'cliente'
  },
}
