### GPAY - OPNIÃO DE MELHORIA <u>FRONTEND DO GPAY</u>

---
**Data**: 01/06/2026

**Autor**: João Tambue ( Dev. Frontend )

---

#### CONTEXTO

Este documento apresenta uma análise e opinão de melhoria do frontend do projecto **Gpay**, realizada com base nas melhores práticas do desenvolvimento moderno de software, focando-se especificamente na **arquitectura**, **código limpo**, **escalabilidade** e **facilidade de manutenção**.

Apesar da escolha tecnológica estar bem alinhada com as exigências actuais de mercado e proporcionar alta performance, a organização interna do código (arquitectura de pastas e separação de responsabilidades) carece de padronização. Se mantido no estado actual, o projecto enfrentará rapidamente problemas de escalabilidade, dificuldade em integrações futuras e custos elevados para manutenção (onboarding de novos devs será complexo).

---

#### ANÁLISE DO ESTADO ACTUAL & PONTOS CRÍTICOS

Durante a minha anlise ao código, foram identificados os seguintes gargalos:

1. **Acoplamento Forte entre UI e Regras de Negócio (Lógica)**
   - **Exemplo Crítico**: Na página `/dashboard/page.tsx`, o componente está a fazer de tudo. Ele gerencia o ciclo de vida da requisição (usando `useQuery` directamente), faz o parse de cookies (`parseCookies()`), processa os dados da API (cálculos matemáticos de transações) e, por fim, renderiza a UI.
   - **Impacto**: O componente fica enorme, impossível de testar de forma isolada, difícil de ler e zero reutilizável.

2. **Gestão de Tipagem (TypeScript)**
   - **Exemplo Crítico**: Os tipos estão espalhados pelos arquivos onde são usados ou misturados com lógicas de contexto (ex: `UserProps`, `SignInProps` no meio do `AuthContext.tsx`), em vez de centralizados.
   - **Impacto**: Dificulta a reutilização dos tipos e pode gerar inconsistência de dados.

3. **Duplicação da Gestão de Cookies e Estado da Sessão**
   - **Exemplo Crítico**: O `AuthContext` usa o `nookies` para lidar com cookies, mas o `Dashboard` importa de novo o `nookies` para ir buscar o token e passá-lo manualmente nos `headers` do axios para o React Query. O interceptor do axios (`api.ts`) deveria tratar de injetar o token de forma global e transparente.

4. **Falta de Abstração nas Chamadas de API**
   - As chamadas da API estão a ser feitas directamente dentro das funções `queryFn` do React Query nas páginas, em vez de estarem isoladas na camada de `services` ( algo que até recomendo bastante, isolar sempre as chamadas da API em services ).

---

#### MINHA PROPOSTA DE UMA NOVA ARQUITECTURA E BOAS PRÁTICAS

Para garantir escalabilidade, sugiro adotarmos uma arquitetura rigorosa focada no **Princípio da Responsabilidade Única (SRP)**. As camadas do sistema devem ser da seguintes forma:

**1. Serviços (Services)**
A camada responsável exclusivamente pela comunicação HTTP (via Axios é melhor). Nenhum estado reactivo (React Query ou Context).

```typescript
// src/services/transactions.service.ts
import { api } from './apiClients';
import { Transaction } from '@/types/global';

export const TransactionsService = {
  getAdminTransactions: async (): Promise<Transaction[]> => {
    const { data } = await api.get('/transactions');
    return data;
  },
  getTenantTransactions: async (tenantId: string): Promise<Transaction[]> => {
    const { data } = await api.get(`/transactions/tenant/${tenantId}`);
    return data;
  }
};
```

**2. Hooks (Hooks custumizados)**
Onde a lógica do negócio e integração com a API via React Query acontece. A página apenas invoca o hook.

```typescript
// src/hooks/useTransactions.ts
import { useQuery } from '@tanstack/react-query';
import { TransactionsService } from '@/services/transactions.service';
import { useAuth } from '@/hooks/useAuth'; // Hook para abstrair o AuthContext

export function useTransactions() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const tenantId = user?.tenant_id || user?.tenant?.tenant_id;

  return useQuery({
    queryKey: ['transactions', tenantId, isAdmin],
    queryFn: () => isAdmin ? TransactionsService.getAdminTransactions() : TransactionsService.getTenantTransactions(tenantId as string),
    enabled: isAdmin || !!tenantId,
  });
}
```

**3. Lógica de UI Isolada (Controllers / Presenters)**
Em vez de fazer cálculos (`reduce`, `filter`) directamente no render, devemos extrair para funções utilitárias em `src/utils` ou encapsular dentro do Hook para retornar os dados já prontos para a UI.

**4. Componentes e Páginas**
O Componente deve ser "burro". Ele não sabe de onde vêm os dados, só sabe renderizar.

```tsx
// src/app/(private)/dashboard/page.tsx
'use client'
import { useTransactions } from '@/hooks/useTransactions';
import { DashboardView } from '@/components/dashboard/DashboardView';

export default function Dashboard() {
  const { data: transactions, isLoading } = useTransactions();

  if (isLoading) return <LoadingSpinner />;
  
  // Apenas renderiza a View passando as props limpas
  return <DashboardView transactions={transactions || []} />;
}
```

---

#### PLANO DE ACÇÃO PARA MELHORIA CONTÍNUA (REFATORAÇÃO)

1. **Camada de Interceptadores Inteligente**:
   - Modificar o ficheiro `src/services/api.ts` para capturar o cookie dinamicamente em TODA requisição usando o axios interceptors, removendo a necessidade de ler o cookie (`parseCookies`) em todas as páginas.

2. **Organização da estrutura de Pastas**:
   - `src/app/` -> Apenas ficheiros de roteamento (pages, layouts, loading, errors).
   - `src/components/` -> UI Components genéricos e específicos de domínio.
   - `src/hooks/` -> Custom hooks para React Query, lógicas partilhadas de interface e de estado.
   - `src/services/` -> Apenas métodos que batem na API da Gpay.
   - `src/store/` -> Estado global da aplicação com Zustand (já em uso, mas deve ser expandido se caso houver necessidade).
   - `src/types/` -> Todas as interfaces e tipos do TypeScript centralizados (Modelos de domínio).
   - `src/utils/` -> Funções de formatação de moedas, cálculos de percentagens, validações.

3. **Remoção de lixo e Clean Code**:
   - Eliminar todo código "morto" (comentários tipo `//console.log`, `// erro ao deslogar`).
   - Evitar usar o tipo genérico `any` (presente nos `catch` do `AuthContext`). Tipar os erros correctamente utilizando as entidades que a própria API devolve.

4. **Escalabilidade UI/UX**:
   - Como estamos usando o Shadcn, certificar que todos os botões, inputs, modais e tooltips partilham os mesmos componentes de `src/components/ui` invés de criar HTML e CSS puramente nativo em cada vista isso distorce a consistencia.

#### RESULTADO ESPERADO

Ao seguir essa arquitectura, um erro de negócio não quebrará a UI. A equipa conseguirá escalar criando dezenas de novas features e painéis simultaneamente sem gerar conflitos de branch. Além disso, testes unitários poderão ser introduzidos facilmente na camada de serviços e hooks sem sequer tocar no React.
