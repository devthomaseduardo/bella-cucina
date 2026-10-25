# Guia de design: modelo

> **Como usar:** copie este arquivo para `docs/design-system.md` de qualquer projeto. Preencha os campos `[entre colchetes]`. As regras sem colchetes são universais e valem como estão. Apague esta nota depois.
>
> As regras partem de web/mobile com componentes. Os exemplos de classes usam Tailwind; em outra stack, mantenha a regra e troque a sintaxe.

**Projeto:** [nome]
**Direção visual:** [2–3 frases. Ex.: "Clínica acolhedora: fundo claro e quente, fotos reais da equipe, verde-sálvia como destaque."]
**Referências:** [links de 2–4 sites reais que inspiraram a direção e o que foi aproveitado de cada]
**Público e contexto de uso:** [quem usa, em que aparelho, em que situação. Ex.: "pacientes no celular, muitas vezes com pressa ou ansiosos"]
**Ação principal do produto:** [a única coisa que mais importa que o usuário faça. Ex.: "agendar consulta"]

---

## 1. Princípios

1. **[Conteúdo protagonista].** [O que o usuário veio ver, ex.: "a comida", "o imóvel", "o resultado"] aparece antes de texto institucional.
2. **Informação prática primeiro.** O que a pessoa precisa para agir (preço, horário, onde, como) fica no topo, não no rodapé.
3. **Uma ação principal por tela.** Um botão em destaque por área. O resto é secundário.
4. **Honestidade.** Nada de avaliações inventadas, contadores falsos, selos de "mais vendido" sem dado, ou mensagem de sucesso quando falhou.
5. **[Celular / desktop] primeiro.** Desenhe primeiro para [390px / 1440px] e expanda.

---

## 2. Leis de UX

Baseadas em *Laws of UX* (Jon Yablonski). Preencha a coluna "No projeto" com onde cada lei foi aplicada. Se ficar vazia, provavelmente há algo a melhorar.

| Lei | Regra prática | No projeto |
|-----|---------------|------------|
| **Fitts** | Alvos de toque ≥ 44px; ações frequentes perto do polegar (rodapé no celular) | [ ] |
| **Jakob** | Siga padrões que o usuário já conhece (logo leva ao início, carrinho no canto, busca com lupa) | [ ] |
| **Hick** | Menos opções por tela; navegação com 4–6 itens; corte seções que repetem conteúdo | [ ] |
| **Von Restorff** | Só um elemento "diferente" por área: o que você quer que seja clicado | [ ] |
| **Pico-Fim** | Capriche no momento de maior emoção e na tela final (confirmação, agradecimento) | [ ] |
| **Estética-Usabilidade** | Consistência visual faz o produto parecer mais fácil. Padronize antes de inventar | [ ] |
| **Prägnanz** | Formas e ícones simples; poucos valores de espaçamento, tamanho e cor | [ ] |
| **Proximidade** | Junte o que é relacionado (preço junto do nome; erro junto do campo) | [ ] |
| **Miller** | Agrupe informação em blocos de ~5–9 itens; não despeje listas longas | [ ] |
| **Doherty** | Responda em < 400ms; mostre feedback imediato (toast, estado de carregando) | [ ] |
| **Tesler** | Complexidade é do sistema, não do usuário (preencher automático, lembrar escolhas) | [ ] |
| **Efeito de posição serial** | O primeiro e o último itens de uma lista são os mais lembrados: coloque ali o mais importante | [ ] |

---

## 3. Cores

Defina as cores como **tokens** (variáveis CSS). Componentes usam só tokens, nunca hex soltos.

| Token | Hex | Uso |
|-------|-----|-----|
| `--background` | [ ] | Fundo |
| `--foreground` | [ ] | Texto principal |
| `--muted-foreground` | [ ] | Texto secundário |
| `--primary` | [ ] | Ação principal |
| `--accent` | [ ] | Detalhes, ícones, rótulos |
| `--border` | [ ] | Divisórias |
| `--destructive` | [ ] | Erro, remover |

**Regras universais:**
- **Contraste WCAG AA:** texto normal ≥ **4,5:1**; texto grande (≥ 24px, ou ≥ 18,5px em negrito) ≥ **3:1**; ícones e bordas de campos ≥ 3:1. **Meça**, não confie no olho. Registre a tabela de contraste abaixo.
- **Texto do botão principal sobre a cor primária também precisa de 4,5:1.** É o erro mais comum.
- Variações de seção (clara/escura) redefinem os tokens localmente; não duplique componentes por tema.
- Texto sobre foto: sempre degradê escuro por baixo e cores fixas.
- Cor nunca é a única forma de informar (erro também tem ícone e texto).

