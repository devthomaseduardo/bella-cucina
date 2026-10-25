import type { SupportedLanguage } from "./types";

interface TranslationTree {
  [key: string]: string | TranslationTree;
}

const pt: TranslationTree = {
  languageSelect: {
    title: "Bem-vindo ao Bella Cucina",
    subtitle: "Escolha seu idioma para continuar até o cardápio.",
    cta: "Continuar para o cardápio",
    note: "O idioma escolhido fica guardado neste navegador. Para alterar, volte à página inicial.",
  },
  nav: {
    home: "Início",
    experiences: "Experiências",
    cucina: "Chef & cozinha",
    menu: "Cardápio",
    reservations: "Reservas",
    about: "Sobre",
    contact: "Contato",
    mobileMenuTitle: "Navegação",
    openMenu: "Abrir menu",
  },
  hero: {
    eyebrow: "São Paulo • Trattoria contemporânea • Forno a lenha",
    title: "Alma italiana, mesa brasileira",
    subtitle:
      "Do antipasto à sobremesa, cozinha italiana de verdade: produto honesto, forno a lenha e um serviço caloroso, sem pressa.",
    ctaMenu: "Ver cardápio",
    ctaReserve: "Reservar mesa",
  },
  featured: {
    title: "Assinaturas da casa",
    subtitle: "Pratos que traduzem viagens por Piemonte, Emília, Campânia e Lazio, sempre com temporada brasileira.",
    ctaFull: "Ver cardápio completo",
    orderNow: "Pedir agora",
  },
  gallery: {
    kicker: "Ambiente & oficina",
    caption: {
      "1": "Salão principal ao entardecer",
      "2": "Terraço para jantar ao ar livre",
      "3": "Linha quente, brasa e brassagem",
      "4": "Mesa posta para o ritual",
      "5": "Pratos al forno e guisados lentos",
      "6": "Serviço à francesa, menu degustação",
    },
  },
  experiences: {
    kicker: "Três maneiras de jantar",
    title: "Uma casa, muitas mesas possíveis",
    subtitle:
      "Inspiramo-nos em trattorias e enotecas italianas: carta viva, jornada guiada e o contraponto líquido do bar, sempre com curadoria da brigada.",
    cta: "Explorar o cardápio",
    cards: {
      carta: {
        title: "Carta tradizionale",
        body: "Antipasti, primi, secondi e dolci, DOP, IGP e produtores de confiança quando a estação brilha.",
      },
      degustacao: {
        title: "Menu degustação",
        body: "Sete momentos com narrativa à mesa; harmonização opcional escolhida pela nossa sommelier.",
      },
      aperitivo: {
        title: "Aperitivo & bar",
        body: "Spritz, Negroni, amari artesanais e taças de vinicultores familiares, o prelúdio perfeito.",
      },
    },
  },
  chef: {
    kicker: "Brigada & oficina",
    title: "Quem cozinha para você",
    p1: "A cozinha do Bella Cucina é conduzida por uma brigada formada entre técnica italiana, disciplina de serviço e repertório brasileiro à mesa.",
    p2: "Treinamos diariamente o paladar coletivo: provas cegas de azeite, fornadas de pizza al legna e mise en place que lembra uma orquestra, cada estação com o seu solo.",
    quote:
      "“Cozinhar é cuidar: do ingrediente, do tempo e de quem atravessa a nossa porta.”",
    quoteBy: "Brigada Bella Cucina",
    name: "Chefia da casa",
    role: "Chefia da casa",
    imageChefAlt: "Chefia da casa em serviço",
    imageKitchenAlt: "Cozinha aberta com equipes em serviço",
    imageBrigadeAlt: "Brigada em preparo coletivo",
    brigadeCaption: "Passagem, calor controlado e mãos que conhecem cada panela.",
    valuesTitle: "O que não negociamos",
    value1: "Forno a lenha para pizza e pães de fermentação longa.",
    value2: "Peixes inteiros e carnes maturadas com rastreabilidade.",
    value3: "Equipe treinada em hospitalidade italiana contemporânea.",
  },
  menu: {
    sectionTitle: "Carta completa",
    sectionDescription:
      "Mais de 20 pratos entre antipasti, massas frescas, pizzas de forno a lenha, carnes, sobremesas e bebidas. Peça direto do celular.",
    qrTitle: "Peça da sua mesa",
    qrDescription:
      "Aponte a câmera do celular para o QR code da mesa e faça o pedido sem esperar o garçom.",
    featuredTitle: "Destaques",
    searchPlaceholder: "Buscar no cardápio...",
    viewGrid: "Grade",
    viewList: "Lista",
    empty: "Nenhum prato encontrado. Tente outra palavra ou categoria.",
    addToOrder: "Adicionar ao pedido",
    detailsHint: "Ver detalhes",
    category: {
      all: "Todos",
      appetizers: "Entradas",
      "main-courses": "Pratos principais",
      pizza: "Pizzas",
      pasta: "Massas",
      sushi: "Sushi",
      sides: "Contorni",
      desserts: "Sobremesas",
      drinks: "Bebidas",
      sandwiches: "Focacce & panini",
      specials: "Degustações & teatro",
    },
  },
  reservation: {
    sectionTitle: "Faça sua Reserva",
    sectionDescription:
      "Reserve sua mesa online e desfrute de uma experiência gastronômica perfeita em nosso restaurante.",
    imageCaption: "Fine dining contemporâneo, com alma italiana.",
    step1: "1. Data & horário",
    step2: "2. Seus dados",
    step3: "3. Confirmação",
    step1Title: "Selecione data e horário",
    continue: "Continuar",
    back: "Voltar",
    step2Title: "Complete sua reserva",
    confirmTitle: "Reserva confirmada",
    confirmBodyPrefix: "sua reserva foi registrada.",
    confirmDetails: "Detalhes",
    people: "Pessoas",
    newReservation: "Fazer nova reserva",
    viewMenu: "Ver cardápio",
    experienceLine: "Experience authentic cuisine in an elegant setting",
  },
  about: {
    kicker: "Nossa essência",
    title: "Nossa História",
    quote:
      "“A elegância está nos detalhes: ingredientes impecáveis, tempo certo e calor humano.”",
    chef: "Brigada Bella Cucina",
    mosaicCaption: "Fine dining contemporâneo, com alma italiana.",
    p1: `Fundado em 2010 como um gesto de saudade italiana em solo paulistano, o Bella Cucina cresceu ao ritmo de feiras orgânicas, importadores boutique e fornecedores que viram amigos. Aqui, “fazer como na Itália” significa respeitar o produto, não copiar clichês.`,
    p2: `Da massa que desmancha ao dente ao último gole de amaro, buscamos a cadência das grandes casas: serviço atento sem pose, vinhos que conversam com o prato e uma cozinha aberta que convida ao olhar curioso.`,
    card1Title: "Ingredientes de Qualidade",
    card1Body:
      "Selecionamos produtores e fornecedores locais, priorizando frescor, sazonalidade e consistência, o sabor começa na origem.",
    card2Title: "Receitas Autênticas",
    card2Body:
      "Tradição italiana com refinamento moderno: técnicas clássicas, tempo de preparo respeitado e equilíbrio impecável.",
    card3Title: "Serviço Excepcional",
    card3Body:
      "Atendimento atento e discreto. Do primeiro sorriso ao último brinde, cada detalhe é pensado para encantar.",
  },
  contact: {
    kicker: "Atendimento",
    title: "Contato",
    intro:
      "Tem perguntas ou deseja enviar um feedback? Adoraríamos ouvir você.",
    formTitle: "Envie-nos uma Mensagem",
    formHint: "Responderemos o mais rápido possível.",
    name: "Nome",
    email: "Email",
    message: "Mensagem",
    send: "Enviar Mensagem",
    preferEmail: "Prefiro email",
    visitTitle: "Visite-nos",
    address: "Endereço",
    phone: "Telefone",
    hours: "Horário de Funcionamento",
    tip: "Dica: chegue 10 minutos antes do horário da reserva para uma recepção mais tranquila.",
  },
  addToCart: {
    successTitle: "Item adicionado!",
    successBody: "O item foi adicionado ao seu pedido.",
    title: "Adicionar ao pedido",
    tagFresh: "Feito na hora",
    tagIngredients: "Ingredientes selecionados",
    tagCustomizable: "Personalizável",
    quantity: "Quantidade",
    notes: "Observações",
    notesPlaceholder:
      "Alguma observação especial? (ex.: sem cebola, bem passado)",
    total: "Total:",
    cancel: "Cancelar",
    confirm: "Adicionar ao pedido",
  },
};

