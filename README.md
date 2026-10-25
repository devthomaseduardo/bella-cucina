# Bella Cucina

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![CD](https://github.com/devthomaseduardo/bella-cucina/actions/workflows/cd.yml/badge.svg)](https://github.com/devthomaseduardo/bella-cucina/actions/workflows/cd.yml)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)

**Cardápio digital com pedido pela mesa via QR code** para restaurantes. O cliente escaneia o QR da mesa, faz o pedido pelo celular e acompanha a conta em tempo real. A equipe acompanha tudo em painéis de garçom, cozinha e salão.

Interface em **português, inglês e italiano**. O restaurante de exemplo é italiano ("Bella Cucina").

> **Status:** em desenvolvimento rumo ao **MVP v1**. O escopo e o que falta estão no [milestone MVP v1](https://github.com/devthomaseduardo/bella-cucina/milestone/1).

---

## Como funciona, em 1 minuto

```
 Cliente (celular)                    Equipe (tablet/PC)
 ─────────────────                    ──────────────────
 1. Escaneia QR da mesa ──┐
 2. Informa o nome        │
 3. Monta o pedido        ├──► Supabase ◄──┬── /garcom   aprova pedidos
 4. Acompanha a conta     │   (Postgres +  ├── /cozinha  prepara pratos
    ao vivo               ┘    Realtime)   └── /salao    serve e fecha mesas
```

1. Cada mesa física tem um **QR code único** (`/cardapio?token=<qr_token>`).
2. Ao escanear, o cliente entra numa **sessão da mesa** (login anônimo). Várias pessoas podem entrar na mesma mesa, e cada uma tem os próprios itens.
3. Os pedidos chegam em **tempo real** para o garçom e a cozinha.
4. A cozinha marca os pratos como prontos, o salão entrega e, no fim, **fecha a sessão**. O próximo cliente da mesa começa uma conta nova.
5. Fora da mesa, o site também mostra a apresentação do restaurante e permite **reservas online**.

Detalhes em [docs/arquitetura.md](docs/arquitetura.md).

## Telas

| Rota | Quem usa | O que faz |
|------|----------|-----------|
| `/` | Cliente | Escolha de idioma |
| `/menu` | Cliente | Site do restaurante: destaques, galeria, chef, reservas, contato |
| `/cardapio` | Cliente | Cardápio completo, carrinho, pedido e conta da mesa |
| `/garcom` | Garçom | Lista e aprova pedidos, lê QR (login de staff) |
| `/cozinha` | Cozinha | Quadro de preparo por prato e convidado (login de staff) |
| `/salao` | Salão | Pratos prontos para servir e mesas abertas (login de staff) |
| `/admin` | Gerente | Visão geral dos pedidos |

## Stack

| Camada | Tecnologia |
|--------|------------|
| Front-end | React 18, TypeScript, React Router 6, Vite 5 |
| UI | Tailwind CSS, shadcn/ui (Radix), Framer Motion |
| Formulários | react-hook-form + Zod |
| Back-end | **Supabase**: Postgres, Auth (anônimo + e-mail), Realtime, RLS |
| QR | `qrcode.react` (gerar), `@zxing/browser` (ler) |
| Hospedagem | Vercel (SPA estática) |

Não existe servidor próprio. Toda a regra de acesso fica no banco, em **Row Level Security** e funções SQL. Veja [docs/banco-de-dados.md](docs/banco-de-dados.md).

## Rodando localmente

```bash
git clone https://github.com/devthomaseduardo/bella-cucina.git
cd bella-cucina
npm install
cp .env.example .env
npm run dev
```

Sem as variáveis do Supabase, o app sobe em **modo demo**: cardápio e carrinho funcionam, e os dados ficam só no navegador. Para usar o fluxo completo (QR, painéis, tempo real), siga [docs/setup-local.md](docs/setup-local.md).

| Comando | Efeito |
|---------|--------|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Typecheck + build em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos (`tsc`) |
| `npm test` | Testes (Vitest) |
| `npm run test:watch` | Testes em modo watch |
| `npm run types:supabase` | Regenera `src/types/supabase.ts` |

## Estrutura do projeto

```
src/
├── App.tsx               rotas
├── components/
│   ├── landing/          escolha de idioma (/)
│   ├── home/ layout/     site do restaurante (/menu)
│   ├── menu/             cardápio (/cardapio)
│   ├── cart/             carrinho, envio de pedido, conta da mesa
│   ├── reservation/      formulário de reserva
│   ├── waiter/           painel do garçom + login de staff + leitor de QR
│   ├── kitchen/          painel da cozinha
│   ├── salon/            painel do salão e mesas abertas
│   ├── admin/            visão geral de pedidos
│   └── ui/               componentes shadcn (não editar à mão)
├── data/                 cardápio estático (usado enquanto não vem do banco)
├── i18n/                 traduções PT/EN/IT
├── lib/
│   ├── supabase.ts       cliente Supabase
│   └── table-session.ts  entrada do cliente na sessão da mesa
└── types/                tipos do domínio e tipos gerados do Supabase

supabase/
├── migrations/           schema, RLS e funções (aplicar em ordem)
└── seed.sql              dados iniciais

docs/                     documentação técnica e de operação
```

## Documentação

| Documento | Para quem |
|-----------|-----------|
| [Arquitetura](docs/arquitetura.md) | Devs: visão geral, fluxos e decisões |
| [Banco de dados](docs/banco-de-dados.md) | Devs: tabelas, funções e regras de acesso |
| [Setup local](docs/setup-local.md) | Devs: subir o ambiente completo com Supabase |
| [Operação](docs/operacao.md) | Restaurante: como a equipe usa o sistema |
| [Deploy](docs/deploy.md) | Devs: publicar em produção |

## Licença

MIT © [Thomas Eduardo](https://thomaseduardo.com.br)
