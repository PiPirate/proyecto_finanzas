// Objetos interactivos
export const interactiveObjects = [
  {
    id: 'mk25_assistant',
    x: 8,
    y: 2,
    type: 'npc',
    name: 'MK-25',
    icon: '🤖',
    dialogue: null,
  },

  {
    id: 'planning_desk',
    x: 4.5,
    y: 3,
    type: 'budget',
    name: 'Presupuesto',
    icon: '📊',
    action: 'budget',
    dialogue: null,
  },

  {
    id: 'needs_area',
    x: 2,
    y: 8,
    type: 'zone',
    name: 'Necesidades',
    icon: '🛒',
    dialogue: null,
  },

  {
    id: 'wants_area',
    x: 10.5,
    y: 8,
    type: 'zone',
    name: 'Gustos',
    icon: '🎮',
    dialogue: null,
  },

  {
    id: 'savings_area',
    x: 14,
    y: 2,
    type: 'zone',
    name: 'Ahorro',
    icon: '🐷',
    dialogue: null,
  },

  {
    id: 'management_pc',
    x: 10,
    y: 1,
    type: 'computer',
    name: 'Simulador',
    icon: '💻',
    action: 'expense_game',
    dialogue: null,
  },
];

// Diálogos de MK-25
export const mk25Dialogues = {
  intro: [
    { speaker: 'assistant', text: '¡Hey! Soy MK-25, tu asistente de finanzas personales. ¡Felicidades por mudarte solo por primera vez!', emotion: 'happy' },
    { speaker: 'assistant', text: 'Acabas de recibir tu primer salario de $10,000. Sé que es tentador gastarlo todo... pero déjame enseñarte algo mejor.', emotion: 'thinking' },
    { speaker: 'assistant', text: 'La regla de oro: PRIMERO separa tu dinero, DESPUÉS gasta. Si haces lo contrario, nunca ahorrarás.', emotion: 'neutral' },
    { speaker: 'assistant', text: 'Ve a la Mesa de Planificación y distribuye tu salario. Te recomiendo 50% necesidades, 30% gustos, 20% ahorro, pero tú decides.', emotion: 'happy' },
  ],

  afterBudget: [
    { speaker: 'assistant', text: '¡Perfecto! Ya tienes tu presupuesto. Ahora déjame darte un TOUR por tu nueva casa.', emotion: 'happy' },
    { speaker: 'assistant', text: 'Sígueme, te mostraré las 3 zonas importantes y qué representan en tu vida financiera.', emotion: 'neutral' },
  ],

  tourNeeds: [
    { speaker: 'assistant', text: '🛒 Esta es la zona del REFRIGERADOR. Representa tus NECESIDADES básicas.', emotion: 'neutral' },
    { speaker: 'assistant', text: 'Aquí vive todo lo que DEBES pagar para sobrevivir: comida, renta, servicios, transporte, salud.', emotion: 'thinking' },
    { speaker: 'assistant', text: 'Si ignoras necesidades, tu BIENESTAR baja rápido. Son urgentes y no negociables.', emotion: 'neutral' },
    { speaker: 'assistant', text: '¡Juguemos un minijuego para que aprendas qué es una necesidad real!', emotion: 'happy' },
  ],

  tourWants: [
    { speaker: 'assistant', text: '🎮 Esta es la ZONA DE OCIO. Representa tus GUSTOS y diversión.', emotion: 'happy' },
    { speaker: 'assistant', text: 'Aquí está todo lo que QUIERES pero no necesitas: Netflix, salir a comer, videojuegos, ropa de moda.', emotion: 'neutral' },
    { speaker: 'assistant', text: 'Los gustos NO son malos, ¡hacen la vida disfrutable! Pero son opcionales y ajustables.', emotion: 'thinking' },
    { speaker: 'assistant', text: 'Juguemos para que identifiques qué es un gusto y cómo manejarlo.', emotion: 'happy' },
  ],

  tourSavings: [
    { speaker: 'assistant', text: '🐷 Esta es tu ALCANCÍA. Representa tu AHORRO y futuro financiero.', emotion: 'neutral' },
    { speaker: 'assistant', text: '¡SECRETO MAESTRO! Separa el ahorro ANTES de ver el resto del dinero.', emotion: 'thinking' },
    { speaker: 'assistant', text: 'Si esperas "a ver qué sobra al final del mes", NUNCA ahorrarás. Créeme, lo he visto mil veces.', emotion: 'neutral' },
    { speaker: 'assistant', text: 'Este dinero es para emergencias, metas grandes y tranquilidad mental. ¡Aprendamos para qué sirve!', emotion: 'happy' },
  ],

  afterTour: [
    { speaker: 'assistant', text: '¡Excelente! Ya conoces las 3 zonas de tu vida financiera.', emotion: 'happy' },
    { speaker: 'assistant', text: 'Recuerda: 🛒 Necesidades PRIMERO → 🎮 Gustos con MEDIDA → 🐷 Ahorro SIEMPRE.', emotion: 'thinking' },
    { speaker: 'assistant', text: 'Ahora ve a la 💻 Computadora para comenzar el SIMULADOR DE VIDA.', emotion: 'neutral' },
    { speaker: 'assistant', text: 'Estaré aquí si necesitas ayuda. ¡Mucha suerte! 🚀', emotion: 'happy' },
  ],

  beforeSimulation: [
    { speaker: 'assistant', text: 'Ok, aquí viene lo real...', emotion: 'thinking' },
    { speaker: 'assistant', text: 'Cada día trabajarás para ganar $400...', emotion: 'neutral' },
    { speaker: 'assistant', text: 'Verás cómo tus decisiones afectan la regla 50-30-20.', emotion: 'thinking' },
    { speaker: 'assistant', text: '¡Objetivo: al menos 20% de ahorro!', emotion: 'happy' },
  ],

  helpReminder: [
    { speaker: 'assistant', text: 'Si necesitas ayuda, aquí estoy.', emotion: 'neutral' },
  ],
};

