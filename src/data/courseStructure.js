export const courseOverview = {
  title: 'Módulo · Finanzas Cotidianas Interactivas',
  description:
    'Aprende finanzas personales con experiencias breves: cada unidad combina un video explicativo, un tutorial jugable guiado y un minijuego final enfocado en decisiones reales.',
  welcome:
    'Explora las unidades para descubrir cómo los conceptos se convierten en habilidades financieras accionables en menos de 20 minutos por tema.',
  highlights: [
    'Historias y ejemplos cercanos a la vida diaria',
    'Tutoriales guiados con asistentes virtuales amigables',
    'Minijuegos finales para practicar bajo presión controlada'
  ]
}

export const units = [
  {
    id: 'unidad-1',
    title: 'Unidad 1 · Tu dinero y tus metas',
    tagline: 'Convierte aspiraciones generales en objetivos financieros medibles y alcanzables.',
    summary:
      'Define metas SMART conectadas con tu presupuesto diario y prioriza acciones concretas para avanzar cada semana.',
    isAvailable: true,
    videoPlaceholder:
      'Aquí se integrará el video explicativo sobre cómo transformar tus metas financieras.',
    highlights: [
      'Mapeo de metas SMART',
      'Estaciones de presupuesto, ahorro y progreso',
      'Juego final tipo ritmo con ingresos y gastos'
    ],
    content: {
      explanation:
        'Aprenderás a traducir deseos financieros vagos en metas específicas, medibles, alcanzables, relevantes y con fecha. Esta unidad te muestra cómo una meta clara se convierte en un mapa que guía decisiones diarias.',
      summary: {
        introduction:
          'Las metas financieras específicas funcionan como un GPS: señalan destino, ruta y paradas intermedias. Sin claridad, es difícil priorizar gastos o evaluar si un ingreso extra debe ir a ahorro, deudas o gustos.',
        importance:
          'Cuando defines qué quieres lograr, en cuánto tiempo y cuánto cuesta, puedes segmentar tu dinero en pequeñas acciones semanales. Esto evita la frustración de “no avanzar” y permite ajustar el rumbo con datos reales.',
        commonMistakes: [
          'Decir “quiero ahorrar más” sin calcular cuánto ni para qué',
          'Elegir metas que dependen solo de ingresos extraordinarios',
          'No revisar avances y perder motivación en el mes 2 o 3'
        ],
        benefits: [
          'Tomar decisiones rápidas frente a gastos impulsivos',
          'Medir con claridad cuánto te falta para llegar a tu objetivo',
          'Celebrar logros parciales y reforzar hábitos de ahorro'
        ]
      },
      tutorial: {
        setting:
          'Banco comunitario con vista cenital, dividido en estaciones de Metas, Presupuesto y Ahorro.',
        assistant: {
          name: 'Lía',
          role: 'Asistente virtual del banco',
          personality: 'Cálida, directa y con iconografía brillante que resalta pasos clave'
        },
        flow: [
          {
            title: 'Recepción de metas',
            description:
              'Lía recibe al jugador en el lobby y muestra un panel holográfico con una meta vaga ("Quiero viajar"). Se arrastran etiquetas para concretar monto, fecha y propósito.',
            interactions: [
              'El jugador selecciona el destino, ingresa la fecha límite y el costo estimado.',
              'Lía visualiza una barra de progreso que se llena a medida que la meta se vuelve específica.'
            ]
          },
          {
            title: 'Estación de presupuesto',
            description:
              'Mesas interactivas con tarjetas de ingresos y gastos. El jugador distribuye dinero según prioridad usando fichas magnéticas.',
            interactions: [
              'Al soltar una ficha sobre “Necesario”, la mesa muestra cuánto queda disponible.',
              'Lía destaca con luz verde las asignaciones alineadas con la meta y sugiere ajustes cuando hay déficit.'
            ]
          },
          {
            title: 'Estación de ahorro programado',
            description:
              'Cajas transparentes muestran semanas del plan. Cada caja necesita una cantidad específica para llenar el indicador de ahorro.',
            interactions: [
              'El jugador arrastra montos sobrantes hacia cada semana; Lía confirma con animaciones cuando se cumple el objetivo parcial.',
              'Si falta dinero, propone microajustes en gastos y muestra el impacto inmediato en la barra de meta.'
            ]
          }
        ],
        feedback:
          'Cada acción produce indicadores visuales: barras de avance, sellos de “meta clara” y pop-ups amigables con ejemplos de la vida real. El tutorial termina cuando el plan semanal queda equilibrado y Lía entrega un reporte animado listo para el minijuego.'
      },
      finalGame: {
        name: 'Sinfonía de Metas',
        format: 'Minijuego de ritmo tipo guitar hero (duración 75 segundos).',
        objective:
          'Mantener el saldo ≥ 0 y llenar la barra de la meta antes de que termine la canción, priorizando fichas de ahorro sin descuidar pagos básicos.',
        lanes: ['Ingresos', 'Gastos esenciales', 'Gastos flexibles', 'Ahorro para la meta'],
        mechanics: [
          'Las fichas caen sincronizadas con la música y se activan al presionar la tecla correcta cuando llegan a la zona de precisión.',
          'Las fichas verdes (ingresos) suman saldo, las amarillas (gastos esenciales) lo restan de forma obligatoria y las azules (gastos flexibles) pueden saltarse con penalización menor.',
          'Las fichas moradas (ahorro) solo pueden activarse si el saldo actual permanece positivo; al hacerlo, llenan la barra de la meta.'
        ],
        rules: [
          'Fallar tres gastos esenciales consecutivos reduce la barra de confianza y ralentiza la aparición de ingresos.',
          'Ignorar dos fichas de ahorro seguidas detiene el progreso de la barra de meta por 5 segundos.',
          'Completar combinaciones perfectas (ingreso + ahorro consecutivo) otorga multiplicadores temporales.'
        ],
        victoryConditions: [
          'Barra de meta llena antes de que termine la pista musical.',
          'Saldo final en positivo y barra de confianza por encima del 40%.'
        ],
        failStates: [
          'Saldo negativo durante más de 6 segundos continuos.',
          'No llenar al menos el 80% de la barra de meta al finalizar.'
        ],
        visualNotes: [
          'Panel lateral muestra progreso de la meta y recordatorios breves de la meta SMART.',
          'Animaciones de Lía celebrando combos y ofreciendo consejos cuando el jugador falla fichas clave.'
        ]
      }
    }
  },
  {
    id: 'unidad-2',
    title: 'Unidad 2 · Mini-presupuesto: necesidades, gustos y ahorro',
    tagline: 'Organiza tu dinero en tres cubetas flexibles con la regla 50-30-20 como referencia.',
    summary:
      'Aprende a distinguir gastos esenciales, gustos y ahorro programado mientras adaptas la regla 50-30-20 a tu realidad.',
    isAvailable: false,
    videoPlaceholder: 'El video introductorio se añadirá próximamente.',
    highlights: ['Casos cotidianos en casa', 'Regla 50-30-20 adaptable', 'Juego estratégico por turnos'],
    comingSoonMessage:
      'Muy pronto podrás practicar cómo equilibrar necesidades, gustos y ahorro con retos de 5 rondas.'
  },
  {
    id: 'unidad-3',
    title: 'Unidad 3 · Préstamos inteligentes: monto, plazo, tasa y costo total',
    tagline: 'Evalúa préstamos comparando cuota, plazo, comisiones y costo total antes de firmar.',
    summary:
      'Descubre cómo los trade-offs de un crédito afectan tu bolsillo y cómo negociar pagos anticipados sostenibles.',
    isAvailable: false,
    videoPlaceholder: 'El video introductorio se añadirá próximamente.',
    highlights: ['Oficina de crédito interactiva', 'Comparador de ofertas', 'Puzzle de planificación'],
    comingSoonMessage:
      'Estamos diseñando casos prácticos para elegir la mejor oferta sin rebasar tu presupuesto mensual.'
  },
  {
    id: 'unidad-4',
    title: 'Unidad 4 · Pagos digitales y seguridad básica',
    tagline: 'Usa QR, tarjetas y transferencias con protocolos de seguridad sencillos y efectivos.',
    summary:
      'Identifica amenazas comunes, valida información y aplica autenticación segura antes de aprobar pagos.',
    isAvailable: false,
    videoPlaceholder: 'El video introductorio se añadirá próximamente.',
    highlights: ['Cafetería con escenarios reales', 'Checklist de verificación', 'Tower defense de fraudes'],
    comingSoonMessage:
      'Próximamente defenderás una barra de pagos contra intentos de fraude mientras procesas transacciones legítimas.'
  }
]
