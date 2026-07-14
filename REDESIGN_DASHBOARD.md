# Redesign Completo da Dashboard — Gpayment

## Visão Geral

Redesign completo da interface administrativa do **Gpayment** (`gpay_front`), um gateway de pagamentos para Angola. O dashboard atual é funcionalmente sólido, mas visualmente genérico — utiliza cores hardcoded, sombras uniformes, layout sem hierarquia de dados e inconsistências entre dark/light mode. O objetivo é transformá-lo em uma interface **premium, profissional e reconhecível**, inspirada nos melhores dashboards de fintech do mercado (Stripe, Ramp, Mercury, Wise, Linear), mantendo a identidade de marca da Gpayment.

---

## 1. Diagnóstico do Dashboard Atual

### Problemas Identificados

| # | Problema | Impacto |
|---|---------|---------|
| 1 | **Cores hardcoded** — `#1F2937`, `#F9FAFB`, `#2D2E3F`, `#1B1C2A`, `#8884d8` usadas diretamente em componentes em vez de variáveis CSS do theming | Dark mode parcialmente quebrado, impossível trocar tema |
| 2 | **Cards de métricas sem hierarquia** — 6 cards idênticos em grid 4 colunas, sem métrica "hero" destacada | Usuário não sabe qual número olhar primeiro |
| 3 | **Sombras uniformes** — apenas `shadow-sm` e `shadow-lg`, sem sistema de elevação escalonado | Interface sem profundidade, visualmente "plana" |
| 4 | **Sidebar genérica** — fundo branco/escuro com borda sutil, sem personalidade | Não transmite identidade de marca |
| 5 | **Header mínimo** — apenas título + avatar + toggle de tema | Desperdiça espaço para ações rápidas e contexto |
| 6 | **Gráficos básicos** — Recharts com configuração padrão, sem animação, sem gradientes | Visualmente desinteressante |
| 7 | **Tabela de transações** — header `#2D2E3F` hardcoded, sem recursos de escaneabilidade | Difícil de ler em light mode |
| 8 | **Scrollbar global** — cores hardcoded (`#f1f1f1`, `#888`) que não respondem ao dark mode | Quebrado no dark mode |
| 9 | **Componentes Transaction** — estilizados 100% para dark mode hardcoded | Inutilizáveis em light mode |
| 10 | **SettingsHeader** — `text-gray-900` sem suporte dark mode | Quebrado no dark mode |
| 11 | **Animações básicas** — apenas `fadeIn`, sem microinterações | Interface sem vida |
| 12 | **Tipografia sem hierarquia** — tamanhos inconsistentes entre páginas | Falta de consistência visual |

---

## 2. Filosofia de Design

### Princípios

1. **Hierarquia por dados, não por decoração** — O tamanho e a posição de cada elemento comunicam sua importância (princípio do bento grid do Apple/Stripe).
2. **Confiança através da transparência** — Mostrar os números que importam claramente, sem esconder nada (inspiração: Wise, Stripe).
3. **Precisão sobre simplicidade** — Em fintech, o usuário precisa ver a complexidade organizada, não simplificada (inspiração: Stripe dashboard, Ramp).
4. **Profissionalismo institucional** — A interface deve parecer um instrumento financeiro, não um app de consumer (inspiração: Stripe, Brex).
5. **Identidade de marca reconhecível** — Evitar o "Stripe design monoculture" (dark mode genérico + Inter + monospace + bento grid), criar uma identidade própria.

### Referências de Mercado

| Produto | O que inspirar | Por quê |
|---------|---------------|---------|
| **Stripe Dashboard** | Hierarquia de dados, density para usuários técnicos, event logs, error breakdown visual | Referência de ouro em fintech dashboards |
| **Ramp** | Métrica hero "savings first", hierarchy-driven redesign (33% faster reviews) | Mostra que hierarchy > aesthetics |
| **Mercury** | Minimal density para founders, cash balance como métrica primária | Prova que less is more funciona |
| **Wise** | Transparência de fees, pending transfer status como hero | Confiança = mostrar o que outros escondem |
| **Linear** | Microinterações refinadas, transições suaves, dark mode premium | Excelência em UI polish |
| **Brex** | Finance operating system, policy compliance como métrica | Organizar por tarefa do usuário, não por estrutura de dados |

---

## 3. Sistema de Design

### 3.1 Paleta de Cores

#### Identidade de Marca Gpayment

A marca Gpayment usa um **gradiente azul→ciano** (`#5b68eb` → `#28e1fd`) como elemento registrado. Este gradiente deve ser usado com precisão cirúrgica — não como fundo de cards, mas como:
- Cor de acento em CTAs primários
- Avatar do usuário
- Indicadores de estado ativo
- Destaques de dados positivos

#### Tema Claro (Light Mode)

```css
/* Fundos */
--bg-primary: #FFFFFF;           /* Canvas principal */
--bg-secondary: #F8FAFD;         /* Fundo de seções alternadas, sidebar */
--bg-tertiary: #F0F4F8;          /* Fundo de cards de métricas */
--bg-elevated: #FFFFFF;          /* Cards elevados */

/* Texto */
--text-primary: #0A1628;         /* Heading principal (navy escuro, nunca preto puro) */
--text-secondary: #475569;       /* Corpo de texto, labels */
--text-muted: #94A3B8;           /* Texto auxiliar, placeholders */
--text-inverse: #FFFFFF;          /* Texto em fundos escuros */

/* Borda */
--border-default: #E2E8F0;       /* Bordas de cards, inputs */
--border-subtle: #F1F5F9;        /* Bordas sutis, divisórios */
--border-strong: #CBD5E1;        /* Bordas em hover/focus */

/* Acento (brand) */
--accent-primary: #5B68EB;       /* CTA principal, links, indicadores ativos */
--accent-primary-hover: #4A57D4; /* Hover do accent */
--accent-primary-subtle: #EEF0FF; /* Fundo sutil do accent */
--accent-gradient-start: #5B68EB; /* Gradiente marca */
--accent-gradient-end: #28E1FD;   /* Gradiente marca */

/* Estados */
--success: #10B981;              /* Transações concluídas */
--success-subtle: #ECFDF5;       /* Fundo success */
--warning: #F59E0B;              /* Transações pendentes */
--warning-subtle: #FFFBEB;       /* Fundo warning */
--danger: #EF4444;               /* Falhas, erros */
--danger-subtle: #FEF2F2;        /* Fundo danger */
--info: #3B82F6;                 /* Informação */
--info-subtle: #EFF6FF;          /* Fundo info */
```

#### Tema Escuro (Dark Mode)

```css
/* Fundos */
--bg-primary: #0B1120;           /* Canvas principal (navy escuro, nunca #000) */
--bg-secondary: #111827;         /* Sidebar, sections */
--bg-tertiary: #1E293B;          /* Cards de métricas */
--bg-elevated: #1E293B;          /* Cards elevados com maior contraste */

/* Texto */
--text-primary: #F1F5F9;         /* Heading principal */
--text-secondary: #94A3B8;       /* Corpo de texto */
--text-muted: #64748B;           /* Texto auxiliar */
--text-inverse: #0A1628;         /* Texto em fundos claros */

/* Borda */
--border-default: rgba(255, 255, 255, 0.08);
--border-subtle: rgba(255, 255, 255, 0.04);
--border-strong: rgba(255, 255, 255, 0.15);

/* Acento (brand) — mesmo valor do light */
--accent-primary: #7B88F0;       /* Levemente mais claro para contraste */
--accent-primary-hover: #5B68EB;
--accent-primary-subtle: rgba(91, 104, 235, 0.15);

/* Estados — mesmas cores do light */
--success: #34D399;
--success-subtle: rgba(16, 185, 129, 0.15);
--warning: #FBBF24;
--warning-subtle: rgba(245, 158, 11, 0.15);
--danger: #F87171;
--danger-subtle: rgba(239, 68, 68, 0.15);
--info: #60A5FA;
--info-subtle: rgba(59, 130, 246, 0.15);

/* Gráficos */
--chart-1: #5B68EB;
--chart-2: #28E1FD;
--chart-3: #F59E0B;
--chart-4: #10B981;
--chart-5: #EF4444;
```

