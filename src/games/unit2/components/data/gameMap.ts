// Mapa del juego (0 = caminable, 1 = bloqueado)
export const gameMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

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

// Objetos interactivos en el mapa (REDUCIDOS Y CON NARRATIVA)
export const interactiveObjects = [
  // MK-25: Tu asistente y mentor principal
  {
    id: 'mk25_assistant',
    x: 8,
    y: 2,
    type: 'npc',
    icon: '🤖',
    name: 'MK-25',
    dialogue: null, // Se genera dinámicamente según progreso
  },

  // Mesa de Planificación - Tutorial de presupuesto
  {
    id: 'planning_desk',
    x: 2,
    y: 2,
    type: 'budget',
    icon: '📊',
    name: 'Mesa de Planificación',
    action: 'budget',
    dialogue: null,
  },

  // Zona de Necesidades
  {
    id: 'needs_area',
    x: 2,
    y: 8,
    type: 'zone',
    icon: '🛒',
    name: 'Refrigerador',
    dialogue: null,
  },

  // Zona de Gustos
  {
    id: 'wants_area',
    x: 8,
    y: 8,
    type: 'zone',
    icon: '🎮',
    name: 'Zona de Ocio',
    dialogue: null,
  },

  // Zona de Ahorro
  {
    id: 'savings_area',
    x: 13,
    y: 8,
    type: 'zone',
    icon: '🐷',
    name: 'Alcancía',
    dialogue: null,
  },

  // Computadora de Gestión - Minijuego principal
  {
    id: 'management_pc',
    x: 13,
    y: 2,
    type: 'computer',
    icon: '💻',
    name: 'Simulador de Vida',
    action: 'expense_game',
    dialogue: null,
  },

  // Escritorio de freelance - Minijuego de emergencia
  {
    id: 'freelance_desk',
    x: 5,
    y: 5,
    type: 'work',
    icon: '💼',
    name: 'Escritorio Freelance',
    action: 'freelance_game',
    dialogue: null,
  },
];

