# Revitalização De Sistemas Legados e Cultura DevOps

[![License](https://img.shields.io/npm/l/react)](https://github.com/xaacke/Primeiro-site/blob/main/LICENSE)
[![GitHub tag](https://img.shields.io/github/v/tag/xaacke/Primeiro-site?label=legado)](https://github.com/xaacke/Primeiro-site/releases/tag/v0.0-legado)
[![CI](https://github.com/xaacke/Primeiro-site/actions/workflows/ci.yml/badge.svg)](https://github.com/xaacke/Primeiro-site/actions/workflows/ci.yml)

Trabalho acadêmico da disciplina **MANUTENÇÃO DE SOFTWARE** — UNICESUMAR (2026).

O projeto aplica o ciclo completo de reengenharia de software sobre um sistema legado real, cobrindo seis checkpoints progressivos: desde a engenharia reversa até a entrega de um sistema modernizado com esteira de DevOps.

**Sistema analisado:** [IOT — A Internet das Coisas](https://xaacke.github.io/Primeiro-site/index.html)

---

## Equipe

| Integrante | RA | GitHub |
|---|---|---|
| Jackeline Paola Martins | 24195840-2 | [@xaacke](https://github.com/xaacke) |
| Tamires de Sousa Martins | 24489346-2 | [@tamisousa](https://github.com/tamisousa) |
| Fernanda Silva de Oliveira | 26002425-2 | [@Fernanda-Oliveira-hub](https://github.com/Fernanda-Oliveira-hub) |

---

## Progresso dos Checkpoints

| # | Checkpoint | Status |
|---|---|---|
| 01 | Setup e Governança | ✅ Concluído |
| 02 | Engenharia Reversa | ✅ Concluído |
| 03 | Plano de Reengenharia | ✅ Concluído |
| 04 | V&V e Testagem | ✅ Concluído |
| 05 | Esteira de DevOps | 🔄 Em andamento |
| 06 | Integração e Defesa | 🔜 Pendente |

---

## Checkpoint 01 — Setup e Governança

Configuração da estrutura de colaboração do projeto:

- Repositório criado e configurado no GitHub
- GitFlow definido com branches `main`, `develop` e `feature/*`
- Regras de contribuição documentadas (Pull Request obrigatório + 1 aprovação)
- Tag `v0.0-legado` criada para preservar o sistema original

### Estrutura de Branches (GitFlow)

| Branch | Finalidade |
|---|---|
| `main` | Código estável. Recebe apenas merges de `develop` ao final de cada checkpoint |
| `develop` | Branch de integração. Todo trabalho passa por aqui antes de ir ao `main` |
| `feature/*` | Branches individuais para cada funcionalidade ou entrega |

**Regras de contribuição:**
- Nenhuma branch envia código direto para `develop` ou `main`
- Todo trabalho passa por **Pull Request**
- É necessária **1 aprovação** antes do merge

---

## Checkpoint 02 — Engenharia Reversa

Análise e documentação do sistema legado para entender o que existia antes da modernização.

### Sistema Legado

Site estático sobre Internet das Coisas (IoT), desenvolvido em HTML5 e CSS3 puro, sem JavaScript, sem banco de dados e sem backend. Preservado pela tag `v0.0-legado`.

```bash
# Acessar o legado
git checkout v0.0-legado

# Voltar ao estado atual
git checkout develop
```

### Dívidas técnicas identificadas

- Links de navegação sem destino real (`href="#"`)
- `shop.html` vazio no repositório
- Bug de nomenclatura CSS (`.externo` vs `.external`)
- Responsividade parcial (apenas imagens)
- Ausência de acessibilidade completa
- Sem autenticação ou backend

### Diagramas UML do Legado

| Artefato | Localização |
|---|---|
| Diagrama de Classes — Legado | `docs/diagramas/classes-legado.puml` |
| Diagrama de Sequência — Legado | `docs/diagramas/sequencia-legado.puml` |

---

## Checkpoint 03 — Plano de Reengenharia

Definição dos 10 code smells identificados no legado e dos 9 requisitos do sistema modernizado.

### Code Smells Identificados

1. HTML sem semântica (uso de `<div>` onde cabem `<nav>`, `<header>`, `<main>`)
2. CSS com nomenclatura inconsistente (`.externo` vs `.external`)
3. Links mortos (`href="#"`) sem navegação real
4. Página `shop.html` vazia no repositório
5. Ausência de componentização (código duplicado entre páginas)
6. Sem responsividade real (apenas imagens redimensionadas)
7. Sem acessibilidade (ausência de `alt`, `aria-*`, contraste)
8. Sem separação de responsabilidades (estilo inline misturado com estrutura)
9. Sem backend ou persistência de dados
10. Sem autenticação ou controle de acesso

### Requisitos do Sistema Modernizado

| Requisito | Descrição | Status |
|---|---|---|
| R01 | Componentização com React | ✅ |
| R02 | Layout mobile-first responsivo | ✅ |
| R03 | Loja com catálogo, carrinho e checkout | ✅ |
| R04 | Navegação funcional entre páginas | ✅ |
| R05 | Backend e banco de dados (Supabase) | ✅ |
| R06 | Correção do bug de nomenclatura CSS | ✅ |
| R07 | Acessibilidade WCAG 2.1 nível AA | ✅ parcial |
| R08 | Login de cliente e administrador com JWT | ✅ |
| R09 | Blog de tecnologia com sistema de publicação | ✅ |

### Diagramas UML do Sistema Modernizado

| Artefato | Localização |
|---|---|
| Diagrama de Classes — Modernizado | `docs/diagramas/classes-modernizado.puml` |
| Diagrama de Sequência — Login | `docs/diagramas/sequencia-login.puml` |
| Diagrama de Sequência — Loja | `docs/diagramas/sequencia-shop.puml` |
| Plano de Reengenharia | `docs/plano-reengenharia.md` |

---

## Checkpoint 04 — V&V e Testagem

Implementação da pirâmide de testes com Vitest, cobrindo contextos, serviços e páginas da aplicação.

### Stack do Sistema Modernizado

| Camada | Tecnologia |
|---|---|
| Frontend | React + React Router DOM (Vite) |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (JWT + roles) |
| Estilo | CSS Modules + design tokens Figma |
| Testes | Vitest + Testing Library + jsdom |

### Como rodar o sistema

```bash
cd app
npm install
npm run dev
```

Acessa em: http://localhost:5173

### Executar os testes

```bash
cd app
npm run test -- --run
```

Resultado esperado: **56 testes passando, 0 falhas**, distribuídos em 10 arquivos.

### Gerar relatório de cobertura

```bash
cd app
npm run test:coverage
```

O relatório completo em HTML é gerado em `app/coverage/index.html`.

### Arquivos de teste

```
app/src/__tests__/
├── unitarios/
│   ├── cart.test.jsx         (10 casos — CartContext)
│   ├── toast.test.jsx        (3 casos  — ToastContext)
│   ├── checkout.test.js      (8 casos  — funções puras)
│   └── authService.test.js   (5 casos  — getRoleDoUsuario)
├── integracao/
│   ├── produtoService.test.js (6 casos — Supabase mockado)
│   └── authService.test.js   (4 casos  — login/cadastro/logout)
└── paginas/
    ├── LoginPage.test.jsx    (4 casos  — render e formulário)
    ├── CarrinhoPage.test.jsx (5 casos  — carrinho vazio e com itens)
    ├── CheckoutPage.test.jsx (6 casos  — fluxo de 3 etapas)
    └── HomePage.test.jsx     (6 casos  — hero e listagem)
```

### Cobertura atual

| Módulo | Statements | Branches | Funções | Linhas |
|---|---|---|---|---|
| CartContext.jsx | 97% | 90% | 100% | 95% |
| produtoService.js | 83% | 71% | 100% | 100% |
| authService.js | 73% | 75% | 80% | 83% |
| ToastContext.jsx | 81% | 82% | 67% | 92% |
| **Total geral** | **35,81%** | **44,39%** | **38,19%** | **36,30%** |

---

## Checkpoint 05 — Esteira de DevOps

Implementação do pipeline de CI/CD com GitHub Actions e containerização com Docker.

### CI — GitHub Actions

O arquivo `.github/workflows/ci.yml` configura um pipeline que roda automaticamente a cada Pull Request ou push para `develop` e `main`:

1. Checkout do código
2. Instalação do Node.js 20
3. Instalação das dependências (`npm ci`)
4. Execução dos 56 testes (`npm run test -- --run`)
5. Geração do relatório de cobertura (`npm run test:coverage`)

### IaC — Docker

O `app/Dockerfile` empacota a aplicação em duas etapas:

- **Etapa 1 (build):** Node.js 20 Alpine — instala dependências e gera a pasta `dist/`
- **Etapa 2 (serve):** Nginx Alpine — serve os arquivos estáticos na porta 80

### Como rodar com Docker

```bash
# Build da imagem
docker build -t primeiro-site ./app

# Rodar o container
docker run -p 8080:80 primeiro-site
```

Acessa em: http://localhost:8080

### Como rodar com docker-compose

```bash
docker-compose up
```

---

## Autora do sistema legado original

Jackeline P. Martins — [github.com/xaacke](https://github.com/xaacke)