#### Regras de Uso

- **Nunca** usar cores hardcoded em componentes. Sempre usar variáveis CSS.
- **O gradiente da marca** (`#5b68eb` → `#28e1fd`) aparece apenas em: avatar do usuário, CTA principal, e indicador de estado ativo.
- **Cores de status** (`success`, `warning`, `danger`) são universais e usadas em badges, gráficos, e indicadores.
- **Textos nunca são pretos puros** — usar `#0A1628` (light) ou `#F1F5F9` (dark).
- **Fundo nunca é branco puro** em dark mode — usar `#0B1120` como canvas.

### 3.2 Tipografia

#### Filosofia Tipográfica

A tipografia atual (Roboto/Geist) é funcional mas **genérica** — transmite "app genérico" e não "instituição financeira profissional". O redesign adota um sistema de **duas famílias** com personalidade distinta:

1. **Display/Headings**: **Clash Display** — fonte geométrica com ângulos marcantes e presença forte. Usada apenas em títulos grandes e números hero. Dá personalidade e diferencia visualmente de todos os dashboards genéricos que usam Inter.
2. **Body/UI**: **Satoshi** — grotesque geométrica moderna, limpa, com excelente legibilidade em 12-14px. Projetada para dashboards de alta densidade. Suporta tabular figures nativamente.

**Por que não Inter?** Inter é excelente mas tornou-se o "Helvetica de dashboards" — todo mundo usa, resultando em visual identical. Satoshi oferece a mesma clareza com mais personalidade. Clash Display nos headings cria uma identidade visual imediata e reconhecível.

**Por que não Geist?** Geist tem problemas de rendering em Windows ClearType em 1080p com tamanhos menores (14px). Satoshi não tem esse problema.

#### Fontes

```tsx
// app/fonts.ts
import { Clash_Display } from 'next/font/fontshare';
import { Satoshi } from 'next/font/fontshare';

export const clashDisplay = Clash_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const satoshi = Satoshi({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '700', '900'],
});
```

```css
/* Font Stack */
--font-display: 'Clash Display', ui-sans-serif, system-ui, sans-serif;
--font-body: 'Satoshi', ui-sans-serif, system-ui, sans-serif;
--font-mono: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;

/* Tabular figures para dados financeiros */
--font-feature-tnum: "tnum";
```

**Fontshare** — biblioteca gratuita de fontes premium (clash.design/fontshare.com). Não requer Google Fonts. Suporte a Next.js via `next/font/fontshare`.

#### Escala Tipográfica

| Role | Fonte | Tamanho | Peso | Line Height | Letter Spacing | Uso |
|------|-------|---------|------|-------------|---------------|-----|
| `display-hero` | Clash Display | 36px | 700 | 1.1 | -0.03em | Números hero das métricas (volume total) |
| `display-sm` | Clash Display | 28px | 600 | 1.15 | -0.02em | Números secundários grandes |
| `h1` | Clash Display | 22px | 600 | 1.25 | -0.01em | Títulos de página |
| `h2` | Satoshi | 16px | 700 | 1.35 | normal | Títulos de seção |
| `h3` | Satoshi | 14px | 700 | 1.35 | normal | Títulos de card |
| `label` | Satoshi | 13px | 500 | 1.4 | 0.01em | Labels de campo, navigation items |
| `body` | Satoshi | 14px | 400 | 1.5 | normal | Texto corrido, descrições |
| `body-sm` | Satoshi | 13px | 400 | 1.45 | normal | Texto compacto em tabelas |
| `caption` | Satoshi | 12px | 500 | 1.35 | 0.02em | Badges, timestamps, texto auxiliar |
| `micro` | Satoshi | 11px | 500 | 1.3 | 0.03em | Labels mínimo, indicadores inline |
| `mono` | Geist Mono | 13px | 500 | 1.5 | normal | Valores monetários, IDs, códigos API |
| `mono-lg` | Geist Mono | 18px | 600 | 1.4 | -0.01em | Valores monetários grandes em cards |

#### Regras de Tipografia

- **Números monetários**: sempre `font-family: var(--font-mono)` + `font-feature-settings: "tnum"` + peso 600. Alinhamento perfeito em colunas.
- **Deltas de variação** (ex: `+12.5%`): Satoshi 700, cor semântica (verde/vermelho), sem ícone de seta (o sinal +/- já comunica).
- **Labels de status**: Satoshi 500, 12px, letter-spacing 0.02em. Nunca uppercase — é mais legível em sentence case.
- **Seções da sidebar**: Satoshi 500, 11px, UPPERCASE, letter-spacing 0.08em — cria hierarquia visual clara.
- **Headings de página**: Clash Display sempre. Nunca usar Satoshi para títulos de página.
- **Hierarquia visual**: display-hero > display-sm > h1 > h2 > h3 > label > body > body-sm > caption > micro — nunca quebrar essa ordem.
- **Em dark mode**: pesos 400 ficam levemente mais finos visualmente — usar 500 para body em dark mode se necessário.

#### Paleta Tipográfica de Cores

| Contexto | Light Mode | Dark Mode |
|----------|-----------|-----------|
| Heading principal | `#0A1628` | `#F1F5F9` |
| Body text | `#334155` | `#CBD5E1` |
| Label/secondary | `#64748B` | `#94A3B8` |
| Caption/muted | `#94A3B8` | `#64748B` |
| Link/interactive | `#5B68EB` | `#7B88F0` |
| Disabled | `#CBD5E1` | `#475569` |

### 3.4 Espaçamento

Grid base de **4px**. Todos os espaçamentos devem ser múltiplos de 4:

```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
```

| Contexto | Espaçamento |
|----------|-------------|
| Gap entre cards no grid | 16px (desktop) / 12px (mobile) |
| Padding interno de cards | 20px (compact) / 24px (standard) |
| Gap entre seções | 24px |
| Padding da página | 24px (mobile) / 32px (desktop) |
| Gap entre items de menu | 2px |
| Padding de items de menu | 10px 12px |

### 3.3 Sistema de Elevação (Shadows)

O sistema de sombras atual é inexistente (apenas `shadow-sm` genérico). O redesign introduz **5 níveis de elevação** com transições suaves entre eles — inspirado no sistema de elevation do Stripe Dashboard.

```css
/* Nível 0 — Flat (tabelas, separadores, elementos inline) */
shadow-none

/* Nível 1 — Subtle (cards em repouso, sidebar desktop) */
shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.04);

/* Nível 2 — Raised (cards em hover, sidebar flutuante em tablet) */
shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06);

/* Nível 3 — Floating (dropdowns, popovers, selects abertos) */
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);

/* Nível 4 — Overlay (modais de confirmação, command palette) */
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);

/* Nível 5 — Dramatic (modais de destructive action) */
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);

/* Focus ring — accessibilidade (visível, não decorativo) */
focus-ring: 0 0 0 2px var(--bg-primary), 0 0 0 4px var(--accent-primary);

/* Inset shadow — para inputs e elementos pressionados */
shadow-inset: inset 0 1px 2px 0 rgba(0, 0, 0, 0.06);
```

#### Mapa de Uso Detalhado

| Elemento | Shadow Level | Transição | Observação |
|----------|-------------|-----------|------------|
| Card de métrica (repouso) | Nível 1 (xs) | — | Quase flat, apenas separação sutil |
| Card de métrica (hover) | Nível 2 (sm) | 200ms ease | Eleva + translateY(-1px) |
| Tabela | Nível 0 | — | Separada por borda, não por sombra |
| Sidebar desktop | Nível 1 (xs) | — | Separada por border-right |
| Sidebar mobile (Sheet) | Nível 5 (xl) | 300ms ease | Slide-in com overlay |
| Dropdown/Popover | Nível 3 (md) | 150ms ease | Eleva rapidamente ao abrir |
| Modal/Dialog | Nível 4 (lg) | 200ms ease | Overlay preto 40% + card elevado |
| Command Palette (CmdK) | Nível 5 (xl) | 200ms ease | Maxima elevação, centro da tela |
| Input focus | Focus ring | 150ms ease | Anel de foco, não sombra |
| Button primary hover | Nível 2 (sm) | 150ms ease | Sutil elevação |
| Button primary active | shadow-inset | 100ms ease | Pressionado para dentro |
| Toast notification | Nível 3 (md) | 300ms ease | Entra de fora da tela (right side) |
| Tooltip | Nível 3 (md) | 100ms ease | Aparece rapido, desaparece rapido |