// Diálogos según zona
export const zoneDialogues = {
  needs: [
    { speaker: 'assistant', text: '🛒 NECESIDADES: gastos básicos esenciales.', emotion: 'neutral' },
    { speaker: 'assistant', text: 'Renta, comida, transporte, servicios...', emotion: 'neutral' },
    { speaker: 'assistant', text: 'Tip: nunca ignores necesidades.', emotion: 'thinking' },
  ],
  wants: [
    { speaker: 'assistant', text: '🎮 GUSTOS: cosas que quieres pero no necesitas.', emotion: 'neutral' },
    { speaker: 'assistant', text: 'Netflix, comida rápida, ropa extra...', emotion: 'happy' },
    { speaker: 'assistant', text: 'Tip: úsalos con moderación.', emotion: 'thinking' },
  ],
  savings: [
    { speaker: 'assistant', text: '🐷 AHORRO: tu seguridad y metas a futuro.', emotion: 'neutral' },
    { speaker: 'assistant', text: 'Ahorra ANTES de gastar.', emotion: 'thinking' },
    { speaker: 'assistant', text: 'Protege tu ahorro como prioridad.', emotion: 'happy' },
  ],
  freelance: [
    { speaker: 'assistant', text: '💼 TRABAJO FREELANCE: para emergencias.', emotion: 'neutral' },
    { speaker: 'assistant', text: 'Ganas $500-$800 haciendo clics.', emotion: 'thinking' },
    { speaker: 'assistant', text: 'Pero baja tu bienestar.', emotion: 'neutral' },
  ],
};

// Sistema de narrativa y progresión
export const storyProgress = {
  intro: {
    completed: false,
    title: "Tu nueva vida independiente",
    description: "Habla con MK-25 para comenzar"
  },
  learnBudget: {
    completed: false,
    title: "Planifica tu primer mes",
    description: "Distribuye tu salario en la Mesa de Planificación"
  },
  exploreZones: {
    completed: false,
    title: "Conoce tu nueva casa",
    description: "Explora las 3 zonas de tu hogar"
  },
  firstWeek: {
    completed: false,
    title: "Tu primera semana solo",
    description: "Sobrevive 7 días gestionando gastos"
  },
  fullMonth: {
    completed: false,
    title: "Un mes completo",
    description: "Completa 30 días sin quedarte en bancarrota"
  }
};

// Mapa del juego (0 = caminable, 1 = bloqueado)
export const gameMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,1,1,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
