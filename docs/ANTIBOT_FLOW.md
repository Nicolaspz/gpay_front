# Fluxo de Proteção Antibot — Login

## Visão Geral

Foram implementadas três camadas independentes de proteção antibot no formulário de login (`src/components/publicc/login-form.tsx`), cada uma num ficheiro separado dentro de `src/lib/antibot/`. Nenhum hook importa de outro — o componente de login é o único orquestrador.

---

## 1. Rate Limiting no Cliente — `useRateLimit.ts`

### Objetivo
Impedir que um atacante faça tentativas ilimitadas de login num curto período, mesmo que consiga contornar as outras proteções.

### Funcionamento
- Conta **tentativas falhadas consecutivas** (`attempts`).
- Quando `attempts >= maxAttempts` (default: 5), ativa um **cooldown de 30 segundos**.
- Durante o cooldown (`isLocked === true`):
  - O botão de submit fica **desabilitado**.
  - Exibe um aviso vermelho: *"Muitas tentativas falhadas. Aguarde Xs"*.
  - O texto do botão muda para *"Aguarde Xs"*.
  - Um intervalo (`setInterval` de 1s) decrementa o contador visual.
- Após o tempo expirar, o estado volta ao normal automaticamente.
- **`registerSuccess()`** — reset imediato do contador (login bem-sucedido).
- **`registerFailure()`** — incrementa o contador (credenciais inválidas).

### Configuração
```ts
useRateLimit({ maxAttempts: 5, lockoutMs: 30000 })
```

---

## 2. Honeypot Field — `useHoneypot.ts`

### Objetivo
Enganar bots que preenchem automaticamente todos os campos de input visíveis, incluindo campos escondidos com `display:none`. Este campo é invisível ao utilizador real mas visível a parsers ingénuos.

### Funcionamento
- O input é posicionado **fora do viewport** com CSS (`position: absolute; left: -9999px; opacity: 0`).
- **Não usa `display: none`** — muitos bots ignoram campos com `display: none`.
- Atributos adicionais:
  - `tabIndex={-1}` — não focável por navegação por teclado.
  - `aria-hidden="true"` — oculto para leitores de ecrã.
  - `autoComplete="off"` — impede preenchimento automático do browser.
  - `name="website"` — nome sugestivo para bots.
- Se o campo for preenchido (`value.length > 0`), `isTriggered` passa a `true`.
- No submit, se `isTriggered === true`, a função **retorna silenciosamente** sem qualquer erro visível (o bot não percebe que foi bloqueado).

### Integração no JSX
```tsx
<input {...honeypotProps} />
```

---

## 3. Deteção de Comportamento de Bot — `useBotBehavior.ts`

### Objetivo
Detetar bots que preenchem formulários via `element.value = ...` sem disparar eventos reais de interface do utilizador (keydown, mousedown, focus).

### Funcionamento
- Para cada campo rastreado (email e password), regista:
  - `hasFocus` — se o campo alguma vez recebeu foco.
  - `hasKeyDown` — se alguma tecla foi pressionada no campo.
  - `hasMouseDown` — se houve clique no campo.
- **`registerField(id)`** devolve um objeto com `ref` + handlers (`onKeyDown`, `onMouseDown`, `onFocus`) para espalhar no input.
- Os handlers atualizam flags em **refs mutáveis** (sem causar re-renders).
- **`isSuspicious()`** percorre todos os campos configurados:
  - Se algum campo **nunca recebeu focus** → suspeito.
  - Se algum campo **nunca teve keydown nem mousedown** → suspeito.
- Se `isSuspicious()` retorna `true` no submit, a função **retorna silenciosamente** sem erro visível.

### Integração no JSX
```tsx
<Input ref={emailField.ref}
       onKeyDown={emailField.onKeyDown}
       onMouseDown={emailField.onMouseDown}
       onFocus={emailField.onFocus} ... />
```

---

## 4. Orquestração no Componente de Login

No `handleLogin`, a ordem de verificação é:

```
1. Honeypot preenchido?          → retorno silencioso (sem erro)
2. Comportamento suspeito?        → retorno silencioso (sem erro)
3. Rate limit ativo?              → mostra erro com contagem decrescente
4. Chamada à API de login
   ├── Sucesso → registerSuccess() (reseta contador)
   └── Erro    → registerFailure() (incrementa contador)
```

### Feedback visual
- **Honeypot/Comportamento**: invisível para o atacante.
- **Rate limit**: aviso vermelho com `ShieldAlert` + botão desabilitado com contagem regressiva.
- **Erro de credenciais**: toast *"Erro ao fazer login. Verifique suas credenciais."* (comportamento normal).

---

## 5. Regras de Implementação Seguidas

| Regra | Status |
|---|---|
| TypeScript estrito — sem `any` | ✅ |
| Nenhum hook importa de outro hook antibot | ✅ |
| Nenhum hook tem efeitos secundários fora do seu escopo | ✅ |
| Componente de login é o único orquestrador | ✅ |
| Hooks puros e testáveis isoladamente | ✅ |
| Input honeypot sem `display:none` | ✅ |
| Retorno silencioso sem erro visível para honeypot/bot | ✅ |
| Cooldown visual com contagem decrescente (segundos) | ✅ |

---

## 6. Estrutura de Ficheiros

```
src/lib/antibot/
├── index.ts              → barrel (re-exporta tudo)
├── types.ts              → interfaces partilhadas
├── useRateLimit.ts       → hook de rate limiting
├── useHoneypot.ts        → hook de campo honeypot
└── useBotBehavior.ts     → hook de deteção de bot

src/components/publicc/
└── login-form.tsx        → integração dos 3 hooks
```