#### Dark Mode

```css
/* Dark mode — sombras levemente mais fortes para compensar menor contraste */
@media (prefers-color-scheme: dark) {
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.35), 0 2px 4px -2px rgba(0, 0, 0, 0.25);
}
```

### 3.5 Border Radius — Geometria Afiada

AUI atual usa border-radius de 10-12px que dá uma aparência "amolecida" e genérica. O redesign adota uma geometria **mais afiada e institucional** — inspirada no Stripe Dashboard e Brex, onde o radius mínimo transmite precisão e seriedade financeira.

**Regra geral**: Quanto mais funcional/interativo o elemento, menor o radius. Quanto mais "container" o elemento, maior o radius. Mas **nunca acima de 8px** para manter a estética afiada.

```css
--radius-xs: 2px;    /* Separadores inline, dots de status */
--radius-sm: 4px;    /* Inputs, buttons pequenos, badges */
--radius-md: 6px;    /* Buttons, selects, dropdown items */
--radius-lg: 8px;    /* Cards de métrica, containers, modais */
--radius-xl: 12px;   /* Cards grandes (hero card apenas) */
--radius-full: 9999px; /* Avatars, pills de status (única exceção) */
```

#### Comparação: Atual vs Redesign

| Elemento | Atual | Redesign | Razão |
|----------|-------|----------|-------|
| Card de métrica | `rounded-xl` (12px) | `rounded-lg` (8px) | Mais institucional, menos "app consumer" |
| Button | `rounded-md` (8px) | `rounded-md` (6px) | Mais afiado, profissional |
| Input | `rounded-md` (8pxpx) | `rounded-sm` (4px) | Precision em forms |
| Modal/Dialog | `rounded-lg` (12px) | `rounded-lg` (8px) | Consistência |
| Badge de status | `rounded-full` (pill) | `rounded-full` (pill) | Mantido — pills são universais |
| Avatar | `rounded-full` | `rounded-full` | Mantido |
| Tabela | `rounded-xl` | `rounded-none` | Tabelas não devem ter radius |
| Sidebar | `rounded-none` | `rounded-none` | Sidebar é structural, não card |
| Dropdown | `rounded-lg` (12px) | `rounded-md` (6px) | Mais compacto, mais denso |
| Toast/Notification | `rounded-lg` (12px) | `rounded-md` (6px) | Menos visual weight |

#### Por que esta geometria?

- **Stripe Dashboard** usa 4-6px para tudo — transmite "instrumento financeiro"
- **Brex** usa 6-8px — transmite "enterprise software"
- **Linear** usa 6-8px — transmite "ferramenta de produto"
- Apps com 12-16px radius (ex: iOS apps) transmitem "consumer app" — não é o positioning correto para um gateway de pagamentos B2B

### 3.6 Animações e Microinterações

```css
/* ═══════════════════════════════════════════════════════════
   TRANSIÇÕES BASE
   ═══════════════════════════════════════════════════════════ */

/* Transição padrão para a maioria dos elementos */
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Transição mais lenta para elementos grandes (cards, modais) */
transition-slow: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

/* Transição rápida para microinterações (hover items de menu) */
transition-fast: all 100ms ease;

/* ═══════════════════════════════════════════════════════════
   HOVER EM CARDS — elevação suave
   ═══════════════════════════════════════════════════════════ */
.card-hover {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1),
              border-color 200ms ease;
}
.card-hover:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
  border-color: var(--border-default);
}

/* ═══════════════════════════════════════════════════════════
   SKELETON LOADING — shimmer animation
   ═══════════════════════════════════════════════════════════ */
@keyframes skeleton-shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 0%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 100%
  );
  background-size: 200px 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

/* ═══════════════════════════════════════════════════════════
   TRANSIÇÃO DE TEMA (light ↔ dark)
   ═══════════════════════════════════════════════════════════ */
* {
  transition: background-color 300ms ease,
              color 300ms ease,
              border-color 300ms ease;
}

/* ═══════════════════════════════════════════════════════════
   DROPDOWN / POPOVER
   ═══════════════════════════════════════════════════════════ */
@keyframes dropdown-enter {
  from { opacity: 0; transform: translateY(-4px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ═══════════════════════════════════════════════════════════
   SCROLLBAR CUSTOMIZADA — dark-mode-aware
   ═══════════════════════════════════════════════════════════ */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border-default);
  border-radius: var(--radius-full);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--border-strong);
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--border-default) transparent;
}

/* ═══════════════════════════════════════════════════════════
   PULSE ANIMATION — para dots de status "processando"
   ═══════════════════════════════════════════════════════════ */
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.animate-pulse-dot {
  animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* ═══════════════════════════════════════════════════════════
   REDUCED MOTION — acessibilidade
   ═══════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Substitui a lib atual de toast pelo Sonner

#### Exemplo: Dashboard com Tremor

O Tremor oferece blocks prontos que podem servir de base. O `Dashboard Payment Analytics` do shadcn/ui/blocks é particularmente relevante:

```
// src/app/(private)/dashboard/page.tsx — nova estrutura
import { Grid, Card, Metric, Text, AreaChart, BarList, DonutChart } from "@tremor/react";

// Layout bento com Tremor
<Grid numItems={4} className="gap-4">
  <Card numColSpan={2}>  {/* Hero card */}
    <Text>Total de Transações</Text>
    <Metric>1.245.890 AOA</Metric>
    <AreaChart data={data} categories={["value"]} colors={["indigo"]} className="h-20 mt-4" />
  </Card>
  <Card>  {/* Secundário */}
    <Text>Pendentes</Text>
    <Metric>127</Metric>
  </Card>
  <Card>  {/* Secundário */}
    <Text>Falhas</Text>
    <Metric>23</Metric>
  </Card>
