export const courseOverview = {
  title: 'Finanzas Cotidianas Interactivas',
  description: 'Aprende finanzas personales con videos, tutoriales guiados y minijuegos. Menos de 20 minutos por tema.',
  welcome: 'Desarrolla habilidades financieras accionables a través de experiencias interactivas.',
  highlights: [
    'Historias de la vida diaria',
    'Asistentes virtuales amigables',
    'Minijuegos prácticos'
  ]
}

export const units = [
  {
    id: 'unidad-1',
    title: 'Tu dinero y tus metas',
    number: '01',
    tagline: 'Convierte aspiraciones en objetivos financieros alcanzables.',
    description: 'Define metas SMART conectadas con tu presupuesto diario y prioriza acciones concretas para avanzar cada semana. Aprende a traducir deseos financieros en objetivos específicos, medibles, alcanzables, relevantes y con fecha límite.',
    isAvailable: true,
    icon: 'target',
    color: 'from-blue-500 to-cyan-500',
    highlights: [
      'Mapeo de metas SMART',
      'Estaciones de presupuesto y ahorro',
      'Juego de ritmo tipo guitar hero'
    ],
    duration: '15-20 min',
    difficulty: 'Principiante'
  },
  {
    id: 'unidad-2',
    title: 'Mini-presupuesto: 50-30-20',
    number: '02',
    tagline: 'Organiza tu dinero: necesidades, gustos y ahorro.',
    description: 'Distingue gastos esenciales de opcionales y adapta la regla 50-30-20 a tu realidad financiera. Aprende a equilibrar necesidades, gustos personales y ahorro programado con casos cotidianos.',
    isAvailable: false,
    icon: 'wallet',
    color: 'from-purple-500 to-pink-500',
    highlights: [
      'Casos cotidianos en casa',
      'Regla 50-30-20 adaptable',
      'Juego estratégico por turnos'
    ],
    duration: '15-20 min',
    difficulty: 'Principiante'
  },
  {
    id: 'unidad-3',
    title: 'Préstamos inteligentes',
    number: '03',
    tagline: 'Evalúa préstamos y elige la mejor opción.',
    description: 'Compara cuota mensual, plazo, comisiones ocultas y costo total real antes de firmar cualquier crédito. Descubre cómo los trade-offs de un préstamo afectan tu bolsillo y cómo negociar pagos anticipados sostenibles.',
    isAvailable: false,
    icon: 'handshake',
    color: 'from-green-500 to-emerald-500',
    highlights: [
      'Oficina de crédito interactiva',
      'Comparador de ofertas en tiempo real',
      'Puzzle de planificación de pagos'
    ],
    duration: '20-25 min',
    difficulty: 'Intermedio'
  },
  {
    id: 'unidad-4',
    title: 'Pagos digitales seguros',
    number: '04',
    tagline: 'Usa QR, tarjetas y transferencias con seguridad.',
    description: 'Identifica amenazas comunes en pagos digitales, valida información crítica y aplica protocolos de autenticación segura antes de aprobar cualquier transacción. Protege tu dinero de fraudes y estafas digitales.',
    isAvailable: false,
    icon: 'shield-check',
    color: 'from-orange-500 to-red-500',
    highlights: [
      'Cafetería con escenarios reales',
      'Checklist de verificación paso a paso',
      'Tower defense contra intentos de fraude'
    ],
    duration: '15-20 min',
    difficulty: 'Principiante'
  }
]