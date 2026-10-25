# Guia de design do Bella Cucina

As regras de design e UX que o projeto segue. Use este guia para criar ou revisar qualquer tela, e para decidir quando algo novo "está certo". Os valores vêm do código ([src/index.css](../src/index.css), [tailwind.config.js](../tailwind.config.js), [src/components/ui/button.tsx](../src/components/ui/button.tsx)).

**Direção visual: noite elegante.** Uma trattoria contemporânea à noite: fundo escuro e quente, comida como protagonista, dourado e vermelho-tomate como destaques. Escolhida a partir de referências do Land-book (Gusto Verde, Roma) porque funciona bem num cardápio lido no salão, com luz baixa.

---

## 1. Princípios

1. **A comida é a protagonista.** Fotos de pratos vêm antes de texto e de fotos de ambiente vazio.
2. **Informação prática primeiro.** Endereço, horário de hoje e como pedir aparecem logo no topo, não escondidos no rodapé.
3. **Uma ação principal por tela.** No site é *Reservar mesa*; no cardápio, *Adicionar ao pedido*; no carrinho, *Enviar pedido*.
4. **Honestidade.** Nada de avaliações inventadas, selos que prometem o que não aconteceu ("Recebido pela equipe" quando o pedido está pendente) ou "Pedido enviado" quando falhou.
5. **Celular primeiro.** O cliente usa o celular na mesa, muitas vezes com uma mão só. Tudo é desenhado primeiro para 390px.

---

## 2. Leis de UX aplicadas

Baseadas em *Laws of UX* (Jon Yablonski).

| Lei | O que diz | Onde aplicamos |
|-----|-----------|----------------|
| **Fitts** | Alvos grandes e próximos são mais rápidos e precisos | Botões com 44px de altura; barra de ações fixa no rodapé do celular; + e − do carrinho com 36px; X dos modais com 40px |
| **Jakob** | As pessoas esperam que o site funcione como os outros que já usam | Barra "Conta / Ver pedido" no padrão de apps de delivery; logo leva ao início; ícone de sacola para o pedido |
| **Hick** | Mais opções = decisão mais lenta | Cabeçalho com 4 links (antes 5, com "Início" duplicado); home 37% mais curta; seções "Sobre" e "Contato" fundidas no *Visite-nos* |
| **Von Restorff** | O que é diferente é lembrado | Um único botão vermelho por área (*Reservar mesa* no cabeçalho, *Ver cardápio* no hero) |
| **Pico-Fim** | A experiência é lembrada pelo pico e pelo final | Confirmação do pedido mostra mesa, itens, total, status real e a próxima ação ("Acompanhe em Minha conta") |
| **Estética-Usabilidade** | Interfaces bonitas parecem mais fáceis de usar | Tipografia e espaçamentos padronizados; fundos com ritmo (escuro, vinho, creme) |
| **Prägnanz** | Formas simples são entendidas mais rápido | 3 espaçamentos de letra em vez de 12; ícones simples (lucide) com traço único |
| **Proximidade** | Itens próximos parecem relacionados | Preço junto do nome do prato; alérgenos logo abaixo da descrição; horário e telefone juntos no menu do celular |
| **Doherty** | Respostas em menos de 400ms mantêm o fluxo | Toast imediato ao adicionar prato; barra do pedido atualiza na hora; conta da mesa em tempo real (Realtime) |
| **Tesler** | Toda complexidade tem um dono; que seja o sistema | A mesa vem do QR (o cliente não digita número); preço calculado pelo banco; token da mesa lembrado ao navegar |

---

## 3. Cores

As cores são variáveis CSS (`hsl`) em [src/index.css](../src/index.css), usadas pelo Tailwind (`bg-background`, `text-foreground`, `text-primary`…). **Não use hex soltos em componentes**: use os tokens, para que os temas de seção funcionem.

### Paleta base (escuro)

| Token | Hex | Uso |
|-------|-----|-----|
| `--background` | `#100c0a` | Fundo da página |
| `--foreground` | `#f5f1ea` | Texto principal |
| `--muted-foreground` | `#c0b6a5` | Texto secundário, descrições |
| `--primary` | `#e44d3a` | Vermelho-tomate: ação principal, preços em destaque |
| `--accent` | `#e7af5f` | Dourado: títulos pequenos de seção, ícones, "Cucina" no logo |
| `--border` | `#3c322a` | Divisórias |
| `--destructive` | — | Erros e remover itens |

### Climas de seção

Cada seção usa uma classe que **redefine os tokens localmente**. Os componentes dentro dela se adaptam sozinhos.