</Grid>
```

### 4. Layout e Estrutura

### 4.1 Sidebar Redesenhada

#### Conceito

A sidebar passa de um container genérico branco/escuro para um **painel lateral com identidade de marca**. Inspirada na sidebar do Linear e Stripe Dashboard — limpa, com hierarquia clara, e um toque da identidade visual Gpayment.

#### Layout

```
┌──────────────────────────────┐
│  [Logo]                      │  ← 56px height, padding 20px
│  Gpayment                    │
│                              │
├──────────────────────────────┤
│                              │
│  🏠 Visão Geral              │  ← Item ativo: bg accent-subtle + accent text
│  👤 Perfil                   │
│  ─────────────               │  ← Separator sutil
│  💳 Transações               │  ← Seção: "Financeiro"
│    Transações Nacionais      │
│    Transações Internacionais │
│  📊 Comercial                │
│                              │
│  ─────────────               │  ← Separator sutil
│                              │
│  ⚙️ Configurações            │  ← Seção: "Sistema"
│  🔑 Chaves API               │
│  🔔 Webhooks                 │
│  👥 Clientes  [Admin]        │  ← Badge "Admin" opcional
│  💰 Fundo PayPay  [Admin]    │
│  📈 Saldos  [Admin]          │
│  🧪 Simular Webhook  [Admin] │
│  📋 Logs  [Admin]            │
│                              │
├──────────────────────────────┤
│  ⚡ Última atualização       │  ← Footer: timestamp + status
│     há 2 minutos             │
│     ● Sistema operacional    │  ← Dot verde = online
└──────────────────────────────┘
```

#### Estilo

- **Largura**: 240px (colapsável para 64px com apenas ícones em tablet)
- **Background**: `--bg-secondary` com `border-right: 1px solid --border-default`
- **Logo**: Gradiente da marca no ícone + nome "Gpayment" em peso 700
- **Items de menu**:
  - Default: `text-secondary` com `hover:bg-accent-primary-subtle hover:text-accent-primary`
  - Ativo: `bg-accent-primary-subtle text-accent-primary font-medium` com `border-left: 2px solid --accent-primary`
  - Gap entre items: 2px
  - Padding: `10px 12px`
  - Border radius: `8px`
  - Ícones: 18px, cor herda do item
  - Transição: `all 150ms ease`
- **Separadores**: `height: 1px`, `background: --border-subtle`, `margin: 8px 12px`
- **Seções**: Label em `caption` (12px, peso 500, `text-muted`, uppercase, `letter-spacing: 0.05em`, padding `16px 12px 4px`)
- **Footer**: Status do sistema com dot animado (pulse), timestamp da última atualização
- **Em hover de item**: ícone faz scale 1.05, transição suave
- **Scrollbar**: Customizada, 4px de largura, `--border-default` no thumb

### 4.2 Header Redesenhado

#### Conceito

O header passa de um container mínimo para uma **barra de contexto** que mostra onde o usuário está, fornece busca rápida, e mantém as ações acessíveis.

#### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [🔍 Buscar transações, clientes, configurações...]     [🔔] [🌙] [👤 ▼]  │
│                                                                              │
│  Dashboard Geral           Últimas 24h  |  Últimos 7d  |  Últimos 30d      │
│  Visão geral das suas transações e performance                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Estilo

- **Background**: `--bg-primary` (sem cor de fundo, seamless com o canvas)
- **Border-bottom**: `1px solid --border-subtle`
- **Padding**: `16px 32px`
- **Altura**: Auto (depende do conteúdo)
- **Seção de breadcrumb/título**:
  - Título: `h1` (24px, peso 700)
  - Descrição: `body` (14px, `text-muted`)
  - Subtítulo contextual dinâmico baseado na página
- **Barra de busca**:
  - Largura: 320px (colapsável)
  - Background: `--bg-secondary`
  - Border: `1px solid --border-default`
  - Border-radius: `--radius-md`
  - Placeholder: "Buscar..."
  - Ícone de busca à esquerda
  - Atalho: `Ctrl+K` ou `⌘K`
  - **CmdK palette**: Ao clicar, abre um modal de busca estilo Linear/Notion que busca transações, clientes, configs
- **Ações do header**:
  - Theme toggle: botão ghost com ícone Sun/Moon, transição de rotação 300ms
  - Notificações: botão ghost com badge vermelho para não lidas
  - Avatar: gradiente da marca, dropdown com perfil, configurações, logout

### 4.3 Área de Conteúdo

#### Layout Base

```
┌────────────────────────────────────────────────┐
│  Header (breadcrumb + actions)                 │
├────────────────────────────────────────────────┤
│                                                │
│  padding: 32px                                │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │  Métricas Hero (Bento Grid)             │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  ┌─────────────────────┐ ┌─────────────────┐  │
│  │  Gráfico Principal  │ │  Gráfico Side   │  │
│  │  (área / linha)     │ │  (donut/barras) │  │
│  └─────────────────────┘ └─────────────────┘  │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │  Tabela de Transações Recentes           │  │
│  └──────────────────────────────────────────┘  │
│                                                │
└────────────────────────────────────────────────┘
```

- **Max-width do conteúdo**: 1200px, centralizado
- **Background**: `--bg-primary`
- **Scroll**: Suave, `overflow-y: auto` na área de conteúdo

---

## 5. Componentes Redesenhados

### 5.1 Cards de Métricas — Bento Grid Hero

#### Conceito

Em vez de 6 cards idênticos, usar um **layout bento grid assimétrico** onde a métrica mais importante ocupa mais espaço. A métrica "hero" (ex: Total de Transações ou Volume Total) ocupa 2 colunas, enquanto métricas secundárias ocupam 1 coluna cada.

#### Layout Proposto

```
Desktop (grid 4 colunas):
┌──────────────────┐ ┌──────────┐ ┌──────────┐
│                  │ │ Pendentes│ │  Falhas  │
│  Total Geral     │ │  127     │ │   23     │
│  1.245.890 AOA   │ │  ▲ 12%   │ │  ▼ 5%    │
│  ▲ 15.3% vs mês  │ │          │ │          │
│  [mini sparkline] │ │          │ │          │
│                  │ └──────────┘ └──────────┘
│                  │ ┌──────────┐ ┌──────────┐
│                  │ │ Receita  │ │ Maior Tx │
│                  │ │ 892K AOA │ │ 45K AOA  │
└──────────────────┘ └──────────┘ └──────────┘

Mobile (stacked):
┌──────────────────┐
│  Total Geral     │
│  1.245.890 AOA   │
│  ▲ 15.3% vs mês  │
└──────────────────┘
┌──────────┐ ┌──────────┐
│ Pendentes│ │  Falhas  │
└──────────┘ └──────────┘
...
```

#### Estilo do Card Hero

- **Background**: Gradiente sutil da marca em ângulo (135deg, `--accent-primary-subtle` → transparente)
- **Border**: `1px solid --border-default` (light) / `1px solid --border-default` (dark)
- **Border-radius**: `--radius-lg` (12px)
- **Padding**: 24px
- **Shadow**: `shadow-sm` em repouso, `shadow-md` em hover com `translateY(-1px)`
- **Transição**: `all 200ms ease`
- **Título da métrica**: `caption` (12px, peso 500, `text-muted`, uppercase, `letter-spacing: 0.05em`)
- **Valor**: `display` (30px, peso 700, `text-primary`, `font-feature-settings: "tnum"`)
- **Delta**: `body` (14px, peso 600)
  - Positivo: `--success`
  - Negativo: `--danger`
  - Neutro: `--text-muted`
  - Ícone: seta ▲/▼ antes do texto
- **Mini sparkline** (apenas card hero): gráfico de área sutil com 7 pontos, gradiente da marca, sem eixos, sem labels, apenas a forma visual da tendência

#### Estilo do Card Secundário

- **Background**: `--bg-secondary`
- **Border**: `1px solid --border-subtle`
- **Border-radius**: `--radius-md` (8px)
- **Padding**: 16px
- **Shadow**: Nenhum em repouso, `shadow-sm` em hover
- **Título**: `caption` (12px, peso 500, `text-muted`)
- **Valor**: `h2` (18px, peso 700, `text-primary`)
- **Delta**: `caption` (12px, peso 600, cor semântica)

### 5.2 Gráficos

#### TrendsChart (Gráfico de Linhas/Área)

**Mudanças necessárias:**
- Trocar `LineChart` puro por **`AreaChart` com gradiente** preenchido abaixo da linha
- Adicionar **tooltip customizado** com design premium (fundo `--bg-elevated`, borda sutil, shadow-lg, `border-radius: --radius-md`)
- Adicionar **legenda interativa** acima do gráfico (badges clicáveis que togglin séries)
- **Animação de entrada**: linhas desenhando-se progressivamente (Recharts supports `isAnimationActive`)
- **Grid**: apenas linhas horizontais, `stroke: --border-subtle`, sem eixo Y visível
- **Eixo X**: `caption` (12px), `text-muted`
- **Linhas**:
  - Sucesso: `--accent-gradient-start` (azul marca) com `strokeWidth: 2.5`
  - Pendente: `--warning` com `strokeWidth: 2`, `strokeDasharray: "5 5"`
  - Falha: `--danger` com `strokeWidth: 2`
- **Preenchimento**: gradiente de baixo para cima (accent → transparente) com opacidade 10%
- **Hover**: dot no ponto com `stroke: --bg-primary`, `strokeWidth: 3`, `r: 5`
- **Container**: fundo transparente (sem card branco), padding 20px

#### OptimizationDonut (Gráfico de Rosca)

**Mudanças necessárias:**
- Aumentar tamanho: `w-48 h-48` (192px)
- Centro do donut: mostrar a métrica mais relevante (ex: "78% Sucesso") com `display` (30px, peso 700)
- **Legenda**: horizontal abaixo do gráfico, com dots coloridos + label + valor
- **Cores**: usar variáveis CSS do sistema de cores de status
- **Animação**: progresso desenhando-se de 0% ao valor final
- **Hover**: slice com scale 1.05, others com opacity 0.6

#### Novo: Mini Sparkline (Card Hero)

- Gráfico de área mini (120x40px)
- Sem eixos, sem grid, sem tooltip
- Apenas a linha com gradiente preenchido
- `strokeWidth: 1.5`, `dot: false`
- Cor: gradiente da marca

### 5.3 Tabela de Transações

#### Conceito

Tabela profissional inspirada no Stripe Dashboard — com density calibrada, status badges claros, e recursos de escaneabilidade.

#### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  Transações Recentes                              [Ver todas →] │
├──────────────────────────────────────────────────────────────────┤
│  ID          │ Cliente     │ Valor      │ Status    │ Data      │
├──────────────────────────────────────────────────────────────────┤
│  TXN-2847    │ João Silva  │ 15.000 AOA │ ● Concluída│ 14 Jul   │
│  TXN-2846    │ Maria Ana   │ 8.500 AOA  │ ○ Pendente │ 14 Jul   │
│  TXN-2845    │ Pedro Santos│ 42.000 AOA │ ● Concluída│ 13 Jul   │
│  TXN-2844    │ Ana Costa   │ 3.200 AOA  │ ✕ Falhou   │ 13 Jul   │
├──────────────────────────────────────────────────────────────────┤
│  Mostrando 1-10 de 1.245          [< 1 2 3 ... 125 >]         │
└──────────────────────────────────────────────────────────────────┘
```

