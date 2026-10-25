# Arquitetura

## Visão geral

O Bella Cucina é uma **SPA React** servida como arquivos estáticos (Vercel) que conversa direto com o **Supabase**. Não há API intermediária: autenticação, autorização e regras de negócio sensíveis ficam no Postgres (RLS + funções `SECURITY DEFINER`).

```
┌─────────────┐      supabase-js        ┌──────────────────────────┐
│  React SPA  │ ──────────────────────► │ Supabase                 │
│  (Vercel)   │ ◄────── Realtime ────── │  Auth · Postgres · RLS   │
└─────────────┘                         └──────────────────────────┘
```

## Atores

| Ator | Como se autentica | O que pode fazer |
|------|-------------------|------------------|
| **Visitante** | Não autentica | Ver site e cardápio, criar reserva |
| **Cliente na mesa** | Login **anônimo** do Supabase, criado ao escanear o QR | Entrar na sessão da mesa, pedir e ver a conta *da própria sessão* |
| **Staff** | E-mail e senha | Ver e atualizar pedidos, sessões, reservas e cardápio |

> Só contas cadastradas em `staff_members` são staff, com papel `waiter`, `kitchen` ou `admin`.

## Conceitos de domínio

- **Mesa** (`restaurant_tables`): mesa física, com número e um `qr_token` secreto impresso no QR.
- **Sessão da mesa** (`table_sessions`): uma ocupação da mesa, do primeiro pedido até o fechamento. Só pode existir **uma sessão aberta por mesa**. Status: `open` → `payment_pending` → `closed`.
- **Convidado** (`table_guests`): uma pessoa dentro da sessão, ligada ao usuário anônimo daquele celular.
- **Pedido** (`orders`) e **itens** (`order_items`): cada item tem status próprio, para a cozinha andar prato a prato.

## Fluxo do cliente

1. O cliente abre `/cardapio?token=<qr_token>`.
2. Ao enviar o primeiro pedido, `ensureCustomerTableSession` ([src/lib/table-session.ts](../src/lib/table-session.ts)):
   - garante uma sessão **anônima** no Supabase (e desloga se houver sessão de staff no aparelho);
   - chama o RPC `join_table_session_by_token`, que encontra a mesa, abre a sessão se for preciso e registra o convidado;
   - guarda `{ sessionId, guestId, tableNumber }` no `localStorage`.
3. O carrinho ([src/components/cart/CartContext.tsx](../src/components/cart/CartContext.tsx)) chama o RPC `place_order` com o `slug` e a quantidade de cada prato. O banco busca os preços e calcula o total. O token do QR fica salvo na aba, então navegar pelo site não perde a mesa.
4. A **conta ao vivo** ([AccountModal](../src/components/cart/AccountModal.tsx)) assina via Realtime os pedidos da sessão.

Se a sessão salva no `localStorage` já estiver `closed`, ela é descartada e o cliente entra numa sessão nova. Assim, o próximo ocupante da mesa nunca vê a conta anterior.

## Fluxo da equipe

```
pedido criado ─► /garcom aprova ─► /cozinha prepara ─► pronto ─► /salao entrega ─► fecha sessão
   pending          preparing          preparing        ready       delivered        closed
```

Os três painéis usam o mesmo login ([src/components/waiter/Login.tsx](../src/components/waiter/Login.tsx)) e recebem as mudanças em tempo real (publicação `supabase_realtime` em `orders`, `order_items` e `table_sessions`).

## Modo demo

Sem `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, o app funciona só no navegador: carrinho e pedidos ficam no `localStorage`, para apresentações sem back-end. Os painéis de staff e a conta da mesa precisam do Supabase.

## Internacionalização

Implementação própria em [src/i18n](../src/i18n): `I18nProvider` + dicionário em `translations.ts` (pt, en, it). O idioma é escolhido em `/`. No banco, os textos do cardápio têm colunas `*_pt`, `*_en` e `*_it`.

## Limitações conhecidas (rumo ao MVP)

| Tema | Situação atual | Issue |
|------|----------------|-------|
| Nomes do cardápio em EN/IT | O seed repete o texto em português | [#5](https://github.com/devthomaseduardo/bella-cucina/issues/5) |
| Fechar a conta | Sem fluxo de "pedir a conta" | [#9](https://github.com/devthomaseduardo/bella-cucina/issues/9) |