| Classe | Fundo | Texto | Quando usar |
|--------|-------|-------|-------------|
| *(padrão)* | `#100c0a` | `#f5f1ea` | Hero, destaques, reservas, Visite-nos |
| `.section-wine` | `#2e1519` | `#f5f1ea` | Uma seção de "calor" (experiências) |
| `.section-cream` | `#f3ede2` | `#211612` | Respiro claro (galeria, chef). No creme, o vermelho vira `#c1321f` e o dourado `#9e4f1a` para manter o contraste |
| `.grain` | — | — | Grão sutil para fundos grandes não ficarem chapados. Combine com qualquer clima |

**Ritmo da home:** escuro → creme → escuro → vinho → escuro → creme → escuro. Nunca coloque duas seções claras seguidas.

**Sobre fotos:** texto sobre foto sempre com degradê escuro por baixo (`from-black/80` ou mais) e cores fixas (`text-white`, `text-amber-200`), nunca tokens do tema, porque no creme eles ficariam escuros.

### Contraste (WCAG AA)

| Combinação | Contraste | Status |
|------------|-----------|--------|
| Texto principal / fundo escuro | 17,3:1 | ✅ |
| Texto secundário / fundo escuro | 9,7:1 | ✅ |
| Dourado / fundo escuro | 9,9:1 | ✅ |
| Texto / vinho | 15,1:1 | ✅ |
| Texto / creme | 15,2:1 | ✅ |
| Texto secundário / creme | 6,8:1 | ✅ |
| Vermelho / creme | 4,8:1 | ✅ |
| **Texto branco / botão vermelho** | **3,7:1** | ⚠️ **Abaixo de 4,5:1.** Pendência: escurecer o vermelho dos botões para ~`#c63f2d` |

Regra: texto normal ≥ 4,5:1; texto grande (≥ 24px, ou ≥ 18,5px em negrito) ≥ 3:1.

---

## 4. Tipografia

### Fontes

| Fonte | Papel | Classe | Pesos usados |
|-------|-------|--------|--------------|
| **Playfair Display** (serifa) | Títulos, preços, nome do restaurante | `font-display` | 400 (e itálico em "Cucina") |
| **Inter** (sem serifa) | Texto, botões, rótulos | padrão (`font-sans`) | 400, 500, 600, 700 |

As duas são **hospedadas no próprio projeto** pelo Fontsource (versões variáveis, só o alfabeto latino, ~86KB). Nada de Google Fonts, por performance e pela LGPD.

### Escala

| Uso | Classe | Tamanho |
|-----|--------|---------|
| Nome no hero | `text-[clamp(3.75rem,13vw,9rem)]` | 60–144px |
| Título de seção | `text-4xl` → `md:text-6xl` | 36–60px |
| Título de card / prato | `text-2xl` → `sm:text-3xl` | 24–30px |
| Texto de leitura | `text-base` | 16px |
| Texto de apoio | `text-sm` | 14px |
| Rótulos, selos, títulos pequenos | `text-xs` | **12px (mínimo)** |

### Regras

- **Nenhum texto abaixo de 12px.** Antes havia 87 textos entre 9 e 11px.
- **Maiúsculas só em textos curtos** (rótulos, títulos pequenos de seção, selos), sempre com espaçamento entre letras:
  - `tracking-[0.12em]` para rótulos e botões;
  - `tracking-[0.16em]` para títulos pequenos de seção.
  - Nenhum outro valor (antes eram 12 diferentes).
- **Títulos em caixa de frase:** "Ver cardápio", não "Ver Cardápio".
- **Altura de linha:** títulos `leading-tight` ou menor; texto de leitura `leading-relaxed` / `leading-7`.
- **Largura de leitura:** parágrafos com `max-w-xl` ou `max-w-2xl` (~60–75 caracteres por linha).

---

## 5. Espaçamento e layout

| Regra | Valor |
|-------|-------|
| Largura máxima do conteúdo | `max-w-screen-2xl` (1536px) |
| Margem lateral | 16px no celular, 24px no tablet, 32px no desktop (`px-4 sm:px-6 lg:px-8`) |
| Espaço vertical entre seções | 64px no celular, 96px no desktop (`py-16 md:py-24`) |
| Espaço interno de cards | 20px (`p-5`) → 24px (`sm:p-6`) |
| Raio dos cantos | Botões: totalmente arredondados. Cards e fotos: `rounded-2xl` (16px) a `rounded-[2rem]` (32px) |
| Grade de pratos | 1 coluna no celular, 2 no tablet, 3 no desktop |

**No celular:**
- A barra fixa "Conta / Ver pedido" ocupa o rodapé. Toda página tem um espaço extra no fim para nada ficar escondido atrás dela.
- Listas horizontais (experiências, categorias) usam rolagem com encaixe (`snap-x`) e deixam o próximo item aparecendo pela metade, para sinalizar que dá para deslizar.

---

## 6. Botões e alvos de toque

| Tamanho | Altura | Uso |
|---------|--------|-----|
| `default` | **44px** | Padrão para qualquer ação do cliente |
| `lg` | 48px | Ações principais no hero |
| `sm` | 36px | Só em listas densas (painéis da equipe, editar observação) |
| `icon` | 44×44px | Botões só com ícone |