#### Estilo

- **Container**: Sem card wrapper — tabela flutua sobre `--bg-primary` com `border-top: 1px solid --border-subtle`
- **Header da tabela**:
  - Background: `--bg-secondary`
  - Texto: `caption` (12px, peso 600, `text-muted`, uppercase, `letter-spacing: 0.05em`)
  - Border-bottom: `2px solid --border-default`
  - Padding: `12px 16px`
- **Rows**:
  - Padding: `14px 16px`
  - Border-bottom: `1px solid --border-subtle`
  - Hover: `background: --bg-secondary` com transição 150ms
  - Transição: `background-color 150ms ease`
- **Células**:
  - ID: `mono` (13px, peso 500, `text-secondary`)
  - Cliente: `body` (14px, peso 500, `text-primary`)
  - Valor: `mono` (14px, peso 600, `text-primary`, `tnum`)
  - Data: `caption` (12px, `text-muted`)
- **Status Badge**:
  - Formato: dot colorido + texto
  - Concluída: dot `--success`, bg `--success-subtle`, text `--success`
  - Pendente: dot `--warning`, bg `--warning-subtle`, text `--warning`
  - Falhou: dot `--danger`, bg `--danger-subtle`, text `--danger`
  - Estilo: `border-radius: --radius-full`, padding `4px 10px`, `caption` (12px, peso 500)
- **Paginação**:
  - Botões: `ghost` variant, `--radius-sm`
  - Página ativa: `bg-accent-primary text-inverse`
  - Informação: `caption`, `text-muted`

### 5.4 Sidebar — Itens de Menu

#### Estado Default
```
padding: 10px 12px
border-radius: 8px
color: --text-secondary
background: transparent
icon: 18px, --text-secondary
gap: 10px
transition: all 150ms ease
```

#### Estado Hover
```
background: --accent-primary-subtle
color: --accent-primary
icon: --accent-primary
```

#### Estado Ativo
```
background: --accent-primary-subtle
color: --accent-primary
font-weight: 500
border-left: 2px solid --accent-primary (alternativa: sem borda, apenas bg)
icon: --accent-primary, peso 600
```

### 5.5 Botões — Sistema de 4 Variantes

O sistema de botões atual é básico. O redesign introduz uma hierarquia clara de ações com **geometria afiada** e **transições precisas**.

#### Variante Primária (Filled)
```
background: --accent-primary
color: --text-inverse
padding: 7px 14px           /* Ligeiramente mais compacto que o atual */
border-radius: --radius-md (6px)
font-family: Satoshi
font-size: 13px, peso 500
letter-spacing: 0.01em
shadow: none
hover: --accent-primary-hover, shadow-sm (elevação sutil)
active: scale(0.98) + shadow-inset
focus: focus-ring (2px primary)
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1)
```

#### Variante Secundária (Outline)
```
background: transparent
border: 1px solid --border-default
color: --text-primary
padding: 7px 14px
border-radius: --radius-md (6px)
font-family: Satoshi, 13px, peso 500
hover: --bg-secondary, border --border-strong
active: scale(0.98), bg --bg-tertiary
focus: focus-ring
transition: all 150ms ease
```

#### Variante Ghost
```
background: transparent
border: none
color: --text-secondary
padding: 6px 10px
border-radius: --radius-sm (4px)  /* Mais afiado que os outros */
font-family: Satoshi, 13px, peso 500
hover: --bg-secondary, --text-primary
active: --bg-tertiary
transition: all 120ms ease  /* Mais rápido que os outros */
```

#### Variante Danger
```
background: --danger
color: white
padding: 7px 14px
border-radius: --radius-md (6px)
font-family: Satoshi, 13px, peso 500
hover: opacity(0.9), shadow-sm
active: scale(0.98)
focus: focus-ring (2px danger)
transition: all 150ms ease
```

#### Sizes
```
sm:  padding: 4px 8px,   font-size: 12px, height: 28px
md:  padding: 7px 14px,  font-size: 13px, height: 34px  (default)
lg:  padding: 9px 18px,  font-size: 14px, height: 40px
icon: padding: 7px,       width: 34px, height: 34px
```

#### Regras de Botões
- **Uma única Primary por seção** — nunca dois botões filled competindo no mesmo viewport
- **Primary para ação principal**, Secondary para ação secundária, Ghost para ações de navigation
- **Danger sempre isolada** — nunca ao lado de um botão Primary no mesmo grupo
- **Loading state**: substituir texto por spinner mantendo o tamanho do botão, adicionar `opacity: 0.7`
- **Disabled state**: `opacity: 0.4`, `cursor: not-allowed`, sem transição

### 5.6 Inputs — Geometria Precision

Inputs com **border-radius mínimo** (4px) para transmeter precisão — inspiração: Stripe Dashboard inputs.

```
height: 34px
padding: 0 12px
border: 1px solid --border-default
border-radius: --radius-sm (4px)       /* Afiado, não arredondado */
background: --bg-primary
font-family: Satoshi, 14px, peso 400
color: --text-primary
box-shadow: none

/* Hover */
hover: border-color --border-strong

/* Focus */
focus: border-color --accent-primary, box-shadow focus-ring

/* Error */
error: border-color --danger, box-shadow 0 0 0 2px var(--danger-subtle)

/* Disabled */
disabled: opacity 0.5, cursor not-allowed, bg --bg-secondary

/* Placeholder */
placeholder: --text-muted

/* Transição */
transition: border-color 150ms ease, box-shadow 150ms ease
```

#### Variações

| Tipo | Ajuste |
|------|--------|
| **Search** | Ícone de busca à esquerda (16px, --text-muted), padding-left: 36px |
| **Select** | Ícone chevron à direita, padding-right: 32px |
| **Number/Money** | font-family: var(--font-mono), font-feature-settings: "tnum", text-align: right |
| **Password** | Botão toggle visibilidade à direita (eye/eye-off icon) |
| **Textarea** | height: auto, min-height: 80px, padding: 10px 12px, resize: vertical |
| **With error** | Mensagem de erro abaixo: Satoshi 12px, peso 500, cor --danger, margin-top: 4px |
| **With hint** | Texto de ajuda abaixo: Satoshi 12px, peso 400, cor --text-muted, margin-top: 4px |

### 5.7 Badges de Status

```
Concluída:
  background: --success-subtle
  color: --success
  dot: --success (animated pulse em "processando")

Pendente:
  background: --warning-subtle
  color: --warning
  dot: --warning

Falhou:
  background: --danger-subtle
  color: --danger
  dot: --danger

Reembolsado:
  background: --info-subtle
  color: --info
  dot: --info

Estilo base:
  border-radius: --radius-full
  padding: 3px 10px
  font-size: 12px, peso 500
  display: inline-flex, align-items: center, gap: 6px
  dot: width 6px, height 6px, border-radius 50%
```

### 5.8 Cards de Configurações e Containers

