export const courseOverview = {
  title: 'Finanzas Personales 101',
  description:
    'Explora los fundamentos de la educación financiera a través de cuatro unidades con recursos interactivos y evaluativos.',
  goals: [
    'Comprender los conceptos básicos de presupuesto y ahorro',
    'Aplicar herramientas digitales para la planeación financiera',
    'Identificar estrategias de inversión acorde a tus objetivos',
    'Fortalecer la toma de decisiones financieras mediante evaluaciones prácticas'
  ]
}

export const units = [
  {
    id: 'unidad-1',
    title: 'Unidad 1 · Presupuesto y Control de Gastos',
    description:
      'Aprende a registrar tus ingresos y egresos, establecer prioridades y crear un presupuesto realista.',
    video: {
      title: 'Introducción al Presupuesto',
      url: 'https://player.vimeo.com/video/123456789'
    },
    learningGame: {
      title: 'Simulador de Presupuesto Mensual',
      description: 'Organiza ingresos y gastos en un tablero interactivo para alcanzar el equilibrio financiero.',
      path: '/games/unidad-1/presupuesto/'
    },
    evaluationGame: {
      title: 'Reto de Emergencias Financieras',
      description: 'Toma decisiones rápidas ante imprevistos y evalúa tu capacidad de respuesta.',
      path: '/games/unidad-1/evaluacion/'
    },
    keyConcepts: ['Flujo de efectivo', 'Regla 50/30/20', 'Categorías de gastos'],
    resources: ['Plantilla de presupuesto en hoja de cálculo', 'Guía rápida de categorización de gastos']
  },
  {
    id: 'unidad-2',
    title: 'Unidad 2 · Ahorro e Instrumentos Financieros',
    description:
      'Descubre cómo establecer metas de ahorro y elige instrumentos según horizonte temporal y tolerancia al riesgo.',
    video: {
      title: 'Vehículos de Ahorro',
      url: 'https://player.vimeo.com/video/987654321'
    },
    learningGame: {
      title: 'Meta de Ahorro Interactiva',
      description: 'Calcula cuánto necesitas ahorrar para una meta específica considerando intereses.',
      path: '/games/unidad-2/ahorro/'
    },
    evaluationGame: {
      title: 'Trivia de Instrumentos Financieros',
      description: 'Pon a prueba tus conocimientos sobre CETES, cuentas de ahorro y fondos de inversión.',
      path: '/games/unidad-2/evaluacion/'
    },
    keyConcepts: ['Interés compuesto', 'Horizonte de inversión', 'Perfil de riesgo'],
    resources: ['Calculadora de metas de ahorro', 'Comparativa de instrumentos financieros']
  },
  {
    id: 'unidad-3',
    title: 'Unidad 3 · Crédito Responsable',
    description:
      'Analiza cómo funcionan los créditos, interpreta estados de cuenta y conoce estrategias para reducir deudas.',
    video: {
      title: 'ABC del Crédito',
      url: 'https://player.vimeo.com/video/246813579'
    },
    learningGame: {
      title: 'Simulador de Tarjeta de Crédito',
      description: 'Ajusta pagos y tasas para comprender cómo se comporta el saldo de tu tarjeta.',
      path: '/games/unidad-3/credito/'
    },
    evaluationGame: {
      title: 'Escenarios de Endeudamiento',
      description: 'Evalúa alternativas para liquidar deudas considerando intereses y penalizaciones.',
      path: '/games/unidad-3/evaluacion/'
    },
    keyConcepts: ['Tasa de interés anual', 'Pago mínimo', 'Historial crediticio'],
    resources: ['Plantilla para control de deudas', 'Checklist para elegir un crédito']
  },
  {
    id: 'unidad-4',
    title: 'Unidad 4 · Planificación a Largo Plazo',
    description:
      'Integra seguros, inversiones y metas patrimoniales en una estrategia de largo plazo.',
    video: {
      title: 'Construyendo tu Futuro Financiero',
      url: 'https://player.vimeo.com/video/135792468'
    },
    learningGame: {
      title: 'Juego de Estrategia Patrimonial',
      description: 'Distribuye recursos entre seguros, inversiones y metas de vida para equilibrar riesgos.',
      path: '/games/unidad-4/planificacion/'
    },
    evaluationGame: {
      title: 'Simulación de Jubilación',
      description: 'Toma decisiones sobre aportaciones y ajustes para alcanzar una pensión deseada.',
      path: '/games/unidad-4/evaluacion/'
    },
    keyConcepts: ['Diversificación', 'Inflación', 'Fondo de emergencia'],
    resources: ['Checklist de plan financiero integral', 'Guía para elegir seguros de vida']
  }
]