// Diálogos dinámicos de MK-25 según progreso
export const mk25Dialogues = {
  intro: [
    {
      speaker: 'assistant',
      text: '¡Hey! Soy MK-25, tu asistente de finanzas personales. ¡Felicidades por mudarte solo por primera vez!',
      emotion: 'happy',
    },
    {
      speaker: 'assistant',
      text: 'Acabas de recibir tu primer salario de $10,000. Sé que es tentador gastarlo todo... pero déjame enseñarte algo mejor.',
      emotion: 'thinking',
    },
    {
      speaker: 'assistant',
      text: 'La regla de oro: PRIMERO separa tu dinero, DESPUÉS gasta. Si haces lo contrario, nunca ahorrarás.',
      emotion: 'neutral',
    },
    {
      speaker: 'assistant',
      text: 'Ve a la Mesa de Planificación y distribuye tu salario. Te recomiendo 50% necesidades, 30% gustos, 20% ahorro, pero tú decides.',
      emotion: 'happy',
    },
  ],
  
  afterBudget: [
    {
      speaker: 'assistant',
      text: '¡Perfecto! Ya tienes tu presupuesto. Ahora déjame darte un TOUR por tu nueva casa.',
      emotion: 'happy',
    },
    {
      speaker: 'assistant',
      text: 'Sígueme, te mostraré las 3 zonas importantes y qué representan en tu vida financiera.',
      emotion: 'neutral',
    },
  ],

  // TOUR - Zona 1: Refrigerador (Necesidades)
  tourNeeds: [
    {
      speaker: 'assistant',
      text: '🛒 Esta es la zona del REFRIGERADOR. Representa tus NECESIDADES básicas.',
      emotion: 'neutral',
    },
    {
      speaker: 'assistant',
      text: 'Aquí vive todo lo que DEBES pagar para sobrevivir: comida, renta, servicios, transporte, salud.',
      emotion: 'thinking',
    },
    {
      speaker: 'assistant',
      text: 'Si ignoras necesidades, tu BIENESTAR baja rápido. Son urgentes y no negociables.',
      emotion: 'neutral',
    },
    {
      speaker: 'assistant',
      text: '¡Juguemos un minijuego para que aprendas qué es una necesidad real!',
      emotion: 'happy',
    },
  ],

  // TOUR - Zona 2: Zona de Ocio (Gustos)
  tourWants: [
    {
      speaker: 'assistant',
      text: '🎮 Esta es la ZONA DE OCIO. Representa tus GUSTOS y diversión.',
      emotion: 'happy',
    },
    {
      speaker: 'assistant',
      text: 'Aquí está todo lo que QUIERES pero no necesitas: Netflix, salir a comer, videojuegos, ropa de moda.',
      emotion: 'neutral',
    },
    {
      speaker: 'assistant',
      text: 'Los gustos NO son malos, ¡hacen la vida disfrutable! Pero son opcionales y ajustables.',
      emotion: 'thinking',
    },
    {
      speaker: 'assistant',
      text: 'Juguemos para que identifiques qué es un gusto y cómo manejarlo.',
      emotion: 'happy',
    },
  ],

  // TOUR - Zona 3: Alcancía (Ahorro)
  tourSavings: [
    {
      speaker: 'assistant',
      text: '🐷 Esta es tu ALCANCÍA. Representa tu AHORRO y futuro financiero.',
      emotion: 'neutral',
    },
    {
      speaker: 'assistant',
      text: '¡SECRETO MAESTRO! Separa el ahorro ANTES de ver el resto del dinero.',
      emotion: 'thinking',
    },
    {
      speaker: 'assistant',
      text: 'Si esperas "a ver qué sobra al final del mes", NUNCA ahorrarás. Créeme, lo he visto mil veces.',
      emotion: 'neutral',
    },
    {
      speaker: 'assistant',
      text: 'Este dinero es para emergencias, metas grandes y tranquilidad mental. ¡Aprendamos para qué sirve!',
      emotion: 'happy',
    },
  ],

  // Después del tour completo
  afterTour: [
    {
      speaker: 'assistant',
      text: '¡Excelente! Ya conoces las 3 zonas de tu vida financiera.',
      emotion: 'happy',
    },
    {
      speaker: 'assistant',
      text: 'Recuerda: 🛒 Necesidades PRIMERO → 🎮 Gustos con MEDIDA → 🐷 Ahorro SIEMPRE.',
      emotion: 'thinking',
    },
    {
      speaker: 'assistant',
      text: 'Ahora ve a la 💻 Computadora para comenzar el SIMULADOR DE VIDA. Ahí pondrás en práctica todo lo aprendido.',
      emotion: 'neutral',
    },
    {
      speaker: 'assistant',
      text: 'Estaré aquí si necesitas ayuda. ¡Mucha suerte! 🚀',
      emotion: 'happy',
    },
  ],

  // Diálogos posteriores
  afterZones: [
    {
      speaker: 'assistant',
      text: 'Ya exploraste las zonas. ¿Listo para enfrentar la vida real?',
      emotion: 'thinking',
    },
    {
      speaker: 'assistant',
      text: 'Ve a la 💻 Computadora y comienza el Simulador de Vida. Ahí enfrentarás gastos reales por 5 días.',
      emotion: 'neutral',
    },
  ],

  beforeSimulation: [
    {
      speaker: 'assistant',
      text: 'Ok, aquí viene lo real. En el Simulador enfrentarás decisiones financieras por 5 días.',
      emotion: 'thinking',
    },
    {
      speaker: 'assistant',
      text: 'Cada día trabajarás para ganar $400, y luego tomarás 3 decisiones sobre cómo gastarlo.',
      emotion: 'neutral',
    },
    {
      speaker: 'assistant',
      text: 'Verás en tiempo real cómo tus decisiones afectan la regla 50-30-20. ¡Aprenderás haciendo!',
      emotion: 'thinking',
    },
    {
      speaker: 'assistant',
      text: '¡Objetivo: Terminar con al menos 20% de ahorro y buen balance! ¡Adelante!',
      emotion: 'happy',
    },
  ],

  afterFirstWeek: [
    {
      speaker: 'assistant',
      text: '¡7 días completados! ¿Empiezas a ver cómo los pequeños gastos se acumulan?',
      emotion: 'happy',
    },
    {
      speaker: 'assistant',
      text: 'El secreto no es nunca gastar en gustos, sino PLANIFICAR cuándo y cuánto. Si guardaste ahorro, vas por buen camino.',
      emotion: 'thinking',
    },
  ],

  finalComplete: [
    {
      speaker: 'assistant',
      text: '¡INCREÍBLE! ¡Completaste el simulador! Ya no eres un novato financiero.',
      emotion: 'happy',
    },
    {
      speaker: 'assistant',
      text: 'Recuerda: Presupuestar no es restricción, es LIBERTAD. Sabes exactamente qué puedes gastar sin culpa.',
      emotion: 'neutral',
    },
    {
      speaker: 'assistant',
      text: 'Ahora ve tus resultados finales. ¿Qué tal te fue?',
      emotion: 'happy',
    },
  ],

  helpReminder: [
    {
      speaker: 'assistant',
      text: 'Si necesitas ayuda, aquí estoy. Recuerda: planifica, prioriza necesidades, ahorra primero.',
      emotion: 'neutral',
    },
  ],
};