#### Card Base (genérico)
```
background: --bg-primary
border: 1px solid --border-subtle
border-radius: --radius-lg (8px)      /* Afiado, não 12-16px */
padding: 20px
box-shadow: shadow-xs (nível 1)

/* Hover (opcional — apenas cards clicáveis) */
hover: box-shadow: shadow-sm, translateY(-1px), border-color: --border-default
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
```

#### Card Header (dentro do card)
```
padding-bottom: 16px
border-bottom: 1px solid --border-subtle
margin-bottom: 16px
title: h3 (Satoshi 14px, peso 700, --text-primary)
subtitle: body-sm (Satoshi 13px, peso 400, --text-muted)
```

#### Card Hero (Dashboard principal)
```
background: linear-gradient(135deg, --accent-primary-subtle 0%, transparent 60%)
border: 1px solid --border-default
border-radius: --radius-xl (12px)     /* Único card com radius maior */
padding: 24px
box-shadow: shadow-xs

/* Sem hover elevation — o gradiente já dá destaque */
```

#### Card Secundário (Métricas)
```
background: --bg-secondary
border: 1px solid --border-subtle
border-radius: --radius-lg (8px)
padding: 16px
box-shadow: none (flat)

/* Hover */
hover: box-shadow: shadow-xs, border-color: --border-default
```

### 5.9 Notificações (Dropdown)

- **Container**: `--bg-elevated`, `border: 1px solid --border-default`, `shadow-xl`, `border-radius: --radius-lg`
- **Header**: "Notificações" em `h3`, botão "Marcar todas como lidas" em `ghost` sm
- **Item não lido**: `background: --accent-primary-subtle`, dot `--accent-primary`
- **Item lido**: `background: transparent`, dot `--border-default`
- **Animação**: `dropdown-enter` ao abrir
- **Max-height**: 400px com `overflow-y: auto`
- **Item hover**: `--bg-secondary`
- **Timestamp**: `caption`, `text-muted`, "há 5 minutos", "ontem", etc.

---

## 6. Páginas Específicas

### 6.1 Dashboard Principal (`/dashboard`)

#### Estrutura

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard Geral                                            │
│  Visão geral das suas transações e performance              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────┐ ┌──────────┐ ┌───────┐ │
│  │  TOTAL DE TRANSAÇÕES           │ │ PENDENTES│ │FALHAS │ │
│  │  1.245.890 AOA                 │ │   127    │ │  23   │ │
│  │  ▲ 15.3% vs mês anterior       │ │  ▲ 12%  │ │ ▼ 5%  │ │
│  │  [sparkline ~~~~~/\~~~~]       │ │         │ │       │ │
│  └────────────────────────────────┘ └──────────┘ └───────┘ │
│                                                             │
│  ┌──────────┐ ┌──────────┐                                  │
│  │RECEITA   │ │MAIOR TX  │                                  │
│  │892K AOA  │ │45K AOA   │                                  │
│  │ ▲ 8.2%   │ │ ▲ 23%    │                                  │
│  └──────────┘ └──────────┘                                  │
│                                                             │
│  ┌─────────────────────────────┐ ┌────────────────────────┐ │
│  │  Tendências (7 dias)        │ │  Transações por Status │ │
│  │  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐  │ │                        │ │
│  │  │ 📈 Area chart animado │  │ │  🍩 Donut animado      │ │
│  │  │ com gradiente marca   │  │ │  com legenda           │ │
│  │  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘  │ │                        │ │
│  │  Legendas: ● Sucesso        │ │  ● Concluídas  78%     │ │
│  │            ● Pendente       │ │  ● Pendentes   16%     │ │
│  │            ● Falha          │ │  ● Falhas       6%     │ │
│  └─────────────────────────────┘ └────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Transações Recentes                        [Ver todas] ││
│  │  ─────────────────────────────────────────────────────── ││
│  │  ID       │ Cliente    │ Valor      │ Status │ Data     ││
│  │  TXN-2847 │ João       │ 15.000 AOA │ ● Ok   │ 14 Jul  ││
│  │  TXN-2846 │ Maria      │ 8.500 AOA  │ ○ Pend │ 14 Jul  ││
│  │  ...                                                   ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Página de Transações (`/dashboard/transactions`)

- Grid de métricas: 5 cards em linha (total, pendentes, falhas, concluídas, receita)
- **Filtros**: toolbar horizontal com date range picker, status filter, search input
- **Tabela**: tabela completa com sorting, paginação, e details modal
- **Nova Referência**: botão CTA primário no canto superior direito

### 6.3 Página de Configurações (`/dashboard/settings`)

- **Tabs**: horizontal, estilo pill/segmented control
  - Conta | Segurança | Notificações | Pagamento | Membros
  - Tab ativa: `bg-accent-primary text-inverse`
  - Tab inativa: `ghost`
- **Cards de seção**: um card por configuração, com header e conteúdo

---

## 7. Implementação Técnica

### 7.1 Variáveis CSS (`globals.css`)

Substituir todas as variáveis CSS existentes pelas novas variáveis definidas na Seção 3.1. Mudanças específicas:

```css
/* ═══════════════════════════════════════════════════════════
   NOVO: Font loading via CSS variables
   ═══════════════════════════════════════════════════════════ */
@import "tailwindcss";

@theme {
  --font-display: var(--font-clash-display), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-satoshi), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

/* ═══════════════════════════════════════════════════════════
   NOVO: Scrollbar customizada — dark-mode-aware
   ═══════════════════════════════════════════════════════════ */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border-default);
  border-radius: var(--radius-full);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--border-strong);
}
* {
  scrollbar-width: thin;
  scrollbar-color: var(--border-default) transparent;
}

/* ═══════════════════════════════════════════════════════════
   NOVO: Focus ring global
   ═══════════════════════════════════════════════════════════ */
:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* ═══════════════════════════════════════════════════════════
   NOVO: Smooth scrolling
   ═══════════════════════════════════════════════════════════ */
html {
  scroll-behavior: smooth;
}

/* ═══════════════════════════════════════════════════════════
   NOVO: Tabular figures para todo conteúdo numérico
   ═══════════════════════════════════════════════════════════ */
[data-tabular], .tabular-nums {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}

/* ═══════════════════════════════════════════════════════════
   NOVO: Selection color
   ═══════════════════════════════════════════════════════════ */
::selection {
  background-color: var(--accent-primary);
  color: var(--text-inverse);
}
```

### 7.2 Font Loading (`layout.tsx`)

### 7.2 Font Loading (`layout.tsx`)

