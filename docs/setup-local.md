# Setup local completo

Para rodar QR, painéis e tempo real, você precisa de um projeto Supabase. Pode ser um projeto na nuvem (plano grátis) ou o Supabase local via CLI.

## Pré-requisitos

- Node.js 20+
- Conta no [Supabase](https://supabase.com), ou a [Supabase CLI](https://supabase.com/docs/guides/cli) com Docker

## 1. Subir o Supabase local

```bash
npm install
npm run db:start      # sobe Postgres, Auth, Realtime e aplica migrations + seed
```

A configuração está em [`supabase/config.toml`](../supabase/config.toml): login anônimo ligado (clientes da mesa) e login por e-mail (equipe).

O seed é gerado a partir de `src/data/italian-menu.ts`. Depois de mudar o cardápio estático, rode:

```bash
npm run db:seed:generate
npm run db:reset      # recria o banco com migrations + seed
```

## 2. Variáveis

Crie `.env.local` (já ignorado pelo git) com as chaves locais que o `db:start` imprime:

```bash
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<ANON_KEY>
```

## 3. Rodar

```bash
npm run dev
```

## 4. Contas da equipe (só no ambiente local)

| E-mail | Papel | Senha |
|--------|-------|-------|
| `admin@bellacucina.local` | admin | `bella123` |
| `garcom@bellacucina.local` | waiter | `bella123` |
| `cozinha@bellacucina.local` | kitchen | `bella123` |

Só contas listadas em `staff_members` têm acesso aos painéis. Quem se cadastrar sozinho não vê nada.

## 5. Testar o fluxo de ponta a ponta

1. Pegue o token de uma mesa:
   ```sql
   select number, qr_token from restaurant_tables order by number::int limit 3;
   ```
2. Numa aba anônima, abra `http://localhost:5173/cardapio?token=<qr_token>` e faça um pedido.
3. Em outra aba, abra `/garcom`, entre com o usuário da equipe e aprove o pedido.
4. Em `/cozinha`, marque os pratos como prontos. Em `/salao`, entregue e feche a mesa.
5. Volte à aba do cliente: a conta acompanha cada mudança em tempo real.
