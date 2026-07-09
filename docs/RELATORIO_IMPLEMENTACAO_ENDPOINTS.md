# Relatório de Implementação — Consumo de Endpoints Stripe Server

**Data:** 06/07/2026  
**Projeto:** GPay Frontend  

---

## Sumário

Implementação do consumo de todos os endpoints da API Stripe Server (`https://stripe-server-ztck.onrender.com/api/v1`) documentados em `docServerStripe.txt`. Dos 15 endpoints totais, apenas 4 já estavam sendo consumidos. Os restantes 11 foram implementados neste ciclo.

---

## Endpoints Anteriormente Consumidos (4)

| # | Endpoint | Onde |
|---|----------|------|
| 1 | `GET /transactions/user/{userId}` | `stripe.service.ts` → `useStripeData` → `/dashboard/stripe` |
| 2 | `GET /transactions/user/{userId}/summaries` | `stripe.service.ts` → `useStripeData` → `/dashboard/stripe` |
| 3 | `GET /transactions/admin/all` | `stripe.service.ts` → `useStripeData` → `/dashboard/stripe` |
| 4 | `GET /client-balances/user/{userId}` | `stripe.service.ts` → `useStripeData` → `/dashboard/account` |

---

## Novos Endpoints Implementados (11)

### Prioridade Alta — PayPay Fund (4 endpoints + 1 withdrawal)

| Endpoint | Método | Ficheiro | UI |
|----------|--------|----------|----|
| `GET /paypay-fund/admin/balance` | `getPayPayBalance()` | `stripe.service.ts:32` | `/dashboard/paypay` — CardStat "Saldo Disponível" |
| `GET /paypay-fund/admin/movements` | `getPayPayMovements()` | `stripe.service.ts:37` | `/dashboard/paypay` — Tabela de movimentos |
| `POST /paypay-fund/admin/topups` | `createPayPayTopup()` | `stripe.service.ts:43` | `/dashboard/paypay` — Dialog "Creditar Fundo" |
| `POST /paypay-fund/admin/validate-debit` | `validatePayPayDebit()` | `stripe.service.ts:50` | `/dashboard/paypay` — Dialog "Validar Débito" |
| `POST /client-balances/user/{userId}/validate-withdrawal` | `validateWithdrawal()` | `stripe.service.ts:70` | `/dashboard/account` — Dialog "Fazer Saque" |

#### Ficheiros criados:
- `src/types/stripe.ts` — tipos `PayPayBalance`, `PayPayMovement`, `PayPayTopupPayload`, `PayPayValidateDebitPayload`, `WithdrawalValidationResponse`
- `src/services/stripe.service.ts` — métodos do PayPay Fund e withdrawal validation
- `src/hooks/usePayPayFund.ts` — hook React Query (balance query, movements query, topup mutation, validate debit mutation)
- `src/hooks/useWithdrawalValidation.ts` — hook mutation para validação de saque
- `src/app/(private)/dashboard/paypay/page.tsx` — página completa de gestão do fundo PayPay
- `src/app/(private)/dashboard/account/page.tsx` — integração do dialog de validação de saque

### Prioridade Média — Client Balances Admin + Transaction Summaries (4 endpoints)

| Endpoint | Método | Ficheiro | UI |
|----------|--------|----------|----|
| `GET /client-balances/admin/all` | `getAllClientBalances()` | `stripe.service.ts:57` | `/dashboard/balances` — Tabela de saldos |
| `POST /client-balances/admin/rebuild-from-transactions` | `rebuildBalances()` | `stripe.service.ts:78` | `/dashboard/balances` — Botão "Reconstruir Saldos" |
| `GET /transactions/admin/clients` | `getAdminClientsSummary()` | `stripe.service.ts:90` | `/dashboard/stripe` — Secção "Resumo de Clientes" (admin) |
| `GET /transactions/user/{userId}/summary` | `getTransactionSummary()` | `stripe.service.ts:84` | `/dashboard/stripe` — Secção "Resumo da Minha Conta" (user) |