```tsx
// src/app/layout.tsx
import { Clash_Display, Satoshi } from 'next/font/fontshare';
import { Geist_Mono } from 'next/font/google';

const clashDisplay = Clash_Display({
  subsets: ['latin'],
  variable: '--font-clash-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const satoshi = Satoshi({
  subsets: ['latin'],
  variable: '--font-satoshi',
  display: 'swap',
  weight: ['400', '500', '700', '900'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt"
      className={`${clashDisplay.variable} ${satoshi.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-[family-name:var(--font-satoshi)] antialiased"
        style={{ fontFeatureSettings: '"cv01", "cv02"' }}  /* Humanist alternates do Satoshi */
      >
        {children}
      </body>
    </html>
  );
}
```

### 7.3 Componentes a Modificar

| Componente | Mudança Principal | Prioridade |
|-----------|-------------------|-----------|
| `src/app/globals.css` | Novo sistema de cores, variáveis CSS, scrollbar customizada, focus ring, skeleton animation | Alta |
| `src/app/layout.tsx` | Font loading com Fontshare (Clash Display + Satoshi + Geist Mono) | Alta |
| `src/components/layouts/admin/Sidebar.tsx` | Reescrever com novo layout, seções, footer com status, geometria afiada (radius 0) | Alta |
| `src/components/layouts/admin/Header.tsx` | Nova barra de contexto com busca, breadcrumbs, actions | Alta |
| `src/components/dashboard/CardStat.tsx` | Novo design: hero variant, sparkline, delta colors, radius 8px | Alta |
| `src/components/dashboard/TrendsChart.tsx` | AreaChart com gradiente, tooltip premium, animação | Alta |
| `src/components/dashboard/OptimizationDonut.tsx` | Tamanho maior (192px), animação, legenda horizontal | Alta |
| `src/components/dashboard/TransactionsTable.tsx` | Nova tabela profissional com status badges, sem hardcoded colors | Alta |
| `src/app/(private)/dashboard/page.tsx` | Novo layout bento grid com hierarchy, Framer Motion stagger | Alta |
| `src/components/transactions/TransactionTable.tsx` | Remover hardcoded dark mode, usar variáveis CSS | Média |
| `src/components/transactions/TransactionFilter.tsx` | Remover hardcoded dark mode, usar variáveis CSS | Média |
| `src/components/transactions/TransactionForm.tsx` | Remover hardcoded dark mode, inputs com 4px radius | Média |
| `src/components/settings/SettingsHeader.tsx` | Adicionar suporte dark mode, usar Clash Display | Média |
| `src/components/settings/SettingsTabs.tsx` | Novo estilo pill/segmented control | Média |
| `src/components/ui/button.tsx` | 4 variantes com geometria afiada (6px radius), loading states | Alta |
| `src/components/ui/card.tsx` | 3 níveis de elevação, radius 8px, border sutil | Alta |
| `src/components/ui/badge.tsx` | Novos variants de status com dots, radius-full | Média |
| `src/components/ui/input.tsx` | Geometria precision (4px radius), focus ring, error states | Alta |
| `src/components/ui/tabs.tsx` | Novo estilo segmented control | Média |
| `src/components/ui/dialog.tsx` | Radius 8px, shadow-lg, overlay 40% | Média |
| `src/components/ui/dropdown-menu.tsx` | Radius 6px, shadow-md, items compactos | Média |
| `src/components/notifications/NotificationDropdown.tsx` | Novo design premium com Framer Motion | Média |
| `src/components/theme-switcher.tsx` | Animação de rotação no toggle, Sonner integration | Baixa |
| `src/components/providers/protected-layout.tsx` | Skeleton loading em vez de spinner | Média |

### 7.4 Componentes a Criar

| Componente | Descrição | Biblioteca Base |
|-----------|-----------|----------------|
| `src/components/ui/skeleton.tsx` | Skeleton loading para cards e tabelas com shimmer animation | shadcn/ui CLI |
| `src/components/ui/command.tsx` | CmdK palette para busca global | cmdk |
| `src/components/ui/tooltip.tsx` | Tooltip com delay customizado | Radix UI |
| `src/components/ui/popover.tsx` | Popover para filtros e detalhes | Radix UI |
| `src/components/ui/progress-bar.tsx` | Barra de progresso para métricas | Custom (CSS + Framer Motion) |
| `src/components/dashboard/MiniSparkline.tsx` | Sparkline mini para card hero | Recharts (AreaChart mini) |
| `src/components/dashboard/MetricDelta.tsx` | Componente reutilizável para deltas (+/- valor + cor) | Custom |
| `src/components/dashboard/BentoGrid.tsx` | Layout bento grid responsivo 12-colunas | CSS Grid |
| `src/components/dashboard/StatusBadge.tsx` | Badge de status com dot animado | Custom (shadcn Badge base) |
| `src/components/layouts/admin/SidebarFooter.tsx` | Footer da sidebar com status do sistema | Custom |
| `src/components/layouts/admin/SearchPalette.tsx` | Wrapper do cmdk com dados do app | cmdk + React Query |
| `src/components/providers/inactivity-manager.tsx` | Logout por inatividade com UI de aviso | Custom + Framer Motion |

### 7.4 Bibliotecas Externas Recomendadas

#### Tier 1: Core (Instalar Obrigatoriamente)

| Biblioteca | npm | Finalidade | Por quê |
|-----------|-----|-----------|---------|
| **Tremor** | `@tremor/react` | KPI cards, metric displays, dashboard layouts | Construído especificamente para dashboards de dados. Inclui `Metric`, `BarList`, `AreaChart`, `DonutChart` com Tailwind nativo. Substitui muitos componentes customizados do dashboard |
| **cmdk** | `cmdk` | Command palette (CmdK) | Padrão de mercado para busca em dashboards (usado pelo Linear, Vercel, Raycast). Copie do shadcn/ui |
| **Sonner** | `sonner` | Toast notifications | Substitui react-toastify. Mais leve, animações melhores, suporte dark mode nativo, design premium |
| **Framer Motion** | `framer-motion` | Microinterações e animações | Stagger animations, page transitions, hover effects. Padrão da indústria para React animations |
| **Recharts** (manter) | `recharts` | Gráficos | Já está no projeto. Usar com configuração customizada para AreaChart com gradiente |

#### Tier 2: Componentes (Adicionar conforme necessidade)

| Biblioteca | npm | Finalidade | Caso de Uso |
|-----------|-----|-----------|------------|
| **shadcn/ui** (atualizar) | CLI `npx shadcn@latest add` | Componentes UI base | Já usado no projeto. Adicionar: `skeleton`, `command`, `separator`, `tooltip`, `popover` |
| **TanStack Table** | `@tanstack/react-table` | Tabelas com sorting/filtering/pagination | Para a tabela de transações com funcionalidade completa. Substitui a tabela manual atual |
| **React Aria** | `@react-aria/` | Accessibilidade avançada | Para components que precisam de AAA accessibility (date pickers, complex forms) |
| **Vaul** | `vaul` | Drawer/Sheet components | Sidebar mobile, painéis laterais. Melhor que o Sheet do Radix para este caso |
| **React Day Picker** | `react-day-picker` | Date range picker | Para os filtros de data nas transações. Já disponível via shadcn/ui |
| **Nivo** | `@nivo/` | Charts premium | Alternativa ao Recharts com animações mais suaves e visual mais polishado. Usar apenas se Recharts não suficiente |

#### Tier 3: Utilidades (Opcional)

| Biblioteca | npm | Finalidade |
|-----------|-----|-----------|
| **clsx** + **tailwind-merge** | `clsx` `tailwind-merge` | Utility para combinar classes Tailwind (já usado via `cn()` do shadcn) |
| **date-fns** (manter) | `date-fns` | Manipulação de datas |
| **Nookies** (manter) | `nookies` | Gerenciamento de cookies |
| **Zod** (manter) | `zod` | Schema validation |

#### O que NÃO adicionar

| Biblioteca | Razão |
|-----------|-------|
| **MUI / Ant Design** | Pesado demais (100-300KB), conflita com Tailwind, não encaixa no design system |
| **Chakra UI** | Conflita com shadcn/ui, peso desnecessário |
| **Styled Components / Emotion** | Conflita com Tailwind CSS, performance ruim |
| **Axios** (já tem) | Manter, mas considerar migrar para **ky** no futuro (mais leve, better TypeScript) |

#### Stack Final Recomendada

```
Framework:    Next.js 16 + React 19 + TypeScript 5
Styling:      Tailwind CSS v4 + shadcn/ui (Radix UI)
Fonts:        Clash Display (Fontshare) + Satoshi (Fontshare) + Geist Mono
Charts:       Recharts (com config customizada) ou Nivo (premium)
Tables:       TanStack Table v8
State:        Zustand (global) + Tanstack React Query (server)
Forms:        React Hook Form + Zod
Animation:    Framer Motion
Toasts:       Sonner
Search:       cmdk
HTTP:         Axios (com interceptors existentes)
Icons:        Lucide React (manter) + react-icons (manter para Fi*)
```

### 7.6 Exemplos de Integração das Bibliotecas

#### Tremor — KPI Cards e Metric Displays

```tsx
// Substituir o CardStat atual pelo Metric do Tremor
import { Metric, BadgeDelta, Card, AreaChart } from "@tremor/react";

// Card de métrica hero com sparkline integrado
<Card className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)]">
  <div className="flex items-center justify-between">
    <span className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">
      Total de Transações
    </span>
    <BadgeDelta deltaType="moderateIncrease" />
  </div>
  <Metric className="text-[var(--text-primary)] mt-2" style={{ fontFamily: 'var(--font-mono)' }}>
    1.245.890 AOA
  </Metric>
  <AreaChart
    data={sparklineData}
    categories={["value"]}
    colors={["indigo"]}
    className="h-16 mt-4"
    showXAxis={false}
    showYAxis={false}
    showGridLines={false}
    showLegend={false}
    showTooltip={false}
  />