const en: TranslationTree = {
  languageSelect: {
    title: "Welcome to Bella Cucina",
    subtitle: "Choose your language to continue to the menu.",
    cta: "Continue to menu",
    note: "Your language is saved in this browser. To change it, return to the home page.",
  },
  nav: {
    home: "Home",
    experiences: "Experiences",
    cucina: "Chef & kitchen",
    menu: "Menu",
    reservations: "Reservations",
    about: "About",
    contact: "Contact",
    mobileMenuTitle: "Navigation",
    openMenu: "Open menu",
  },
  hero: {
    eyebrow: "São Paulo • Contemporary trattoria • Wood-fired oven",
    title: "Bella Cucina, Italian soul, Brazilian table",
    subtitle:
      "From the pass to dessert, we follow the rhythm of Italian houses: honest produce, human warmth, and a little tableside theatre, still elegant.",
    ctaMenu: "View Menu",
    ctaReserve: "Book a table",
  },
  featured: {
    title: "House signatures",
    subtitle: "Dishes that travel Piedmont, Emilia, Campania, and Lazio, always tuned to the Brazilian season.",
    ctaFull: "View full menu",
    orderNow: "Order now",
  },
  gallery: {
    kicker: "Room & workshop",
    caption: {
      "1": "Main dining room at dusk",
      "2": "Terrace for open-air dining",
      "3": "Hot line, embers and braises",
      "4": "Table set for the ritual",
      "5": "Wood-oven dishes & slow stews",
      "6": "French service, tasting menu",
    },
  },
  experiences: {
    kicker: "Three ways to dine",
    title: "One house, many tables",
    subtitle:
      "Inspired by Italian trattorias and wine bars: a living menu, a guided journey, and the liquid prelude at the bar, always curated by the brigade.",
    cta: "Browse the menu",
    cards: {
      carta: {
        title: "Traditional carte",
        body: "Antipasti, primi, secondi, and dolci, DOP, IGP, and trusted growers when the season shines.",
      },
      degustacao: {
        title: "Tasting menu",
        body: "Seven moments with tableside storytelling; optional pairing curated by our sommelier.",
      },
      aperitivo: {
        title: "Aperitivo & bar",
        body: "Spritz, Negroni, craft amari, and glasses from family growers, the perfect prelude.",
      },
    },
  },
  chef: {
    kicker: "Brigade & workshop",
    title: "Who cooks for you",
    p1: "Bella Cucina's kitchen is led by a brigade shaped by Italian technique, service discipline, and a Brazilian sense of hospitality at the table.",
    p2: "We train the collective palate daily: blind olive oil tastings, wood-fired pizza bakes, and mise en place that feels like an orchestra, each station with its solo.",
    quote: "“Cooking is care: for the ingredient, for time, and for everyone who walks through our door.”",
    quoteBy: "Bella Cucina brigade",
    name: "House chef team",
    role: "House chef team",
    imageChefAlt: "House chef team in service",
    imageKitchenAlt: "Open kitchen with the team at service",
    imageBrigadeAlt: "Brigade in collective prep",
    brigadeCaption: "Pass, controlled heat, and hands that know every pan.",
    valuesTitle: "What we never compromise",
    value1: "Wood-fired oven for pizza and long-fermentation breads.",
    value2: "Whole fish and dry-aged meats with traceability.",
    value3: "Team trained in contemporary Italian hospitality.",
  },
  menu: {
    sectionTitle: "Full menu",
    sectionDescription:
      "Over twenty creations across antipasti, primi, secondi, wood-fired pizze, dolci, and drinks, we invite you to travel Italy in small bites of courage.",
    qrTitle: "Order from your table",
    qrDescription:
      "Scan the QR code at your table to place your order directly from your phone",
    featuredTitle: "Featured items",
    searchPlaceholder: "Search the menu…",
    viewGrid: "Grid",
    viewList: "List",
    empty: "No items found. Try adjusting your filters.",
    addToOrder: "Add to order",
    detailsHint: "View details",
    category: {
      all: "All",
      appetizers: "Starters",
      "main-courses": "Mains",
      pizza: "Pizza",
      pasta: "Pasta",
      sushi: "Sushi",
      sides: "Sides",
      desserts: "Desserts",
      drinks: "Drinks",
      sandwiches: "Focaccia & panini",
      specials: "Tastings & theatre",
    },
  },
  reservation: {
    sectionTitle: "Make a reservation",
    sectionDescription:
      "Book your table online and enjoy a seamless dining experience.",
    imageCaption: "Contemporary fine dining with Italian soul.",
    step1: "1. Date & time",
    step2: "2. Your details",
    step3: "3. Confirmation",
    step1Title: "Select date & time",
    continue: "Continue",
    back: "Back",
    step2Title: "Complete your reservation",
    confirmTitle: "Reservation confirmed",
    confirmBodyPrefix: "your reservation has been recorded.",
    confirmDetails: "Details",
    people: "Guests",
    newReservation: "Make a new reservation",
    viewMenu: "View menu",
    experienceLine: "Experience authentic cuisine in an elegant setting",
  },
  about: {
    kicker: "Our essence",
    title: "Our story",
    quote:
      "“Elegance is in the details: impeccable ingredients, perfect timing, and human warmth.”",
    chef: "Bella Cucina brigade",
    mosaicCaption: "Contemporary fine dining with Italian soul.",
    p1: `Founded in 2010 as an Italian longing on São Paulo soil, Bella Cucina grew with organic markets, boutique importers, and suppliers who became friends. “Doing it like Italy” here means respecting the product, not copying clichés.`,
    p2: `From pasta that yields al dente to the last sip of amaro, we chase the cadence of great houses: attentive service without pretence, wines that talk to the plate, and an open kitchen that invites a curious gaze.`,
    card1Title: "Quality ingredients",
    card1Body:
      "We select local producers and suppliers, prioritizing freshness, seasonality, and consistency, flavor starts at the source.",
    card2Title: "Authentic recipes",
    card2Body:
      "Italian tradition with modern refinement: classical techniques, respected timing, and impeccable balance.",
    card3Title: "Exceptional service",
    card3Body:
      "Attentive, discreet hospitality. From the first smile to the last toast, every detail is designed to delight.",
  },
  contact: {
    kicker: "Guest services",
    title: "Contact",
    intro: "Questions or feedback? We would love to hear from you.",
    formTitle: "Send us a message",
    formHint: "We will respond as soon as possible.",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send message",
    preferEmail: "Prefer email",
    visitTitle: "Visit us",
    address: "Address",
    phone: "Phone",
    hours: "Opening hours",
    tip: "Tip: arrive 10 minutes before your reservation time for a smoother welcome.",
  },
  addToCart: {
    successTitle: "Added to cart!",
    successBody: "The item was added to your order.",
    title: "Add to order",
    tagFresh: "Made to order",
    tagIngredients: "Curated ingredients",
    tagCustomizable: "Customizable",
    quantity: "Quantity",
    notes: "Notes",
    notesPlaceholder: "Any special requests? (e.g. no onion, well done)",
    total: "Total:",
    cancel: "Cancel",
    confirm: "Add to order",
  },
};