#### Ficheiros criados:
- `src/types/stripe.ts` — tipos `AdminClientSummary`, `TransactionSummaryResponse`, `RebuildBalancesResponse`
- `src/services/stripe.service.ts` — métodos de admin balances e transaction summaries
- `src/hooks/useClientBalances.ts` — hook React Query (all balances query + rebuild mutation)
- `src/hooks/useTransactionSummary.ts` — hook React Query (admin clients query + user summary query)
- `src/app/(private)/dashboard/balances/page.tsx` — página admin de saldos dos clientes
- `src/app/(private)/dashboard/stripe/page.tsx` — integração dos resumos de transação

### Prioridade Baixa — Saldo por Moeda + Webhook PayPay (2 endpoints)

| Endpoint | Método | Ficheiro | UI |
|----------|--------|----------|----|
| `GET /client-balances/user/{userId}/{currency}` | `getClientBalanceByCurrency()` | `stripe.service.ts:63` | `/dashboard/account` — Selector de moeda + CardStat |
| `POST /webhook/paypay` | `sendPayPayWebhook()` | `stripe.service.ts:97` | `/dashboard/webhook-test` — Formulário de simulação |

#### Ficheiros criados:
- `src/types/stripe.ts` — tipos `PayPayWebhookPayload`, `ClientBalanceByCurrency`
- `src/services/stripe.service.ts` — método de simulação de webhook
- `src/hooks/useClientBalanceByCurrency.ts` — hook query
- `src/hooks/usePayPayWebhook.ts` — hook mutation
- `src/app/(private)/dashboard/webhook-test/page.tsx` — página admin de simulação de webhook PayPay
- `src/app/(private)/dashboard/account/page.tsx` — integração do selector de moeda

---

## Novas Páginas Criadas

| Rota | Nome | Acesso | Descrição |
|------|------|--------|-----------|
| `/dashboard/paypay` | Fundo PayPay | Admin | Saldo, movimentos, creditar fundo, validar débito |
| `/dashboard/balances` | Saldos Clientes | Admin | Tabela de saldos com filtros + reconstrução |
| `/dashboard/webhook-test` | Simular Webhook | Admin | Formulário para testar webhook PayPay |

## Alterações na Sidebar

Foram adicionados 3 novos itens ao menu lateral (`Sidebar.tsx`):
1. **Fundo PayPay** — rota `/dashboard/paypay`, ícone `Wallet`, adminOnly
2. **Saldos** — rota `/dashboard/balances`, ícone `PiggyBank`, adminOnly
3. **Simular Webhook** — rota `/dashboard/webhook-test`, ícone `Webhook`, adminOnly

---

## Arquitetura Seguida

```
Service Layer (stripe.service.ts)
    ↓
React Query Hooks (usePayPayFund, useClientBalances, useTransactionSummary, etc.)
    ↓
Pages & Components (app/(private)/dashboard/*)
```

- **Service Layer:** Axios calls com token Bearer hardcoded (ausência temporária)
- **State Management:** React Query (TanStack Query) para server state com cache e invalidação
- **UI Components:** shadcn/ui (Card, Button, Input, Dialog) + Tailwind CSS
- **Ícones:** react-icons (Fi*) + lucide-react

---

## Estado Final

**15/15 endpoints** da API Stripe Server documentados em `docServerStripe.txt` foram implementados:

| # | Endpoint | Status |
|---|----------|--------|
| 1 | `GET /client-balances/admin/all` | ✅ |
| 2 | `GET /client-balances/user/{userId}` | ✅ |
| 3 | `GET /client-balances/user/{userId}/{currency}` | ✅ |
| 4 | `POST /client-balances/user/{userId}/validate-withdrawal` | ✅ |
| 5 | `POST /client-balances/admin/rebuild-from-transactions` | ✅ |
| 6 | `GET /transactions/user/{userId}` | ✅ |
| 7 | `GET /transactions/user/{userId}/summary` | ✅ |
| 8 | `GET /transactions/user/{userId}/summaries` | ✅ |
| 9 | `GET /transactions/admin/clients` | ✅ |
| 10 | `GET /transactions/admin/all` | ✅ |
| 11 | `GET /paypay-fund/admin/balance` | ✅ |
| 12 | `GET /paypay-fund/admin/movements` | ✅ |
| 13 | `POST /paypay-fund/admin/topups` | ✅ |
| 14 | `POST /paypay-fund/admin/validate-debit` | ✅ |
| 15 | `POST /webhook/paypay` | ✅ (simulação) |