</Card>
```

#### cmdk — Command Palette

```tsx
// src/components/ui/command.tsx
import { Command } from "cmdk";

// Atalho: Ctrl+K ou Cmd+K
<Command.Dialog open={open} onOpenChange={setOpen} label="Global Command">
  <Command.Input placeholder="Buscar transações, clientes, configurações..." />
  <Command.List>
    <Command.Empty>Nenhum resultado encontrado.</Command.Empty>
    <Command.Group heading="Transações">
      <Command.Item>Ver transações recentes</Command.Item>
      <Command.Item>Criar nova referência</Command.Item>
    </Command.Group>
    <Command.Group heading="Configurações">
      <Command.Item>Gerenciar chaves API</Command.Item>
      <Command.Item>Configurar webhooks</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

#### Sonner — Toast Notifications

```tsx
// Substituir react-toastify por Sonner
import { toast } from "sonner";

// Uso:
toast.success("Transação criada com sucesso");
toast.error("Erro ao processar pagamento");
toast.info("Nova notificação recebida");

// Configuração no layout:
import { Toaster } from "sonner";

<Toaster
  position="bottom-right"
  richColors
  closeButton
  theme="system"  // Auto-detecta light/dark
  toastOptions={{
    style: {
      fontFamily: 'var(--font-body)',
      borderRadius: 'var(--radius-md)',  // 6px — mais afiado
      border: '1px solid var(--border-default)',
    }
  }}
/>
```

#### TanStack Table — Tabela de Transações

```tsx
// Substituir a tabela manual por TanStack Table
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";

const columns = [
  { accessorKey: 'id', header: 'ID', cell: ({ row }) => (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
      {row.original.id}
    </span>
  )},
  { accessorKey: 'amount', header: 'Valor', cell: ({ row }) => (
    <span style={{ fontFamily: 'var(--font-mono)', fontFeatureSettings: '"tnum"' }}>
      {formatCurrency(row.original.amount)}
    </span>
  )},
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => (
    <StatusBadge status={row.original.status} />
  )},
  // ... mais colunas
];
```

#### Framer Motion — Stagger Animation para Dashboard

```tsx
// Dashboard page — cards entram com stagger
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const cardItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }
};

// Uso:
<motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-4 gap-4">
  {metrics.map((metric, i) => (
    <motion.div key={metric.id} variants={cardItem}>
      <MetricCard {...metric} />
    </motion.div>
  ))}
</motion.div>

// Page transition — ao navegar entre páginas
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>
  {children}
</motion.div>
```

```tsx
// Stagger animation para cards de métricas
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

// Page transition
const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 }
};
```

---

## 8. Responsividade

### Breakpoints

| Breakpoint | Largura | Layout |
|-----------|---------|--------|
| Mobile | < 640px | Sidebar oculta (sheet), cards stacked, tabela scroll horizontal |
| Tablet | 640px - 1023px | Sidebar colapsada (ícones), grid 2 colunas |
| Desktop | 1024px - 1279px | Sidebar completa, grid 3-4 colunas |
| Large | >= 1280px | Sidebar completa, grid 4 colunas, max-width 1200px |

### Comportamento

- **Sidebar mobile**: Abre como Sheet (slide-in) com overlay
- **Cards**: 1 coluna mobile → 2 colunas tablet → 4 colunas desktop
- **Tabela**: Horizontal scroll no mobile com `min-w-[600px]`
- **Header**: Breadcrumb + título em mobile, busca visível apenas em desktop
- **Bento grid**: Hero card full-width em mobile, 2 colunas em tablet

---

## 9. Acessibilidade

- **Contraste**: Todos os textos devem passar WCAG AA (4.5:1 para texto normal, 3:1 para texto grande)
- **Focus ring**: Visível em todos os elementos interativos (`focus-ring` definido na Seção 3.3)
- **ARIA labels**: Em todos os cards de métricas, botões de ação, e elementos de status
- **Keyboard navigation**: Tab order deve seguir a ordem visual lógica
- **Reduced motion**: Respeitar `@media (prefers-reduced-motion: reduce)` para desabilitar animações
- **Screen readers**: Status badges com `aria-label` descritivo (ex: "Status: Concluída")

---

## 10. Checklist de Implementação

### Fase 1: Fundação (Prioridade Alta)
- [ ] Atualizar `globals.css` com novo sistema de cores e variáveis CSS
- [ ] Criar componentes base: `Skeleton`, `MetricDelta`, `MiniSparkline`
- [ ] Atualizar `Button`, `Card`, `Badge`, `Input` com novos estilos
- [ ] Configurar Framer Motion

### Fase 2: Layout (Prioridade Alta)
- [ ] Redesenhar Sidebar com seções, footer, e identidade de marca
- [ ] Redesenhar Header com busca contextual
- [ ] Implementar skeleton loading no ProtectedLayout

### Fase 3: Dashboard (Prioridade Alta)
- [ ] Criar BentoGrid layout para cards de métricas
- [ ] Redesenhar CardStat com hero variant e sparkline
- [ ] Redesenhar TrendsChart com AreaChart e gradiente
- [ ] Redesenhar OptimizationDonut com animação
- [ ] Redesenhar TransactionsTable profissional

### Fase 4: Páginas (Prioridade Média)
- [ ] Atualizar página de transações
- [ ] Atualizar página de configurações
- [ ] Atualizar páginas de webhooks, API keys, clientes
- [ ] Corrigir dark mode em SettingsHeader

### Fase 5: Polish (Prioridade Média)
- [ ] Adicionar CmdK palette de busca
- [ ] Microinterações com Framer Motion (hover cards, page transitions)
- [ ] Scrollbar customizada dark-mode-aware
- [ ] Testar e ajustar responsividade
- [ ] Testar acessibilidade (contraste, keyboard, screen reader)

---

## 11. Referências Visuais

| Referência | URL | O que observar |
|-----------|-----|---------------|
| Stripe Dashboard | stripe.com/dashboard | Hierarquia de dados, event log, error breakdown, 4-6px radius |
| Stripe Design System | shadcn.io/design/stripe | Design tokens, elevation system, typography |
| Ramp Dashboard | ramp.com | Savings como métrica hero, hierarchy-driven (33% faster reviews) |
| Mercury | mercury.com | Minimal density, cash balance hero |
| Wise | wise.com | Pending transfers como hero, fee transparency |
| Linear | linear.app | Microinterações, dark mode premium, transições |
| Brex | brex.com | Finance operating system, 6-8px radius |
| Tremor | tremor.so | Dashboard components para KPI cards, charts |
| shadcn/ui Blocks | shadcn.io/blocks | Payment analytics block, dashboard components |
| MetricUI | metricui.com | Dashboard-specific KPI cards, charts, auto-layout |
| PayPilot (GitHub) | github.com/tobyemerald/paypilot | Fintech dashboard inspirado no Stripe |
| Orbix Studio (Muzli) | me.muz.li/orbix-studio | Banking dashboard, multi-currency cards |
| Fontshare | fontshare.com | Clash Display + Satoshi fonts |
| Vercel Geist | vercel.com/font | Geist Mono para dados financeiros |
| Font Pairings Fintech | fontalternatives.com/blog/font-pairings-saas-fintech | Pairing scores para fintech dashboards |

---

## 12. Métricas de Sucesso

Após a implementação, o redesign deve resultar em:

1. **Consistência visual**: 100% dos componentes usando variáveis CSS (zero cores hardcoded)
2. **Dark mode funcional**: Todas as páginas funcionando corretamente em ambos os temas
3. **Time to insight**: Usuário identifica a métrica mais importante em < 2 segundos
4. **Performance**: Nenhum impacto perceptível no Lighthouse score
5. **Acessibilidade**: WCAG 2.1 AA compliance em todas as páginas
6. **Responsividade**: Layout funcional em todas as breakpoints (375px - 1920px)

---

*Documento criado em Julho 2026 para o projeto Gpayment Front (`gpay_front`).*
*Referências: Stripe Design System, Ramp 2024 Redesign Data, Mercury Design, Wise Transparency Patterns, shadcn/ui, Linear, Brex Finance OS.*