| Combinação | Contraste | Status |
|------------|-----------|--------|
| [texto / fundo] | [ ]:1 | [ ] |
| [texto do botão / primária] | [ ]:1 | [ ] |

---

## 4. Tipografia

| Papel | Fonte | Pesos |
|-------|-------|-------|
| Títulos | [ ] | [ ] |
| Texto e interface | [ ] | [ ] |

**Regras universais:**
- **No máximo 2 famílias** de fonte.
- **Hospede as fontes no próprio projeto** (ex.: Fontsource), só os subconjuntos e pesos usados. Evita bloquear a renderização e enviar o IP do usuário a terceiros (LGPD).
- **Nenhum texto abaixo de 12px.** Texto de leitura com 16px.
- **Maiúsculas só em textos curtos** (rótulos, selos), com espaçamento entre letras. Use **no máximo 2 valores** de espaçamento em todo o projeto.
- **Caixa de frase** em títulos e botões, no padrão do idioma (pt-BR: "Ver cardápio", não "Ver Cardápio").
- **Linha de leitura** com 60–75 caracteres (`max-w-xl` / `max-w-2xl`).
- Escala com poucos tamanhos (ex.: 12 · 14 · 16 · 24 · 36 · 60px). Se apareceu um tamanho novo, justifique.

---

## 5. Espaçamento e layout

| Regra | Valor |
|-------|-------|
| Largura máxima do conteúdo | [ex.: 1536px] |
| Margem lateral | [ex.: 16 / 24 / 32px] |
| Espaço entre seções | [ex.: 64px celular / 96px desktop] |
| Espaço interno de cards | [ex.: 20–24px] |
| Raio dos cantos | [ex.: botões totalmente arredondados; cards 16px] |

**Regras universais:**
- Use uma **escala de espaçamento** (múltiplos de 4 ou 8px) e nada fora dela.
- Elementos fixos na tela (barra inferior, botão flutuante) **reservam espaço** no fim da página para não cobrir conteúdo.
- Teste em 390px, 768px e 1440px. Nenhuma rolagem horizontal.

---

## 6. Botões e alvos de toque

| Tamanho | Altura | Uso |
|---------|--------|-----|
| padrão | 44px | Qualquer ação do usuário |
| grande | 48px | Ação principal em destaque |
| pequeno | 36px | Só em listas densas / painéis internos |
| ícone | 44×44px | Botão só com ícone |

**Regras universais:**
- **Um botão principal por área.** Os outros são contorno ou sem fundo.
- **Link para navegar, botão para agir.** Nunca um `div` clicável.
- Foco visível no teclado em tudo que é clicável.
- Botão só com ícone tem `aria-label`.
- Ajuste o componente base, não cada uso. Se você está sobrescrevendo altura/cantos em vários lugares, o padrão está errado.
- Texto do botão diz o resultado da ação ("Enviar pedido", "Agendar"), não "Clique aqui" / "OK".

---

## 7. Imagens

- **Fotos reais e específicas** do negócio sempre que possível (ver seção 11).
- **Tamanho certo para cada tela** (`srcset`/`<picture>`): ex.: hero 800×1200 no celular, 1920×1080 no desktop, algumas centenas de KB. Nunca arquivos de vários MB.
- Só a primeira imagem visível com prioridade (`fetchpriority="high"`); o resto com `loading="lazy"`.
- Sempre `width` e `height` para a página não "pular".
- `alt` descreve o que a foto mostra de verdade; foto decorativa tem `alt=""`.
- Valide domínios de imagem pelo `hostname` exato, nunca com `includes()`.

---

## 8. Movimento

- Animação só para orientar (algo entrou, mudou ou saiu), nunca decoração contínua.
- Curtas: 150–400ms em interações, até ~800ms em entradas de página.
- Respeite `prefers-reduced-motion`.
- Nada de parallax, contadores animados ou textos que "digitam" sem motivo.

---

## 9. Navegação

- Logo leva ao início (não repita um link "Início").
- 4–6 links + no máximo 1 botão em destaque.
- Mostre onde o usuário está (`aria-current` + marcação visual).
- Navegação por âncora (`#secao`) com `scroll-margin` para o cabeçalho fixo não cobrir o título.
- No celular: menu com os mesmos itens, a ação principal e uma informação prática (telefone, horário).

---

## 10. Textos (copy)

