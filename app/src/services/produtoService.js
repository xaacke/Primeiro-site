import { supabase } from '../lib/supabase'

export const produtoService = {
  async listarTodos() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome')
    if (error) throw error
    return data
  },

  async listarComEstoque() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .gt('estoque', 0)
      .order('nome')
    if (error) throw error
    return data
  },

  async criar(produto) {
    const { error } = await supabase.rpc('criar_produto', {
      p_nome: produto.nome,
      p_descricao: produto.descricao,
      p_preco: produto.preco,
      p_estoque: produto.estoque,
      p_estoque_minimo: produto.estoque_minimo,
      p_categoria: produto.categoria,
      p_imagem_url: produto.imagem_url || null,
    })
    if (error) throw error
  },

  async atualizar(id, produto) {
    const { error } = await supabase.rpc('atualizar_produto', {
      p_id: id,
      p_nome: produto.nome,
      p_descricao: produto.descricao,
      p_preco: produto.preco,
      p_estoque: produto.estoque,
      p_estoque_minimo: produto.estoque_minimo,
      p_categoria: produto.categoria,
      p_imagem_url: produto.imagem_url || null,
    })
    if (error) throw error
  },

  async deletar(id) {
    const { error } = await supabase.rpc('deletar_produto', { p_id: id })
    if (error) throw error
  },
}