// Diálogos de las zonas
export const zoneDialogues = {
  needs: [
    {
      speaker: 'system',
      text: '🛒 NECESIDADES: Lo que DEBES pagar para sobrevivir y funcionar.',
      emotion: 'neutral',
    },
    {
      speaker: 'system',
      text: 'Renta, comida básica, transporte al trabajo, servicios (luz, agua, internet). Si no pagas, tu BIENESTAR baja rápido.',
      emotion: 'neutral',
    },
    {
      speaker: 'system',
      text: 'Tip: NUNCA ignores necesidades. Son urgentes y tienen consecuencias graves.',
      emotion: 'thinking',
    },
  ],

  wants: [
    {
      speaker: 'system',
      text: '🎮 GUSTOS: Lo que QUIERES pero puedes vivir sin ello.',
      emotion: 'neutral',
    },
    {
      speaker: 'system',
      text: 'Netflix, salir a comer, ropa nueva, conciertos. No son malos, ¡hacen la vida disfrutable!',
      emotion: 'happy',
    },
    {
      speaker: 'system',
      text: 'Tip: Puedes posponer o rechazar gustos sin consecuencias graves. Úsalos como recompensa cuando tu presupuesto lo permite.',
      emotion: 'thinking',
    },
  ],

  savings: [
    {
      speaker: 'system',
      text: '🐷 AHORRO: Tu seguridad y futuro financiero.',
      emotion: 'neutral',
    },
    {
      speaker: 'system',
      text: '¡SECRETO MAESTRO! Separa el ahorro ANTES de ver el resto del dinero. Si esperas "a ver qué sobra", nunca ahorrarás.',
      emotion: 'thinking',
    },
    {
      speaker: 'system',
      text: 'Este dinero es para emergencias, metas grandes, y tranquilidad mental. En el juego, trata de NO tocarlo salvo emergencia real.',
      emotion: 'happy',
    },
  ],

  freelance: [
    {
      speaker: 'system',
      text: '💼 TRABAJO FREELANCE: Trabajos extras para ganar dinero de emergencia.',
      emotion: 'neutral',
    },
    {
      speaker: 'system',
      text: 'Si te quedas sin presupuesto, puedes hacer un trabajo freelance (1 por día) para ganar $500-$800.',
      emotion: 'thinking',
    },
    {
      speaker: 'system',
      text: 'CUIDADO: Te quita puntos de balance vida-trabajo. Úsalo solo como último recurso, no como estrategia principal.',
      emotion: 'neutral',
    },
  ],
};