const it: TranslationTree = {
  languageSelect: {
    title: "Benvenuti a Bella Cucina",
    subtitle: "Scegli la lingua per continuare al menu.",
    cta: "Continua al menu",
    note: "La lingua scelta viene salvata in questo browser. Per modificarla, torna alla pagina iniziale.",
  },
  nav: {
    home: "Home",
    experiences: "Esperienze",
    cucina: "Chef & cucina",
    menu: "Menu",
    reservations: "Prenotazioni",
    about: "Chi siamo",
    contact: "Contatti",
    mobileMenuTitle: "Navigazione",
    openMenu: "Apri menu",
  },
  hero: {
    eyebrow: "San Paolo • Trattoria contemporanea • Forno a legna",
    title: "Bella Cucina, anima italiana, tavola brasiliana",
    subtitle:
      "Dalla pass alla dolcezza finale, celebriamo il ritmo delle case italiane: prodotto sincero, calore umano e un pizzico di teatro in sala, con eleganza.",
    ctaMenu: "Vedi il menu",
    ctaReserve: "Prenota un tavolo",
  },
  featured: {
    title: "Firme della casa",
    subtitle: "Piatti che raccontano Piemonte, Emilia, Campania e Lazio, sempre con la stagione brasiliana.",
    ctaFull: "Vedi il menu completo",
    orderNow: "Ordina ora",
  },
  gallery: {
    kicker: "Sala & laboratorio",
    caption: {
      "1": "Sala principale al tramonto",
      "2": "Terrazza per cenare all’aperto",
      "3": "Linea calda, brace e brasati",
      "4": "Tavola apparecchiata per il rito",
      "5": "Piatti al forno e stufati lenti",
      "6": "Servizio alla francese, degustazione",
    },
  },
  experiences: {
    kicker: "Tre modi di cenare",
    title: "Una casa, tavoli diversi",
    subtitle:
      "Ispirati a trattorie ed enoteche italiane: carta viva, percorso guidato e preludio liquido al bar, sempre curato dalla brigata.",
    cta: "Scopri il menu",
    cards: {
      carta: {
        title: "Carta tradizionale",
        body: "Antipasti, primi, secondi e dolci, DOP, IGP e produttori di fiducia quando la stagione brilla.",
      },
      degustacao: {
        title: "Menu degustazione",
        body: "Sette attimi con narrazione in sala; abbinamento opzionale curato dalla sommelier.",
      },
      aperitivo: {
        title: "Aperitivo & bar",
        body: "Spritz, Negroni, amari artigianali e calici da viticoltori familiari, il preludio perfetto.",
      },
    },
  },
  chef: {
    kicker: "Brigata & laboratorio",
    title: "Chi cucina per voi",
    p1: "La cucina di Bella Cucina è guidata da una brigata formata tra tecnica italiana, disciplina di servizio e calore brasiliano a tavola.",
    p2: "Alleniamo ogni giorno il palato collettivo: degustazioni alla cieca di olio, fornate di pizza al legna e mise en place da orchestra, ogni postazione col suo assolo.",
    quote: "“Cucinare è prendersi cura: dell’ingrediente, del tempo e di chi varca la soglia.”",
    quoteBy: "Brigata Bella Cucina",
    name: "Brigata di cucina",
    role: "Brigata di cucina",
    imageChefAlt: "Brigata di cucina in servizio",
    imageKitchenAlt: "Cucina a vista con la brigata al servizio",
    imageBrigadeAlt: "Brigata in preparazione collettiva",
    brigadeCaption: "Pass, calore controllato e mani che conoscono ogni pentola.",
    valuesTitle: "Cosa non negoziamo",
    value1: "Forno a legna per pizza e pane a lunga lievitazione.",
    value2: "Pesci interi e carni mature con tracciabilità.",
    value3: "Team formato in ospitalità italiana contemporanea.",
  },
  menu: {
    sectionTitle: "Menu completo",
    sectionDescription:
      "Oltre venti creazioni tra antipasti, primi, secondi, pizze al legna, dolci e bevande, vi invitiamo a attraversare l’Italia a piccoli morsi di coraggio.",
    qrTitle: "Ordina dal tavolo",
    qrDescription:
      "Scansiona il QR sul tavolo per ordinare direttamente dal telefono",
    featuredTitle: "In evidenza",
    searchPlaceholder: "Cerca nel menu…",
    viewGrid: "Griglia",
    viewList: "Lista",
    empty: "Nessun risultato. Prova a modificare i filtri.",
    addToOrder: "Aggiungi all’ordine",
    detailsHint: "Vedi dettagli",
    category: {
      all: "Tutti",
      appetizers: "Antipasti",
      "main-courses": "Secondi",
      pizza: "Pizza",
      pasta: "Pasta",
      sushi: "Sushi",
      sides: "Contorni",
      desserts: "Dolci",
      drinks: "Bevande",
      sandwiches: "Focacce & panini",
      specials: "Degustazioni & teatro",
    },
  },
  reservation: {
    sectionTitle: "Prenota un tavolo",
    sectionDescription:
      "Prenota online e goditi un’esperienza gastronomica impeccabile.",
    imageCaption: "Fine dining contemporaneo, con anima italiana.",
    step1: "1. Data e ora",
    step2: "2. I tuoi dati",
    step3: "3. Conferma",
    step1Title: "Seleziona data e ora",
    continue: "Continua",
    back: "Indietro",
    step2Title: "Completa la prenotazione",
    confirmTitle: "Prenotazione confermata",
    confirmBodyPrefix: "la tua prenotazione è stata registrata.",
    confirmDetails: "Dettagli",
    people: "Persone",
    newReservation: "Nuova prenotazione",
    viewMenu: "Vedi il menu",
    experienceLine: "Cucina autentica in un ambiente elegante",
  },
  about: {
    kicker: "La nostra essenza",
    title: "La nostra storia",
    quote:
      "“L’eleganza sta nei dettagli: ingredienti impeccabili, tempi giusti e calore umano.”",
    chef: "Brigata Bella Cucina",
    mosaicCaption: "Fine dining contemporaneo, con anima italiana.",
    p1: `Nato nel 2010 come nostalgia italiana su suolo paulista, Bella Cucina è cresciuto con mercati bio, importatori boutique e fornitori diventati amici. “Farlo come in Italia” qui significa rispettare il prodotto, non copiare cliché.`,
    p2: `Dalla pasta che cede al dente all’ultimo sorso di amaro, inseguiamo il ritmo delle grandi case: servizio attento senza pose, vini che dialogano col piatto e una cucina aperta che invita allo sguardo curioso.`,
    card1Title: "Ingredienti di qualità",
    card1Body:
      "Selezioniamo produttori e fornitori locali, privilegiando freschezza, stagionalità e coerenza, il sapore nasce alla fonte.",
    card2Title: "Ricette autentiche",
    card2Body:
      "Tradizione italiana con raffinatezza moderna: tecniche classiche, tempi rispettati ed equilibrio impeccabile.",
    card3Title: "Servizio eccellente",
    card3Body:
      "Accoglienza attenta e discreta. Dal primo sorriso all’ultimo brindisi, ogni dettaglio è pensato per emozionare.",
  },
  contact: {
    kicker: "Assistenza",
    title: "Contatti",
    intro: "Domande o feedback? Ci farebbe piacere sentirti.",
    formTitle: "Inviaci un messaggio",
    formHint: "Risponderemo il prima possibile.",
    name: "Nome",
    email: "Email",
    message: "Messaggio",
    send: "Invia messaggio",
    preferEmail: "Preferisco email",
    visitTitle: "Vieni a trovarci",
    address: "Indirizzo",
    phone: "Telefono",
    hours: "Orari",
    tip: "Suggerimento: arriva 10 minuti prima dell’orario della prenotazione per un’accoglienza più serena.",
  },
  addToCart: {
    successTitle: "Aggiunto!",
    successBody: "L’articolo è stato aggiunto al tuo ordine.",
    title: "Aggiungi all’ordine",
    tagFresh: "Preparato al momento",
    tagIngredients: "Ingredienti selezionati",
    tagCustomizable: "Personalizzabile",
    quantity: "Quantità",
    notes: "Note",
    notesPlaceholder: "Richieste speciali? (es. senza cipolla, ben cotto)",
    total: "Totale:",
    cancel: "Annulla",
    confirm: "Aggiungi all’ordine",
  },
};

export const TRANSLATIONS: Record<SupportedLanguage, TranslationTree> = {
  pt,
  en,
  it,
};

function getByPath(tree: TranslationTree, path: string): string | undefined {
  const parts = path.split(".").filter(Boolean);
  let cur: string | TranslationTree | undefined = tree;
  for (const p of parts) {
    if (typeof cur !== "object" || cur === null) return undefined;
    cur = (cur as TranslationTree)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

export function translate(lang: SupportedLanguage, path: string): string {
  return getByPath(TRANSLATIONS[lang], path) ?? getByPath(TRANSLATIONS.pt, path) ?? path;
}
