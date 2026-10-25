# Setup local completo

Para rodar QR, painéis e tempo real, você precisa de um projeto Supabase. Pode ser um projeto na nuvem (plano grátis) ou o Supabase local via CLI.

## Pré-requisitos

- Node.js 20+
- Conta no [Supabase](https://supabase.com), ou a [Supabase CLI](https://supabase.com/docs/guides/cli) com Docker

## 1. Banco

**Opção A: projeto na nuvem**

1. Crie um projeto no painel do Supabase.
2. No SQL Editor, rode os arquivos de `supabase/migrations/` **em ordem** (00001 → 00005).

**Opção B: Supabase local**

```bash
npx supabase init     # só na primeira vez, se não existir supabase/config.toml
npx supabase start
npx supabase db reset # aplica as migrations
```

> O `supabase/seed.sql` atual não bate com o schema e vai falhar ([#6](https://github.com/devthomaseduardo/bella-cucina/issues/6)). As migrations já criam 30 mesas de demo.

## 2. Autenticação

Em **Authentication → Providers**:

- Ative **Anonymous sign-ins**. Os clientes da mesa entram assim.
- Ative **Email**. A equipe entra assim.
- Desative "Allow new users to sign up". Com o modelo de staff atual, qualquer cadastro vira staff.

Crie o usuário da equipe em **Authentication → Users → Add user**.

## 3. Variáveis

```bash
cp .env.example .env
```

Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (em **Project Settings → API**).

## 4. Rodar

```bash
npm install
npm run dev
```

## 5. Testar o fluxo de ponta a ponta

1. Pegue o token de uma mesa:
   ```sql
   select number, qr_token from restaurant_tables order by number::int limit 3;
   ```
2. Numa aba anônima, abra `http://localhost:5173/cardapio?token=<qr_token>` e faça um pedido.
3. Em outra aba, abra `/garcom`, entre com o usuário da equipe e aprove o pedido.
4. Em `/cozinha`, marque os pratos como prontos. Em `/salao`, entregue e feche a mesa.
5. Volte à aba do cliente: a conta acompanha cada mudança em tempo real.
