#  Guia de Migração & Padrões - GPAY Frontend Refatorado

**Autor**: João Tambue
**Data**: 2 / 06 / 2026  
**Propósito**: Documentar como usar novos padrões na refatoração

---

##  Índice

1. [Como Estruturar Novo Fluxo](#como-estruturar-novo-fluxo)
2. [Padrão Service](#padrão-service)
3. [Padrão Hook](#padrão-hook)
4. [Padrão Tipo](#padrão-tipo)
5. [Padrão Página](#padrão-página)
6. [Padrão Componente](#padrão-componente)
7. [Migrando Código Antigo](#migrando-código-antigo)
8. [FAQ & Troubleshooting](#faq--troubleshooting)

---

##  Como Estruturar Novo Fluxo

### Cenário: Adicionar nova funcionalidade de "Logs de Auditoria"

**Passos:**

```
1. Criar tipos em src/types/
   └─ audit-logs.ts
   
2. Criar service em src/services/
   └─ audit-logs.service.ts
   
3. Criar hook em src/hooks/
   └─ useAuditLogs.ts
   
4. Criar página/componente em src/app/
   └─ (private)/dashboard/audit-logs/page.tsx
   
5. Usar em UI
   └─ Components consumem o hook
```

---

##  Padrão Service

### Template Básico

```typescript
// src/services/audit-logs.service.ts
import { api } from "@/services/apiClients";
import type { AuditLog, AuditLogFilter } from "@/types/global";

// Opcional: função auxiliar para mapear/normalizar
function mapAuditLog(raw: any): AuditLog {
  return {
    id: raw.id,
    action: raw.action,
    user: raw.user_name,
    timestamp: new Date(raw.created_at),
    resource: raw.resource_type,
    changes: raw.changes_json
  };
}

export const AuditLogsService = {
  // GET list
  async getAll(filters?: AuditLogFilter): Promise<AuditLog[]> {
    const { data } = await api.get<any[]>("/audit-logs", {
      params: filters
    });
    return data.map(mapAuditLog);
  },

  // GET by ID
  async getById(id: string): Promise<AuditLog> {
    const { data } = await api.get<any>(`/audit-logs/${id}`);
    return mapAuditLog(data);
  },

  // POST create
  async create(payload: Omit<AuditLog, "id">): Promise<AuditLog> {
    const { data } = await api.post<any>("/audit-logs", payload);
    return mapAuditLog(data);
  },

  // PUT update
  async update(id: string, payload: Partial<AuditLog>): Promise<AuditLog> {
    const { data } = await api.put<any>(`/audit-logs/${id}`, payload);
    return mapAuditLog(data);
  },

  // DELETE
  async delete(id: string): Promise<void> {
    await api.delete(`/audit-logs/${id}`);
  }
};
```

### Boas Práticas

 **DO:**

- Usar `/api/client` para setup (já tem interceptor)
- Tipar `<response>` e retornado `Promise<Domain>`
- Criar funções auxiliares para mapear API → Domain
- Cada método = um endpoint

 **DON'T:**

- Ler cookies (`parseCookies`)
- Passar headers manualmente
- Deixar lógica de filtro/cálculo
- Misturar estado (useState, etc)

---

##  Padrão Hook

### Template Básico

```typescript
// src/hooks/useAuditLogs.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuditLogsService } from "@/services/audit-logs.service";
import { useAuth } from "@/hooks/useAuth";
import type { AuditLog, AuditLogFilter } from "@/types/global";

export function useAuditLogs(filters?: AuditLogFilter) {
  const { user } = useAuth();
  
  // Lógica: apenas admin pode acessar
  const isAuthorized = user?.user_type === "admin";

  return useQuery({
    queryKey: ["audit-logs", filters, isAuthorized],
    queryFn: () => AuditLogsService.getAll(filters),
    enabled: isAuthorized, // Não executa se não autorizado
    staleTime: 1000 * 60 * 5, // Cache 5 minutos
  });
}

// Hook para criar (exemplo com mutation)
export function useCreateAuditLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => AuditLogsService.create(payload),
    onSuccess: () => {
      // Invalida cache para recarregar lista
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    }
  });
}

// Hook para delete
export function useDeleteAuditLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AuditLogsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    }
  });
}
```

### Boas Práticas

 **DO:**

- Usar `"use client"` no topo
- Verificar autorização com `useAuth()`
- Usar `queryKey` como array `[nome, ...filtros]`
- Invalided cache com `queryClient.invalidateQueries()`
- Usar `enabled: condition` para queries condicionais
- Retornar hook direto (deixa responsabilidade no consumidor)

 **DON'T:**

- Fazer HTTP direto (delegue ao service)
- Gerenciar estado com `useState` (use React Query)
- Esquecer de invalidar cache após mutation
- Deixar query executar quando não deve (`enabled`)

---

##  Padrão Tipo

### Template de Arquivo de Tipo

```typescript
// src/types/audit-logs.ts

/**
 * Representação de um Log de Auditoria no Sistema
 * Armazena todas as ações de usuários para compliance
 */
export type AuditLog = {
  id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "VIEW";
  user: string;
  timestamp: Date;
  resource: string;
  resourceId?: string;
  changes: Record<string, { before: any; after: any }>;
  ipAddress?: string;
  userAgent?: string;
};

/**
 * Payload para criar novo log
 * Usado na função create() do service
 */
export type AuditLogPayload = Omit<AuditLog, "id" | "timestamp">;

/**
 * Filtros para buscar logs
 */
export type AuditLogFilter = {
  action?: AuditLog["action"];
  user?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
};

/**
 * Response da API (pode diferir do tipo Domain)
 */
export type AuditLogResponse = {
  id: string;
  action: string;
  user_name: string;
  created_at: string; // ISO date
  resource_type: string;
  resource_id?: string;
  changes_json: Record<string, any>;
};
```

### Boas Práticas

 **DO:**

- Documentar tipos com JSDoc
- Usar tipos discriminados (`"CREATE" | "UPDATE"`)
- Separar types por domínio (um arquivo por feature)
- Exportar tipos específicos E genéricos
- Usar `Omit<>`, `Pick<>`, `Partial<>` para variações

 **DON'T:**

- Deixar tipos espalhados
- Usar `any`
- Duplicar tipos em múltiplos arquivos
- Tipos muito genéricos sem contexto

### Adicionar ao Barrel (global.d.ts)

```typescript
// src/types/global.d.ts
export type { AuditLog, AuditLogPayload, AuditLogFilter } from "./audit-logs";
```

---

##  Padrão Página

### Template Básico

```typescript
// src/app/(private)/dashboard/audit-logs/page.tsx
"use client";

import { useState } from "react";
import { useAuditLogs, useDeleteAuditLog } from "@/hooks/useAuditLogs";
import { AuditLogsTable } from "@/components/audit-logs/AuditLogsTable";
import { AuditLogsHeader } from "@/components/audit-logs/AuditLogsHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { AuditLogFilter } from "@/types/global";

export default function AuditLogsPage() {
  // Estado local para UI (modais, filtros)
  const [filters, setFilters] = useState<AuditLogFilter>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Dados vêm do hook (não de aqui)
  const { data: logs = [], isLoading, refetch } = useAuditLogs(filters);
  const deleteLog = useDeleteAuditLog();

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Handlers
  const handleDelete = async (id: string) => {
    if (confirm("Deseja deletar este log?")) {
      await deleteLog.mutateAsync(id);
      refetch();
    }
  };

  // Render
  return (
    <div className="space-y-6">
      <AuditLogsHeader
        onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
        onFilterChange={setFilters}
      />

      {isFilterOpen && (
        <AuditLogsFilterPanel
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}

      <AuditLogsTable
        logs={logs}
        onDelete={handleDelete}
        isDeleting={deleteLog.isPending}
      />
    </div>
  );
}
```

### Responsabilidades da Página

```
 Chamar hooks
 Gerenciar estado local (modais, filtros)
 Passar callbacks aos componentes
 Renderizar layout

 Fazer HTTP calls
 Lógica de negócio complexa
 Parsing de dados
```

---

##  Padrão Componente

### Componente "Burro" (Presentation)

```typescript
// src/components/audit-logs/AuditLogsTable.tsx
import type { AuditLog } from "@/types/global";

interface AuditLogsTableProps {
  logs: AuditLog[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function AuditLogsTable({ logs, onDelete, isDeleting }: AuditLogsTableProps) {
  // Apenas renderiza, não sabe de onde vêm os dados
  return (
    <table className="w-full">
      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td>{log.action}</td>
            <td>{log.user}</td>
            <td>{new Date(log.timestamp).toLocaleString("pt-BR")}</td>
            <td>{log.resource}</td>
            <td>
              <button
                onClick={() => onDelete(log.id)}
                disabled={isDeleting}
              >
                Deletar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Características

- Props bem tipadas
- Sem hooks (useState, useEffect)
- Sem HTTP calls
- Sem parsing de dados
- Reutilizável em múltiplas páginas

---

##  Migrando Código Antigo

### Caso 1: Página com HTTP Direto

**ANTES:**

```typescript
export default function OldPage() {
  const cookies = parseCookies();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/endpoint", {
      headers: { Authorization: `Bearer ${cookies['@gCorporate.token']}` }
    })
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  return <div>{data?.name}</div>;
}
```

**DEPOIS:**

```typescript
export default function NewPage() {
  const { data, isLoading } = useNewFeature(); // Hook cuida de tudo

  if (isLoading) return <LoadingSpinner />;

  return <div>{data?.name}</div>;
}
```

**Passos de Migração:**

1. Criar service com endpoint
2. Criar hook com useQuery
3. Remover `useState`, `useEffect`, `parseCookies`
4. Importar hook

---

### Caso 2: Tipos em Context

**ANTES:**

```typescript
// AuthContext.tsx
export type User = { ... };

// Componente
import type { User } from '@/contexts/AuthContext';
```

**DEPOIS:**

```typescript
// types/auth.ts
export type User = { ... };

// Componente (ambos funcionam)
import type { User } from '@/types/global';
```

**Mudança Gradual:**

- Novos arquivos: use `@/types/global`
- Código legado: continua funcionando (compatível)

---

##  FAQ & Troubleshooting

### **P: Por que meu hook não está executando?**

**R:** Verifique `enabled: condition`

```typescript
//  Query nunca executa se user é null
const { data } = useQuery({
  queryKey: ["items"],
  queryFn: () => ItemService.getAll(),
  enabled: user?.id // Aqui!
});

//  Execute sempre
const { data } = useQuery({
  queryKey: ["items"],
  queryFn: () => ItemService.getAll(),
  enabled: true // ou omita (padrão)
});
```

---

### **P: Como fazer cache de 10 minutos?**

**R:** Use `staleTime`

```typescript
return useQuery({
  queryKey: ["items"],
  queryFn: () => ItemService.getAll(),
  staleTime: 1000 * 60 * 10, // 10 minutos
});
```

---

### **P: Como recarregar dados após mutation?**

**R:** Invalide query key

```typescript
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ItemService.create,
    onSuccess: () => {
      // Recarrega lista
      queryClient.invalidateQueries({
        queryKey: ["items"]
      });
    }
  });
}
```

---

### **P: Posso usar `any` em types?**

**R:**  Não. Sempre defina tipos específicos.

```typescript
//  Evite
const response = data as any;

//  Faça
const response = data as AuditLog;

//  Ou se realmente desconhecido
const response = data as unknown as AuditLog;
```

---

### **P: Onde coloco validações?**

**R:** Em `src/utils` ou no service

```typescript
// src/utils/audit-log-validation.ts
export function validateAuditLog(log: any): AuditLog | null {
  if (!log.id || !log.action) return null;
  return log as AuditLog;
}

// Usar no service
export const AuditLogsService = {
  async getAll(): Promise<AuditLog[]> {
    const { data } = await api.get("/audit-logs");
    return data.map(item => validateAuditLog(item)).filter(Boolean);
  }
};
```

---

### **P: Como testar um service?**

**R:** Sem React! Jest puro.

```typescript
// src/services/audit-logs.service.test.ts
import { AuditLogsService } from "./audit-logs.service";

jest.mock("@/services/apiClients", () => ({
  api: {
    get: jest.fn()
  }
}));

test("getAll returns mapped logs", async () => {
  // mock api
  // call service
  // assert result
});
```

---

### **P: Como testar um hook?**

**R:** Com React Testing Library.

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useAuditLogs } from "./useAuditLogs";

test("useAuditLogs fetches logs", async () => {
  const { result } = renderHook(() => useAuditLogs());

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toHaveLength(2);
  });
});
```

---

##  Referência Rápida

### Criar Novo Fluxo

```bash
# 1. Tipo
echo 'export type X = {...}' > src/types/x.ts

# 2. Service
echo 'export const XService = {...}' > src/services/x.service.ts

# 3. Hook
echo 'export function useX() {...}' > src/hooks/useX.ts

# 4. Página
mkdir -p src/app/\(private\)/dashboard/x/
echo 'export default function X() {...}' > src/app/\(private\)/dashboard/x/page.tsx
```

### Imports Padrão

```typescript
// tipos
import type { X } from "@/types/global";

// service
import { XService } from "@/services/x.service";

// hook
import { useX } from "@/hooks/useX";

// componentes
import { XTable } from "@/components/x/XTable";

// utils
import { formatX } from "@/utils/x";
```

---

##  Checklist para Novo Fluxo

- [ ] Tipo criado em `src/types/`
- [ ] Tipo exportado em `src/types/global.d.ts`
- [ ] Service criado em `src/services/`
- [ ] Hook criado em `src/hooks/`
- [ ] Página/componente criado
- [ ] TypeScript passa (`npx tsc --noEmit`)
- [ ] Build passa (`npm run build`)
- [ ] ESLint passa (`npx eslint .`)
- [ ] Testes adicionados (opcional inicialmente)

---

**Pronto para começar! Siga esses padrões e o projeto escala naturalmente.** 