- **Idioma consistente** ([pt-BR]): sem mistura com pt-PT, espanhol ou inglês desnecessário.
- **Concreto > abstrato:** diga o que é, quanto custa, quanto demora, onde fica.
- **Toda tela vazia ou de erro diz a próxima ação.**
- **Status verdadeiro** (pendente ≠ confirmado).
- Singular/plural corretos ("1 item", "2 itens").
- Números, moedas e datas com formatador do idioma (`Intl`), nunca `toFixed`.
- Dados do negócio (endereço, horário, contato) em **um único arquivo** de dados.

---

## 11. Como não parecer feito por IA

Sites gerados por IA (ou por modelos genéricos) se parecem entre si. Estas regras existem para o projeto ter cara própria.

### Visual

| Evite | Faça |
|-------|------|
| Degradê roxo/azul, "neon", fundo com bolhas desfocadas | Paleta tirada do próprio negócio (fachada, produto, uniforme, embalagem) |
| Efeito de vidro (blur) em tudo | Blur só onde há conteúdo atrás que precisa ficar legível (barra fixa sobre foto) |
| Rótulo em maiúsculas pequeno ("eyebrow") acima de **todo** título | Use em 1–2 lugares onde ajuda; no resto, o título basta |
| Grade de 3 cards iguais com ícone + título + 2 linhas | Varie: lista, tabela, foto grande + texto, comparação, depoimento real |
| Numeração decorativa "01 · 02 · 03" | Numere só quando há ordem real (passos de um processo) |
| Cantos arredondados enormes em tudo, sombras gigantes difusas | Raio e sombra coerentes com a marca; algumas formas retas também |
| Ícones genéricos para conceitos abstratos ("qualidade", "inovação") | Fotos reais ou ícones só para coisas concretas (Wi-Fi, estacionamento) |
| Ilustrações 3D/isométricas genéricas, pessoas de banco de imagem sorrindo para a câmera | Fotos do lugar, da equipe e do produto reais; banco de imagens só como provisório |
| Hero centralizado com título enorme + subtítulo + 2 botões, sempre | Composição pensada para o conteúdo (foto protagonista, assimetria, informação prática) |
| Tudo simétrico e "perfeito" | Um pouco de assimetria, ritmo e textura (grão, papel, foto com luz real) |
| Emojis como ícones | Ícones de uma única família, com traço consistente |

### Textos

| Evite | Faça |
|-------|------|
| "Eleve sua experiência", "Descubra", "Desbloqueie", "Transforme", "Jornada", "Curadoria", "Inovador", "Excepcional", "Único", "De outro nível" | Fatos: "Massa feita todo dia às 10h", "Entrega em 30 min no bairro" |
| Títulos em trio com ritmo de slogan ("Rápido. Simples. Seguro.") | Uma frase que só este negócio poderia dizer |
| Travessões (—) em toda frase, listas de três adjetivos | Frases curtas e diretas, pontuação simples |
| "Bem-vindo ao nosso site", "Somos apaixonados por…" | Comece pelo que o visitante quer saber |
| Texto genérico que serviria para qualquer concorrente | Nomes, lugares, números, horários, pessoas reais |
| Depoimentos e avaliações inventados | Só dados reais, ou nenhum |
| Tom eufórico e exclamações | Tom de quem trabalha ali, falando com um cliente |

### Teste rápido

Antes de publicar uma tela, responda:

1. **Trocando o nome do negócio, a tela serviria para um concorrente?** Se sim, falta especificidade.
2. **Há alguma foto, nome, número ou detalhe que só existe neste negócio?** Precisa haver.
3. **Quantos efeitos visuais diferentes (blur, degradê, sombra, brilho) há na tela?** Mais de 2 é sinal de excesso.
4. **Algum texto usa palavras da lista "Evite"?** Reescreva com um fato.
5. **Se alguém disser "parece template", o que exatamente parece?** Corrija isso primeiro.

---

## 12. Acessibilidade (checklist)

- [ ] Contraste AA medido (seção 3), incluindo texto dos botões
- [ ] Texto ≥ 12px; leitura ≥ 16px; alvos ≥ 44px
- [ ] Foco visível em tudo que é clicável
- [ ] `aria-label` em botões só com ícone; `alt` correto
- [ ] Link para navegar, botão para agir
- [ ] `prefers-reduced-motion` respeitado
- [ ] `lang` correto na página
- [ ] Formulários com `label`, erro junto do campo e mensagem que explica como corrigir
- [ ] Navegável só pelo teclado, na ordem visual

---

## Pendências

| Item | Detalhe |
|------|---------|
| [ ] | [ ] |
