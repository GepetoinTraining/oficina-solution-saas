# CONTEXTO DO PROJETO: Oficina Solution SaaS (para Gemini)

Este documento serve como um "arquivo de memória" para o agente de IA (Gemini) que colabora neste projeto. Ele resume nossa visão, arquitetura e decisões técnicas.

## 1. Visão do Produto

Estamos construindo um **SaaS (Software as a Service) B2B** focado em **marcenarias** no Brasil.

O objetivo é fornecer uma ferramenta de gestão ponta-a-ponta que cobre desde a captação do cliente até a gestão financeira e de produção da oficina. O sistema é modular, permitindo que o marceneiro adote apenas o pipeline de vendas ou o sistema completo.

### Conceitos Chave:
* **Pipeline de Vendas:** Gerenciamento de leads, orçamentos, e uma fase de negociação interativa onde o cliente pode comentar e solicitar alterações (Ideia 5).
* **Gestão de Produção:** Um pipeline Kanban para a oficina (`PRODUCTION_BACKLOG`, `CUTTING`, etc.) e um agendador (`Shopfloor Timetable`) que aloca projetos com base na capacidade de horas da oficina (Ideia 9).
* **"Project Wallet":** Cada projeto tem sua própria "carteira" que rastreia o fluxo de caixa (pagamentos a receber do cliente vs. despesas/custos do projeto).
* **Modularidade:** O sistema será vendido em tiers (vendas, projetos, sistema completo) com micro-sistemas (e-signing, marketplace) como add-ons (Ideia 13).
* **Templates:** Permitir que o marceneiro salve projetos comuns (designs) como templates para acelerar orçamentos futuros (Ideia 12).
* **Perfis:** Conectar `Clients` e `Architects` aos `Projects` (Ideia 4).
* **Inspiração:** A estrutura de pré-venda do projeto `menteaiberta-website` (especificamente os arquivos JSON de dados e fluxos como `MarcenariaPromptGenerator.jsx` e `BlueprintForm.jsx`) foi uma inspiração inicial para o formulário de primeira reunião e captação de dados do cliente.

---

## 2. Stack de Tecnologia (A "Go-To" Stack)

Nossa arquitetura é baseada em uma stack moderna TypeScript.

* **Framework:** **Next.js 14+** (App Router)
* **Deployment:** **Vercel**
* **Linguagem:** **TypeScript**
* **Banco de Dados:** **Neon** (Serverless Postgres)
* **ORM:** **Prisma** (a fonte da verdade é o `prisma/schema.prisma`)
* **UI:** **Mantine UI**
* **Autenticação:** **Auth.js (NextAuth)**
    * **Estratégia:** `CredentialsProvider` (Email/Senha).
    * **Hashing:** `bcryptjs` para `User.passwordHash`.
    * **Adapter:** `@auth/prisma-adapter` (conectado diretamente ao nosso modelo `User`).

---

## 3. Arquitetura do Site (Sitemap)

O projeto é dividido em três áreas principais usando **Route Groups** do App Router.

### 1. Site Público (Marketing)
* `/` (`src/app/page.tsx`): Home page com *scrolling* e CTAs. (placeholder page okay, will continue later)
* `/pricing` (`src/app/pricing/page.tsx`): Página de preços/planos.
* `/about` (`src/app/about/page.tsx`): Página "Sobre".

### 2. Autenticação (Layout Simples)
* `/auth/login` (`src/app/auth/login/page.tsx`): Formulário de login (Mantine + `signIn` do `next-auth`).
* `/auth/register` (`src/app/auth/register/page.tsx`): Formulário de registro (Mantine + `useFormState` + Server Action `registerUser`).
* `src/app/auth/actions.ts`: Server Actions para registro.
* `src/app/api/auth/[...nextauth]/route.ts`: Handler principal do Auth.js.

### 3. Aplicativo Protegido (Dashboard)
* **Layout:** `src/app/(app)/layout.tsx` (Contém a lógica de proteção de rota, o header com `ActionIcons` e o menu lateral colapsível).
* **`/dashboard`**: Visão geral, KPIs, alertas de capacidade (80%).
* **`/sales/**`**: Pipeline de vendas (Kanban).
* **`/projects/**`**: Pipeline de produção (Kanban) e o "Project Wallet".
* **`/finance/**`**: Fluxo de caixa geral, contas a pagar/receber.
* **`/contacts/**`**: Lista de `Client` e `Architect`.
* **`/catalog/**`**: Gestão de `Materials`, `Hardware`, `ProjectTemplate` e `MarketplaceItem`.
* **`/settings/**`**: Configurações da marcenaria, `Workers`, `Subscription`, etc.