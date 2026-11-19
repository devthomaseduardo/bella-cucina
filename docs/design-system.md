# Guia de design do Bella Cucina

Este é o guia **específico** do projeto. As regras universais (leis de UX, contraste, tipografia, botões, imagens, movimento, copy, acessibilidade e **como não parecer feito por IA**) estão no modelo [templates/guia-de-design.md](templates/guia-de-design.md), e valem aqui também. O que está abaixo são as decisões do Bella Cucina e onde cada regra foi aplicada.

**Projeto:** Bella Cucina, trattoria contemporânea em São Paulo.
**Direção visual: noite elegante.** Fundo escuro e quente, comida como protagonista, dourado e vermelho-tomate como destaques. Funciona bem num cardápio lido no salão, com luz baixa.
**Referências:**
- [Gusto Verde](https://land-book.com/websites/88936-gusto-verde-a-minimalist-framer-template-for-restaurants): informação prática no hero e comodidades com ícones.
- [Roma](https://land-book.com/websites/88730-roma-hotel-and-restaurant-framer-website-template): serifa protagonista e fotos de ingrediente.
- Guia de imagem de hero do Squarespace: tamanhos por tela e uma ação principal clara.

**Público e contexto:** cliente sentado à mesa, no celular, com uma mão livre e luz baixa. Fora do restaurante: quem procura onde jantar ou quer reservar.
**Ação principal:** no site, **Reservar mesa**; no cardápio, **Adicionar ao pedido**; no carrinho, **Enviar pedido**.

---

## 1. Leis de UX no projeto

| Lei | Onde aplicamos |
|-----|----------------|
| **Fitts** | Botões de 44px; barra "Conta / Ver pedido" fixa no rodapé do celular; + e − do carrinho com 36px; X dos modais com 40px |
| **Jakob** | Barra de pedido no padrão de apps de delivery; ícone de sacola; logo leva ao início |
| **Hick** | Cabeçalho com 4 links; home 37% mais curta; "Sobre" e "Contato" fundidos no Visite-nos |
| **Von Restorff** | Um único botão vermelho por área (Reservar mesa no cabeçalho, Ver cardápio no hero) |
| **Pico-Fim** | Confirmação do pedido com mesa, itens, total, status real e próxima ação |
| **Estética-Usabilidade** | Tipografia e espaçamentos padronizados; fundos com ritmo (escuro, vinho, creme) |
| **Prägnanz** | 2 valores de espaçamento de letra (antes 12); ícones de uma só família (lucide) |
| **Proximidade** | Preço junto do nome do prato; alérgenos sob a descrição; horário e telefone juntos no menu do celular |
| **Doherty** | Toast imediato ao adicionar prato; conta da mesa em tempo real |
| **Tesler** | Mesa vem do QR; preço calculado pelo banco; token da mesa lembrado ao navegar |

---

## 2. Cores

Tokens em [src/index.css](../src/index.css).

| Token | Hex | Uso |
|-------|-----|-----|
| `--background` | `#100c0a` | Fundo |
| `--foreground` | `#f5f1ea` | Texto principal |
| `--muted-foreground` | `#c0b6a5` | Texto secundário |
| `--primary` | `#e44d3a` | Vermelho-tomate: ação principal |
| `--accent` | `#e7af5f` | Dourado: rótulos, ícones, "Cucina" no logo |
| `--border` | `#3c322a` | Divisórias |

### Climas de seção

| Classe | Fundo | Texto | Uso |
|--------|-------|-------|-----|
| *(padrão)* | `#100c0a` | `#f5f1ea` | Hero, destaques, reservas, Visite-nos |
| `.section-wine` | `#2e1519` | `#f5f1ea` | Experiências |
| `.section-cream` | `#f3ede2` | `#211612` | Galeria e chef. No creme, o vermelho vira `#c1321f` e o dourado `#9e4f1a` |
| `.grain` | — | — | Grão sutil em fundos grandes |

**Ritmo da home:** escuro → creme → escuro → vinho → escuro → creme → escuro. Nunca duas seções claras seguidas.

### Contraste medido

| Combinação | Contraste | Status |
|------------|-----------|--------|
| Texto / fundo escuro | 17,3:1 | ✅ |
| Texto secundário / fundo escuro | 9,7:1 | ✅ |
| Dourado / fundo escuro | 9,9:1 | ✅ |
| Texto / vinho | 15,1:1 | ✅ |
| Texto / creme | 15,2:1 | ✅ |
| Texto secundário / creme | 6,8:1 | ✅ |
| Vermelho / creme | 4,8:1 | ✅ |
| **Texto branco / botão vermelho** | **3,7:1** | ⚠️ Pendência |

---

## 3. Tipografia

| Papel | Fonte | Pesos |
|-------|-------|-------|
| Títulos, preços, logo | **Playfair Display** (`font-display`) | 400 e itálico |
| Texto e interface | **Inter** | 400, 500, 600, 700 |

Hospedadas pelo Fontsource ([src/main.tsx](../src/main.tsx)), só o subconjunto latino (~86KB).

| Uso | Classe |
|-----|--------|
| Logo no hero | `text-[clamp(3.75rem,13vw,9rem)]` |
| Título de seção | `text-4xl` → `md:text-6xl` |
| Título de prato | `text-2xl` → `sm:text-3xl` |
| Leitura | `text-base` |
| Apoio | `text-sm` |
| Rótulos e selos | `text-xs` (mínimo) |

Espaçamento de letra: `tracking-[0.12em]` (rótulos e botões) e `tracking-[0.16em]` (títulos pequenos de seção).

---

## 4. Espaçamento, layout e botões

| Regra | Valor |
|-------|-------|
| Largura máxima | `max-w-screen-2xl` (1536px) |
| Margem lateral | `px-4 sm:px-6 lg:px-8` |
| Entre seções | `py-16 md:py-24` |
| Cards | `p-5 sm:p-6`, cantos `rounded-2xl` a `rounded-[2rem]` |
| Botões | [src/components/ui/button.tsx](../src/components/ui/button.tsx): `default` 44px, `lg` 48px, `sm` 36px, `icon` 44×44px; todos arredondados |
| Barra do celular | Fixa no rodapé; `FloatingActions` reserva `h-24` no fim da página |

---

## 5. Navegação

[src/components/layout/StickySiteNav.tsx](../src/components/layout/StickySiteNav.tsx)

- **Links:** Cardápio (`/cardapio`), Experiências (`#esperienze`), Chef & cozinha (`#cucina`), Visite-nos (`#contact`).
- **Botão em destaque:** Reservar mesa (`#reservations`).
- **Idiomas:** PT · EN · IT.
- **Outras seções com `id`:** `galeria`.

---

## 6. Fontes de dados de texto

| O quê | Onde |
|-------|------|
| Textos da interface (PT/EN/IT) | [src/i18n/translations.ts](../src/i18n/translations.ts) |
| Endereço, horários, telefone, comodidades | [src/data/restaurant.ts](../src/data/restaurant.ts) |
| Cardápio | Supabase (`menu_items`), com fallback em [src/data/italian-menu.ts](../src/data/italian-menu.ts) |
| Preços | Sempre `formatPrice()` de [src/lib/format.ts](../src/lib/format.ts) |

---

## 7. Auditoria "não parecer IA"

Resultado do [teste rápido do modelo](templates/guia-de-design.md#11-como-não-parecer-feito-por-ia) aplicado ao site atual.

**O que já está certo**
- O hero usa um prato real com a informação prática junto, em vez do clássico título centralizado com dois botões.
- A home tem ritmo de fundos e textura (grão).
- Não há avaliações inventadas (foram removidas) nem emojis como ícones.
- Os ícones só aparecem para coisas concretas (Wi-Fi, valet, horário).

**O que ainda parece genérico**

| Problema | Onde | Correção |
|----------|------|----------|
| Rótulo em maiúsculas acima de **todo** título de seção | Galeria, experiências, chef, Visite-nos, reservas | Manter só no hero e em 1 seção; remover nas demais |
| Efeito de vidro (blur) em 18 lugares | Cabeçalho, cards, selos, barra do celular | Manter só na barra do celular e no cabeçalho sobre o hero |
| Numeração decorativa "01 · 02 · 03" | Cards de experiências, valores do chef | Remover; não há ordem real |
| Palavras-clichê | "jornada guiada", "curadoria da brigada", "experiência", "excepcional" | Trocar por fatos (ex.: "7 pratos servidos em sequência pela sommelier") |
| Fotos de banco de imagens | Todo o site | Substituir por fotos reais do restaurante, da equipe e dos pratos |
| Travessão no endereço | `restaurant.ts`: "Alameda Lorena, 1234 — Jardins" | Usar vírgula |
| Textos que serviriam a qualquer restaurante | "Uma casa, muitas mesas possíveis", "Quem cozinha para você" | Reescrever com nomes e fatos reais (nome do chef, ano de abertura, origem dos ingredientes) |

---

## Pendências

| Item | Detalhe |
|------|---------|
| Contraste do botão vermelho | Branco sobre `#e44d3a` = 3,7:1. Escurecer o fundo dos botões para ~`#c63f2d` |
| Auditoria "não parecer IA" | Itens da seção 7 |
| Textos fixos em português | Partes do carrinho e dos painéis ainda fora de `translations.ts` |
| Nomes dos pratos em EN/IT | O seed repete o português ([#5](https://github.com/devthomaseduardo/bella-cucina/issues/5)) |
| Dados reais | Endereço, telefone, comodidades e fotos ainda são fictícios ou de banco de imagens |
