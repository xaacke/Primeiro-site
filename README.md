# Revitalização De Sistemas Legados e Cultura DevOps

[![License](https://img.shields.io/npm/l/react)](https://github.com/xaacke/Primeiro-site/blob/main/LICENSE)
[![GitHub tag](https://img.shields.io/github/v/tag/xaacke/Primeiro-site?label=legado)](https://github.com/xaacke/Primeiro-site/releases/tag/v0.0-legado)

Trabalho acadêmico da disciplina **Estruturas, Pesquisa e Ordenação de Dados** — UNICESUMAR (2026).

O projeto aplica o ciclo completo de reengenharia de software sobre um sistema legado real, cobrindo seis checkpoints progressivos: desde a engenharia reversa até a entrega de um sistema modernizado com esteira de DevOps.

**Sistema analisado:** [IOT — A Internet das Coisas](https://xaacke.github.io/Primeiro-site/index.html)

---

## Equipe

| Integrante | RA |
|---|---|
| Jackeline Paola Martins | 24195840-2 |
| Tamires de Sousa Martins | 24489346-2 |
| Fernanda Silva de Oliveira | 26002425-2 |

---

## Progresso dos Checkpoints

| # | Checkpoint | Status |
|---|---|---|
| 01 | Setup e Governança | ✅ Concluído |
| 02 | Engenharia Reversa | ✅ Concluído |
| 03 | Plano de Reengenharia | ✅ Concluído |
| 04 | V&V e Testagem | ✅ Concluído |
| 05 | Esteira de DevOps | 🔜 Em breve |
| 06 | Integração e Defesa | 🔜 Em breve |

---

## Sistema Legado

Site estático sobre Internet das Coisas (IoT), desenvolvido em HTML5 e CSS3 puro, sem JavaScript, sem banco de dados e sem backend. Preservado pela tag `v0.0-legado`.

**Dívidas técnicas identificadas (Checkpoint 02):**
- Links de navegação sem destino real (`href="#"`)
- `shop.html` vazio no repositório
- Bug de nomenclatura CSS (`.externo` vs `.external`)
- Responsividade parcial (apenas imagens)
- Ausência de acessibilidade completa
- Sem autenticação ou backend

---

## Sistema Modernizado (em desenvolvimento)

| Camada | Tecnologia |
|---|---|
| Frontend | React + React Router DOM |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (JWT) |
| Estilo | CSS Modules + BEM |
| CI/CD | GitHub Actions *(Checkpoint 05)* |

**Novos requisitos (Checkpoint 03):**
- R01 — Componentização com React
- R02 — Layout mobile-first responsivo
- R03 — Loja com catálogo, carrinho e checkout
- R04 — Navegação funcional entre páginas
- R05 — Backend e banco de dados (Supabase)
- R06 — Correção do bug de nomenclatura CSS
- R07 — Acessibilidade WCAG 2.1 nível AA
- R08 — Login de cliente e administrador com JWT
- R09 — Blog de tecnologia com sistema de publicação

---

## Estrutura de Branches (GitFlow)

| Branch | Finalidade |
|---|---|
| `main` | Código estável. Contém o legado original e, ao final, o sistema modernizado |
| `develop` | Branch de integração. Todo trabalho passa por aqui antes de ir ao `main` |
| `feature/*` | Branches individuais para cada funcionalidade ou entrega |

**Regras de contribuição:**
- Nenhuma branch envia código direto para `develop`
- Todo trabalho passa por **Pull Request**
- É necessária **1 aprovação** antes do merge

---

## Como acessar o sistema legado original

O estado original do site está preservado pela tag `v0.0-legado`.

```bash
# Acessar o legado
git checkout v0.0-legado

# Voltar ao estado atual
git checkout develop
```

---

## Artefatos do projeto

| Artefato | Localização |
|---|---|
| Diagrama de Classes — Legado | `docs/diagramas/classes-legado.puml` |
| Diagrama de Sequência — Legado | `docs/diagramas/sequencia-legado.puml` |
| Diagrama de Classes — Modernizado | `docs/diagramas/classes-modernizado.puml` |
| Diagrama de Sequência — Login | `docs/diagramas/sequencia-login.puml` |
| Diagrama de Sequência — Loja | `docs/diagramas/sequencia-shop.puml` |
| Plano de Reengenharia | `docs/plano-reengenharia.md` |

---

## Testes (Checkpoint 04 — V&V)

A bateria de testes cobre contextos, serviços e páginas da aplicação, organizada em três camadas seguindo a Pirâmide de Testes.

**Ferramentas:** Vitest · @testing-library/react · @testing-library/jest-dom · jsdom · @vitest/coverage-v8

### Executar os testes

```bash
cd app
npm run test -- --run
```

Resultado esperado: **56 testes passando, 0 falhas**, distribuídos em 10 arquivos.

### Gerar relatório de cobertura

```bash
cd app
npm run test -- --run --coverage
```

Exibe a tabela de cobertura por arquivo no terminal. O relatório completo em HTML é gerado em `app/coverage/index.html` — abra no navegador para ver linha a linha o que foi testado.

### Cobertura atual

| Módulo | Statements | Branches | Funções | Linhas |
|---|---|---|---|---|
| CartContext.jsx | 97% | 90% | 100% | 95% |
| produtoService.js | 83% | 71% | 100% | 100% |
| authService.js | 73% | 75% | 80% | 83% |
| ToastContext.jsx | 81% | 82% | 67% | 92% |
| **Total geral** | **35,81%** | **44,39%** | **38,19%** | **36,30%** |

> A cobertura total é puxada para baixo pelas páginas administrativas (AdminDashboard, AdminProdutos) e pelo Blog, que dependem de integração real com o Supabase e não foram incluídas nos testes automatizados. Os módulos críticos de negócio (contextos e serviços) estão acima de 70%.

---

## Autora do sistema legado original

Jackeline P. Martins — [github.com/xaacke](https://github.com/xaacke)
