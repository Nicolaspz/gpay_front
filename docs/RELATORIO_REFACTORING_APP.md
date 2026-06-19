# Relatório de Refatoração — `src/app/`

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Análise por Arquivo](#2-análise-por-arquivo)
3. [Problemas Identificados](#3-problemas-identificados)
4. [Propostas de Refatoração](#4-propostas-de-refatoração)
5. [Distribuição de Responsabilidades](#5-distribuição-de-responsabilidades)
6. [Plano de Ação](#6-plano-de-ação)

---

## 1. Visão Geral

Este relatório analisa todos os ficheiros dentro de `src/app/` (páginas, layouts, CSS) e propõe refatorações baseadas em princípios de **código limpo**, **separação de responsabilidades** e **manutenibilidade**.

**Total de ficheiros analisados:** 22  
**Problemas críticos encontrados:** 7  
**Problemas moderados encontrados:** 12  
**Problemas leves encontrados:** 8

---

## 2. Análise por Arquivo

### 2.1 `src/app/layout.tsx` (149 linhas)

| Aspeto | Estado |
|--------|--------|
| Server Component | ✅ Correto |
| SEO/Metadata | ✅ Completo e bem estruturado |
| Providers | ✅ Bem organizado |

**Problemas:**
- **Importação desorganizada**: `import ReactQueryProvider` surge no meio do ficheiro (linha 103), após a definição do metadata, em vez de estar no topo com os restantes imports.
- **Google Tag Manager hardcoded**: O script GTM (`GTM-TZLRXBBK`) está diretamente no layout, dificultando a troca por ambiente.
- **`body` com duas regras `font-family`**: No JSX usa `font-sans` via Tailwind, mas no CSS global há `body { font-family: 'Inter', sans-serif; }` que sobrescreve.

### 2.2 `src/app/globals.css` (284 linhas)

| Aspeto | Estado |
|--------|--------|
| Tema claro/escuro | ✅ Completo |
| Animações | ✅ Incluídas |

**Problemas:**
- **Duplicado**: Existe uma cópia quase idêntica em `(public)/globalss.css` com algumas diferenças mínimas (ex: `globalss.css` tem `radius-2xl` a `radius-4xl` extras). Isto é **duplicação de código**.
- **CSS duplicado**: `@keyframes fadeIn` aparece duas vezes — uma no `@layer base` (como animação `auth-page`) e outra no `@layer utilities`.
- **`body` tem `font-family` definida duas vezes**: uma via Tailwind `font-sans` e outra via CSS clássico `'Inter', sans-serif`.
- **Estilos de template legados**: Regras como `h1, h2, h3 { color: #2a2a2a }` e `p { color: #afafaf }` misturam-se com o sistema de design moderno Tailwind/shadcn.

### 2.3 `src/app/not-found.tsx` (21 linhas)

| Aspeto | Estado |
|--------|--------|
| Client Component | ✅ Correcto (usa onClick) |

**Problemas:**
- **Uso de `window.location.href`**: Em vez de usar `useRouter` do Next.js, que é a forma idiomática e evita recarregamento total da página.

### 2.4 `src/app/(public)/page.tsx` (19 linhas)

| Aspeto | Estado |
|--------|--------|
| Server Component | ✅ Correta |

**Problemas:**
- **Nome do componente "Princing"**: O ficheiro `Princing.tsx` está mal escrito (deve ser `Pricing.tsx`). Isto é um erro de naming consistente.

### 2.5 `src/app/(public)/globalss.css` (125 linhas)

**Problemas:**
- **Duplicação total**: 95% do conteúdo é igual ao `globals.css` da raiz. Apenas difere em ter `radius-2xl/3xl/4xl` a mais e faltar as animações e estilos de template.
- **Não devia existir**: O Next.js App Router carrega apenas `globals.css` da raiz. Este ficheiro adicional é desnecessário.

### 2.6 `src/app/(public)/login/page.tsx` (5 linhas)

**Avaliação: ✅ Excelente.** Componente fino, delega totalmente para `LoginForm`. Exemplo a seguir.

### 2.7 `src/app/(public)/register/page.tsx` (256 linhas)

| Aspeto | Estado |
|--------|--------|
| Client Component | ✅ |
| Validação de senha | ⚠️ Inline e duplicada |
| Chamada API | ⚠️ Inline |

**Problemas:**
- **Validação de password duplicada**: A lógica `validatePassword()` com regex está copiada para `reset-password/page.tsx` (Dryve violation).
- **Lógica de API inline**: A chamada `api.post("/users", ...)` está diretamente no componente. Devia estar no serviço `auth.service.ts`.
- **Estado misturado**: Estado de formulário, validação, loading e UI tudo no mesmo componente.
- **`error: any`**: Uso de `any` no catch. Devia usar `unknown` com type guard.

### 2.8 `src/app/(public)/activate/page.tsx` (120 linhas)

| Aspeto | Estado |
|--------|--------|
| Suspense boundary | ✅ Correcto |
| Tratamento de erros | ✅ Bom |

**Problemas:**
- **Chamada API inline**: `api.get("/activation", ...)` diretamente na página.
- **Estado `loading | success | error` repetido**: Este padrão de três estados aparece em activate, reset-password e document. Devia ser um tipo partilhado.

### 2.9 `src/app/(public)/reset-password/page.tsx` (318 linhas)

**Problemas:**
- **Duplicação massiva**: Cópia de ~80% da lógica de validação de password do register.
- **Ficheiro muito grande**: 318 linhas para uma página de reset. Devia ser ~80-100 linhas após refatoração.
- **Chamada API inline**: `api.post("/auth/reset-password?...")` diretamente aqui.
- **Token passado como query string na URL**: Em vez de usar `params` do axios como é feito no activate.

### 2.10 `src/app/(public)/terms/page.tsx` (60 linhas)

**Avaliação: ✅ Bom.** Server component simples e limpo. Sem problemas significativos.

### 2.11 `src/app/(public)/refund/page.tsx` (53 linhas)

**Avaliação: ✅ Bom.** Server component simples e limpo.

### 2.12 `src/app/(public)/price/page.tsx` (73 linhas)

**Problemas:**
- **Dados hardcoded**: Os planos (nome, preço, features) estão hardcoded no componente. Deviam vir de uma API ou de um ficheiro de dados separado.
- **Uso de emoji `✅`**: Inconsistente com o resto do projeto que usa lucide-react. Devia usar `CheckCircle` ou similar.
- **Client Component desnecessário**: Não tem interatividade real que justifique ser `"use client"`.

### 2.13 `src/app/(public)/document/page.tsx` (694 linhas)

| Problema | Impacto |
|----------|---------|
| **Monolítico** | Extremo |
| **Funções inline (6 seções)** | Todas as secções (`Introducao`, `Autenticacao`, `Endpoints`, `PayloadStructure`, `APIResponses`, `Exemplos`) são funções definidas dentro do mesmo ficheiro. Cada uma devia ser um componente separado em `src/components/documentation/`. |
| **Lógica de navegação misturada com conteúdo** | A página gerencia sidebar, transições, estados mobile e conteúdo tudo junto. |
| **Tabs de código duplicadas (cURL, JavaScript)** | O padrão de tabs para exemplos de código é repetido em `Endpoints` e `Exemplos`. Podia ser um componente reutilizável `CodeExample`. |
| **694 linhas** | Extremamente difícil de manter e testar. |

### 2.14 `src/app/(private)/layout.tsx` (48 linhas)

**Avaliação: ✅ Bom.** Layout limpo com boa separação entre sidebar desktop/mobile.

### 2.15 `src/app/(private)/dashboard/page.tsx` (116 linhas)

**Avaliação: ✅ Bom.** Uso exemplar de hooks customizados e componentes extraídos.

**Problemas leves:**
- `transactions.length === 0` a mensagem "Nenhum evento encontrado" aparece apenas quando não está loading, mas o layout mantém-se. Podia ser um componente `EmptyState`.

### 2.16 `src/app/(private)/dashboard/transactions/page.tsx` (454 linhas)

| Problema | Impacto |
|----------|---------|
| **Componente `Button` inline** | Definição de um componente `Button` local (linhas 2494-2527) que duplica o já existente `@/components/ui/button`. |
| **3 modais inline** | Modal de detalhes, modal de nova referência, e resultado de referência estão todos no mesmo ficheiro. |
| **Lógica de ordenação/filtros/paginação inline** | Lógica de negócio (sort, filter, paginate) misturada com JSX. Devia estar em hooks separados. |
| **Mutação inline** | `generateReferenceMutation` com `onSuccess` e `onError` diretamente na página. |
| **Estado de referência complexo** | Múltiplos `useState` para controlar o fluxo (showNewReferenceModal, referenceResult, newReferenceData, etc). |

### 2.17 `src/app/(private)/dashboard/stripe/page.tsx` (~320 linhas)

**Problemas:**
- **URL e token Stripe hardcoded**: `stripeBaseUrl` e `stripeToken` estão no código fonte.
- **Consultas React Query inline**: As queries `useQuery` com `queryFn` completo estão na página.
- **Lógica de filtros/paginação inline**: Mesmo problema das transactions.
- **`as any`**: Uso de `as any` em vez de tipos definidos para as transações Stripe.

### 2.18 `src/app/(private)/dashboard/api_key/page.tsx` + `loading.tsx`

**Avaliação: ✅ Bom** (com base na análise inicial, os ficheiros de API key delegam bem para componentes).

### 2.19 `src/app/(private)/dashboard/webhooks/page.tsx` + `loading.tsx`

**Avaliação: ✅ Bom** (delega para componentes de webhook).

### 2.20 `src/app/(private)/dashboard/comercial/page.tsx`

**Avaliação: ✅ Bom** (usa `ComercialTabs`, `PaymentMethods`, etc).

### 2.21 `src/app/(private)/dashboard/settings/page.tsx`

**Avaliação: ✅ Bom** (usa `SettingsTabs` e seções extraídas).

---

## 3. Problemas Identificados

### 3.1 Duplicação de Código

| O quê | Onde | Gravidade |
|-------|------|-----------|
| `globals.css` duplicado em `globalss.css` | `(public)/globalss.css` | Alta |
| `validatePassword()` com regex | `register/page.tsx` + `reset-password/page.tsx` | Alta |
| Padrão `status: "loading" \| "success" \| "error"` | activate, reset-password, document | Média |
| Componente `Button` inline | `transactions/page.tsx` (duplica `@/components/ui/button`) | Alta |
| Lógica de filtros/paginação | transactions + stripe | Média |

### 3.2 Ficheiros Monolíticos

| Ficheiro | Linhas | Responsabilidades |
|----------|--------|-------------------|
| `document/page.tsx` | 694 | Navegação + 6 secções + sidebar mobile + transições |
| `transactions/page.tsx` | 454 | Tabela + filtros + modais + paginação + referência |
| `reset-password/page.tsx` | 318 | Form + validação + API + estados |
| `stripe/page.tsx` | ~320 | Queries + tabela + filtros + estatísticas |
| `register/page.tsx` | 256 | Form + validação + API + UI |

### 3.3 Chamadas API Inline

Várias páginas fazem chamadas `api.get()` / `api.post()` diretamente em vez de usar os serviços existentes em `src/services/`:

- `register/page.tsx` → devia usar `AuthService.signUp()`
- `activate/page.tsx` → devia usar `AuthService.activate()`
- `reset-password/page.tsx` → devia usar `AuthService.resetPassword()`
- `stripe/page.tsx` → devia usar `StripeService`

### 3.4 Problemas de Responsividade/Composição

- `document/page.tsx` renderiza sidebar e conteúdo manualmente em vez de usar um layout de documentação.
- `price/page.tsx` podia ser server component com dados vindos de CMS/API.
- `not-found.tsx` usa `window.location.href` em vez de `useRouter`.

---

## 4. Propostas de Refatoração

### 4.1 Duplicação de CSS

**Problema:** `(public)/globalss.css` é cópia de `globals.css`.

**Solução:**
- Eliminar `globalss.css` (não é necessário — o Next.js carrega `globals.css` da raiz para todas as rotas).
- Unificar as variáveis `radius-2xl/3xl/4xl` que só existem no ficheiro duplicado, adicionando-as ao `globals.css` principal se forem necessárias.

### 4.2 `layout.tsx` — Melhorias

```typescript
// Mover ReactQueryProvider import para o topo com os restantes imports
// Extrair GTM para um componente separado
// src/components/analytics/GoogleTagManager.tsx
```

### 4.3 `register/page.tsx` e `reset-password/page.tsx` — Extrair Validação

Criar um hook partilhado:

```typescript
// src/hooks/usePasswordValidation.ts
export function usePasswordValidation(password: string) {
  const errors = useMemo(() => {
    const errs: string[] = [];
    if (!/[A-Z]/.test(password)) errs.push("A senha deve conter pelo menos uma letra maiúscula");
    if (!/[a-z]/.test(password)) errs.push("A senha deve conter pelo menos uma letra minúscula");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errs.push("A senha deve conter pelo menos um caractere especial");
    if (!/.{8,}/.test(password)) errs.push("A senha deve ter pelo menos 8 caracteres");
    return errs;
  }, [password]);

  return { errors, isValid: errors.length === 0 && password.length > 0 };
}
```

E extrair o `PasswordInput` com toggle de visibilidade para um componente partilhado:

```typescript
// src/components/shared/PasswordInput.tsx
```

### 4.4 `activate/page.tsx` e `reset-password/page.tsx` — Extrair Status Pattern

Criar um tipo e componente partilhado:

```typescript
// src/types/status.ts
export type RequestStatus = "idle" | "loading" | "success" | "error";

// src/components/shared/StatusDisplay.tsx
```

E usar os serviços existentes em vez de `api.get/post` diretamente.

### 4.5 `document/page.tsx` — Refatoração Completa

**Problema:** 694 linhas monolíticas.

**Solução:** Dividir em múltiplos componentes:

```
src/components/documentation/
├── DocLayout.tsx          # Layout com sidebar + main content
├── DocSidebar.tsx         # Navegação lateral (desktop + mobile)
├── DocContent.tsx         # Renderizador de secção ativa
├── sections/
│   ├── Introducao.tsx
│   ├── Autenticacao.tsx
│   ├── Endpoints.tsx
│   ├── PayloadStructure.tsx
│   ├── APIResponses.tsx
│   └── Exemplos.tsx
└── CodeExample.tsx        # Componente reutilizável de tabs de código
```

### 4.6 `transactions/page.tsx` — Extrair Componentes e Hooks

**Problema:** 454 linhas, 3 modais inline, Button inline.

**Solução:**

```
src/components/transactions/
├── TransactionsTable.tsx      # Tabela com sort
├── TransactionsFilters.tsx    # Filtros de data + grupo
├── TransactionDetailsModal.tsx # Modal de detalhes
├── NewReferenceModal.tsx       # Modal de nova referência
└── Pagination.tsx             # Controlo de paginação

src/hooks/useTransactionFilters.ts   # Lógica de filtros/ordenação/paginação
src/hooks/useGenerateReference.ts    # Mutação de gerar referência
```

E remover o componente `Button` inline, usando `@/components/ui/button`.

### 4.7 `stripe/page.tsx` — Extrair para Serviço e Componentes

**Problema:** URL/token hardcoded, queries inline.

**Solução:**
- Criar `src/services/stripe.service.ts` com as queries centralizadas.
- Extrair tabela para `src/components/stripe/StripeTable.tsx`.
- Extrair filtros para componente partilhado `DateRangeFilters.tsx`.
- Tipar as transações Stripe em `src/types/stripe.ts` em vez de `as any`.

### 4.8 `price/page.tsx` — Separar Dados

Extrair dados dos planos para `src/data/plans.ts` e tornar o componente server component.

---

## 5. Distribuição de Responsabilidades

### Arquitetura Alvo (Clean Architecture para páginas)

```
┌──────────────────────────────────────────────────────┐
│                      PÁGINA                           │
│  (orquestra layout, chama hooks, renderiza JSX)      │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────────┐    ┌──────────────────────┐    │
│  │   COMPONENTES     │    │     HOOKS/HOCS        │    │
│  │  (UI + lógica     │    │  (estado, queries,    │    │
│  │   de render)      │    │   mutations)          │    │
│  └──────────────────┘    └──────────────────────┘    │
│           │                       │                   │
│           ▼                       ▼                   │
│  ┌──────────────────────────────────────────────┐    │
│  │              SERVIÇOS (API calls)             │    │
│  │    auth.service  │  transactions.service     │    │
│  └──────────────────────────────────────────────┘    │
│           │                                           │
│           ▼                                           │
│  ┌──────────────────────────────────────────────┐    │
│  │              STORES (Zustand)                 │    │
│  │    useAuthStore  │  useApiKeyStore            │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### Tabela de Responsabilidades por Camada

| Camada | Responsabilidade | O que NÃO deve fazer |
|--------|------------------|---------------------|
| **Página** | Compor layout, passar props, chamar hooks | Não deve conter chamadas API, lógica de negócio, validações complexas |
| **Componente** | Renderizar UI, receber props/callbacks | Não deve chamar API, não deve gerir estado global |
| **Hook** | Estado local, queries, mutations | Não deve renderizar JSX |
| **Serviço** | Chamadas HTTP, transformação de dados | Não deve importar React, não deve gerir estado |
| **Store** | Estado global partilhado (auth, cache) | Não deve fazer chamadas HTTP diretamente |

### Refatoração da `transactions/page.tsx`

**Antes (454 linhas):**
```
Página (monolítica)
├── Componente Button inline
├── 15x useState
├── Lógica de sort/filter/paginação
├── Mutation inline
├── 3 modais com JSX inline
├── Tabela com JSX inline
└── HTML misturado com lógica
```

**Depois (~60 linhas):**
```
Página
├── useTransactions() ← hook existente
├── useTransactionFilters() ← novo hook
├── useGenerateReference() ← novo hook
├── <TransactionsFilters />
├── <TransactionsTable />
├── <Pagination />
├── <TransactionDetailsModal />
└── <NewReferenceModal />
```

### Refatoração da `document/page.tsx`

**Antes (694 linhas):**
```
Página
├── 6 funções inline (cada uma com ~100+ linhas)
├── Navegação + sidebar inline
├── Lógica de transição inline
├── Tabs de código duplicadas
└── Sidebar mobile inline
```

**Depois (~40 linhas):**
```
Página
├── <DocSidebar />
├── <DocContent />  ← renderiza secção ativa
└── Secções em ficheiros separados
```

---

## 6. Plano de Ação

### Prioridade Alta (duplicação/semântica crítica)

| # | Tarefa | Ficheiros | Esforço |
|---|--------|-----------|---------|
| 1 | Eliminar `globalss.css` duplicado e unificar CSS | `(public)/globalss.css`, `globals.css` | 30 min |
| 2 | Extrair `validatePassword()` para hook partilhado | `register`, `reset-password` | 1 h |
| 3 | Extrair `PasswordInput` (com toggle visibilidade) para componente | `register`, `reset-password` | 1 h |
| 4 | Remover componente `Button` inline das transactions | `transactions/page.tsx` | 15 min |

### Prioridade Média (ficheiros grandes / mistura de responsabilidades)

| # | Tarefa | Ficheiros | Esforço |
|---|--------|-----------|---------|
| 5 | Dividir `document/page.tsx` em componentes separados | `document/` | 4 h |
| 6 | Extrair modais das transactions para componentes | `transactions/` | 2 h |
| 7 | Extrair filtros/paginação para hooks | `transactions`, `stripe` | 2 h |
| 8 | Mover chamadas API inline para serviços | `register`, `activate`, `reset-password` | 2 h |

### Prioridade Baixa (melhorias)

| # | Tarefa | Ficheiros | Esforço |
|---|--------|-----------|---------|
| 9 | Mover GTM para componente `GoogleTagManager` | `layout.tsx` | 30 min |
| 10 | Separar dados dos planos da price page | `price/page.tsx` | 30 min |
| 11 | Corrigir `window.location.href` → `useRouter` | `not-found.tsx` | 5 min |
| 12 | Criar tipo `RequestStatus` partilhado | activate, reset-password | 15 min |
| 13 | Tipar transações Stripe (remover `as any`) | `stripe/page.tsx` | 1 h |
| 14 | Criar serviço Stripe dedicado | `stripe/` | 2 h |
| 15 | Exportar tipo `RequestStatus` (idle, loading, success, error) para `types/` | Vários | 15 min |

### Estimativa Total

| Prioridade | Esforço |
|------------|---------|
| Alta | ~2.75 h |
| Média | ~10 h |
| Baixa | ~4.5 h |
| **Total** | **~17 h** |

---

## Resumo Final

O `src/app/` tem **22 ficheiros** dos quais **7 são problemáticos** (document, register, reset-password, transactions, stripe, globals.css, globalss.css).

**Principais intervenções necessárias:**

1. **Eliminar duplicação** — CSS duplicado, validação de password duplicada, Button duplicado
2. **Fragmentar monolíticos** — document (694 → ~40 linhas) e transactions (454 → ~60 linhas)
3. **Mover chamadas API para serviços** — register, activate, reset-password, stripe
4. **Tipar corretamente** — Remover `as any` em stripe e `error: any` nos catches
5. **Centralizar padrões repetidos** — `RequestStatus`, `PasswordInput`, `DateRangePicker`

Após refatoração, a `src/app/` passará de **~3.200 linhas totais** para aproximadamente **~1.800 linhas**, com responsabilidades bem distribuídas e componentes reutilizáveis.
