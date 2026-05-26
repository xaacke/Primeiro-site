# Plano de Reengenharia — Sistema Modernizado

## Inventário de Code Smells (Sistema Legado)

| # | Code Smell | Localização | Impacto |
|---|---|---|---|
| 1 | **God File** | `index.html` | Mistura estrutura, conteúdo e apresentação em um único arquivo |
| 2 | **Dead Code** | `shop.html` | Arquivo vazio no repositório, nunca executado |
| 3 | **Fake Links** | `<nav>` — todos os `href="#"` | Navegação existe visualmente mas não funciona |
| 4 | **Inconsistent Naming** | `style.css` linha 36 vs `index.html` | CSS define `.externo`, HTML usa `.external` — bug real, efeito nunca aplicado |
| 5 | **Magic Numbers** | `style.css` — múltiplos pontos | Valores hardcoded sem variáveis completas |
| 6 | **Duplicate Code** | `<aside>` — 12 `<li>` idênticos | Qualquer mudança exige alterar os 12 itens manualmente |
| 7 | **No Separation of Concerns** | `index.html` geral | Conteúdo, estrutura e estilo acoplados |
| 8 | **Partial Responsiveness** | `<picture>` em `index.html` | Apenas imagens respondem — layout não é mobile-first |
| 9 | **Missing Accessibility** | `index.html` — imagens e headings | Dois `<h1>`, imagens sem `alt`, sem ARIA |
| 10 | **No Authentication** | Sistema inteiro | Sem controle de acesso, sessão ou identificação de usuário |

---

## Novos Requisitos

| ID | Requisito |
|---|---|
| R01 | Migração do frontend para React (componentização) |
| R02 | Layout responsivo e mobile-first em todas as telas |
| R03 | Página Shop: catálogo de produtos de tecnologia, carrinho e checkout |
| R04 | Navegação funcional entre páginas (eliminar `href="#"`) |
| R05 | Backend e banco de dados via Supabase (PostgreSQL) |
| R06 | Correção do bug de nomenclatura CSS (`.externo` vs `.external`) |
| R07 | Acessibilidade completa (WCAG 2.1 nível AA) |
| R08 | Login de cliente (cadastro + login) e login de administrador (gerenciar loja) |
| R09 | Blog de tecnologia (substitui o artigo fixo sobre IoT) |

---

## Stack Tecnológica Definida

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | React | Component Pattern — cada elemento vira componente reutilizável |
| Roteamento | React Router | SPA sem recarregamento de página |
| BaaS / Banco | Supabase (PostgreSQL) | Resolve R05 e R08 — banco + auth JWT embutidos |
| Autenticação | Supabase Auth | JWT nativo + controle por role (cliente/admin) |
| Estilo | CSS Modules + BEM | Elimina o bug de nomenclatura e isola estilos por componente |

---

## Padrões de Projeto Adotados

| Padrão | Resolve |
|---|---|
| **Component Pattern** (React) | R01, R07 — elimina God File e Duplicate Code |
| **SPA + React Router** | R03, R04 — rotas reais `/shop`, `/login`, `/admin` |
| **Repository Pattern** | R05, R08 — isola acesso ao banco nos Services |
| **Token-Based Auth (JWT)** | R08 — autenticação stateless com roles cliente/admin |
| **Mobile-First Design** | R02 — CSS de menor para maior tela |
| **BEM** | R06 — convenção de nomenclatura CSS consistente |

---

## Entidades do Banco de Dados

```
usuarios       (id, nome, email, senha_hash, role, created_at)
produtos       (id, nome, descricao, preco, estoque, categoria, imagem_url, created_at)
carrinho       (id, usuario_id, created_at)
itens_carrinho (id, carrinho_id, produto_id, quantidade)
pedidos        (id, usuario_id, total, status, created_at)
itens_pedido   (id, pedido_id, produto_id, quantidade, preco_unitario)
artigos        (id, titulo, conteudo, categoria, autor, imagem_url, created_at)
```

---

## Diagramas UML do Sistema Modernizado

| Diagrama | Arquivo |
|---|---|
| Classes — sistema modernizado | `docs/diagramas/classes-modernizado.puml` |
| Sequência — cadastro e login | `docs/diagramas/sequencia-login.puml` |
| Sequência — loja e checkout | `docs/diagramas/sequencia-shop.puml` |