| Variante | Visual | Uso |
|----------|--------|-----|
| `default` | Vermelho | **Uma** ação principal por área |
| `outline` | Contorno claro | Ação secundária ao lado da principal |
| `ghost` | Sem fundo | Ações terciárias (remover, editar) |

**Regras:**
- Todo botão tem foco visível no teclado (anel de 2px) e encolhe levemente ao toque (`active:scale-[0.98]`).
- Botão só com ícone precisa de `aria-label`.
- Navegação usa **link** (`<a>` / `<Link>`), ação usa **botão**. Nunca o contrário.
- Não sobrescreva altura nem cantos do `Button` nos componentes: ajuste o componente base.

---

## 7. Imagens

- **Comida antes de ambiente.** O hero usa um prato. Ambientes entram na galeria.
- **Tamanho certo para cada tela:** hero com 800×1200 no celular e 1920×1080 no desktop, ~300KB, via parâmetros do Unsplash (`w`, `h`, `fit=crop`, `auto=format`, `q=75`). Nunca imagens de vários MB.
- **Primeira imagem com prioridade** (`fetchpriority="high"`); as demais com `loading="lazy"`.
- **Sempre `width` e `height`**, para a página não "pular" enquanto carrega.
- **Texto alternativo descreve a foto de verdade** ("Terraço para jantar ao ar livre"). Fotos decorativas usam `alt=""`.
- Domínio de imagem é validado pelo `hostname` exato, nunca com `includes()` (apontado pelo CodeQL).

---

## 8. Movimento

- Entradas suaves: deslocamento de 16–28px, 0,5–0,8s, curva `[0.22, 1, 0.36, 1]`.
- Sempre respeite `prefers-reduced-motion` com `useReducedMotion()` do Framer Motion: sem animação para quem pediu menos movimento.
- O cabeçalho some ao rolar para baixo e volta ao rolar para cima. Nunca some com o menu aberto.

---

## 9. Navegação

- **O logo leva ao início**, sem link "Início" duplicado.
- **4 links mais 1 botão em destaque:** Cardápio, Experiências, Chef & cozinha, Visite-nos e **Reservar mesa**.
- **Mostra onde a pessoa está:** sublinhado dourado na seção visível e `aria-current`.
- **Troca de idioma (PT/EN/IT) sempre acessível**, com o nome completo do idioma para leitores de tela.
- **Seções têm `id` estável** (`galeria`, `esperienze`, `reservations`, `cucina`, `contact`) e `scroll-mt-*`, para o cabeçalho fixo não cobrir o título.

---

## 10. Textos (copy)

- **Português do Brasil.** Nada de "equipas" (pt-PT) ou "maridaje" (espanhol).
- **Direto e concreto:** "Peça direto do celular", e não "percorrer a Itália em pequenas porções de coragem".
- **Diga o que fazer em seguida.** Estados vazios e erros sempre trazem a próxima ação: "Seu pedido está vazio. Escolha um prato no cardápio e toque em Adicionar."
- **Status verdadeiro:** "Aguardando confirmação" enquanto o pedido está pendente.
- **Singular e plural corretos:** "1 item", "2 itens".
- **Preços sempre com `formatPrice()`** ([src/lib/format.ts](../src/lib/format.ts)): `R$ 52,00`. Nunca `toFixed(2)`.
- **Dados do restaurante** (endereço, horários, telefone, comodidades) vêm só de [src/data/restaurant.ts](../src/data/restaurant.ts).
- **Textos visíveis** vão em [src/i18n/translations.ts](../src/i18n/translations.ts), nos três idiomas.

---

## 11. Acessibilidade (checklist)

- [ ] Contraste AA (ver seção 3)
- [ ] Texto ≥ 12px; alvos de toque ≥ 44px (36px só em listas densas)
- [ ] Foco visível no teclado em links, botões e campos
- [ ] `aria-label` em botões só com ícone; `alt` correto em imagens
- [ ] Link para navegar, botão para agir
- [ ] Animações respeitam `prefers-reduced-motion`
- [ ] `lang` correto na página (atualizado ao trocar o idioma)

---

## Pendências conhecidas

| Item | Detalhe |
|------|---------|
| Contraste do botão vermelho | Branco sobre `#e44d3a` = 3,7:1. Escurecer o fundo dos botões para ~`#c63f2d` |
| Textos fixos em português | Alguns textos do carrinho e dos painéis ainda não estão em `translations.ts` |
| Nomes dos pratos em EN/IT | O seed repete o texto em português ([#5](https://github.com/devthomaseduardo/bella-cucina/issues/5)) |
| Dados reais do restaurante | Endereço, telefone e comodidades em `restaurant.ts` são fictícios |
