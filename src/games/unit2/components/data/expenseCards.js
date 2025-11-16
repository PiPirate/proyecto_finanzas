export const expenseCards = [
  // ========== NECESIDADES (URGENTES Y CON CONSECUENCIAS) ==========
  {
    id: 'rent',
    name: 'Pago de Renta',
    description:
      'El pago mensual de tu departamento. Si no pagas a tiempo, el casero no estará feliz.',
    amount: 4000,
    type: 'need',
    icon: '🏠',
    urgency: 3,
    wellbeingImpact: -40,
    recurring: true,
    consequence: 'Sin casa, tu bienestar cae drásticamente. ¡Prioridad máxima!',
  },
  {
    id: 'electricity',
    name: 'Recibo de Luz',
    description:
      'El consumo eléctrico del mes. Sin luz, no hay internet ni refrigerador.',
    amount: 350,
    type: 'need',
    icon: '⚡',
    urgency: 5,
    wellbeingImpact: -20,
    recurring: true,
    consequence: 'Te cortan la luz. No puedes trabajar ni cocinar. -20 bienestar.',
  },
  {
    id: 'water',
    name: 'Recibo de Agua',
    description: 'Servicio de agua potable. Necesario para higiene básica.',
    amount: 200,
    type: 'need',
    icon: '💧',
    urgency: 5,
    wellbeingImpact: -15,
    recurring: true,
    consequence: 'Sin agua no hay ducha ni cocina. -15 bienestar.',
  },
  {
    id: 'internet',
    name: 'Internet',
    description: 'Conexión a internet para trabajar y estudiar.',
    amount: 450,
    type: 'need',
    icon: '🌐',
    urgency: 3,
    wellbeingImpact: -25,
    recurring: true,
    consequence:
      'Sin internet no puedes trabajar desde casa. -25 bienestar.',
  },
  {
    id: 'groceries_basic',
    name: 'Despensa Básica',
    description:
      'Comida esencial para la semana: arroz, pasta, huevos, verduras.',
    amount: 800,
    type: 'need',
    icon: '🛒',
    urgency: 2,
    wellbeingImpact: -30,
    recurring: false,
    consequence: 'Sin comida, tu energía y salud caen. -30 bienestar.',
  },
  {
    id: 'transport',
    name: 'Pase de Transporte',
    description: 'Recarga semanal para ir al trabajo y regresar.',
    amount: 250,
    type: 'need',
    icon: '🚌',
    urgency: 2,
    wellbeingImpact: -25,
    recurring: false,
    consequence:
      'No puedes ir a trabajar. Pierdes ingresos. -25 bienestar.',
  },
  {
    id: 'medicine',
    name: 'Medicinas',
    description:
      'Te resfriastaste. Necesitas antigripales para recuperarte.',
    amount: 180,
    type: 'need',
    icon: '💊',
    urgency: 1,
    wellbeingImpact: -35,
    recurring: false,
    consequence:
      'La enfermedad empeora. No puedes rendir. -35 bienestar.',
  },
  {
    id: 'phone',
    name: 'Recarga de Celular',
    description: 'Plan de datos y llamadas para estar conectado.',
    amount: 300,
    type: 'need',
    icon: '📱',
    urgency: 4,
    wellbeingImpact: -15,
    recurring: true,
    consequence:
      'Sin teléfono pierdes comunicación con trabajo. -15 bienestar.',
  },
  {
    id: 'laundry',
    name: 'Lavandería',
    description:
      'Ya no tienes ropa limpia. Necesitas lavar urgente.',
    amount: 120,
    type: 'need',
    icon: '👕',
    urgency: 2,
    wellbeingImpact: -10,
    recurring: false,
    consequence:
      'Sin ropa limpia para trabajar. Vergüenza social. -10 bienestar.',
  },

  // ========== GUSTOS (OPCIONALES PERO MEJORAN CALIDAD DE VIDA) ==========
  {
    id: 'netflix',
    name: 'Suscripción Netflix',
    description:
      'Tu entretenimiento favorito después del trabajo.',
    amount: 200,
    type: 'want',
    icon: '📺',
    urgency: 7,
    wellbeingImpact: -5,
    recurring: true,
    consequence:
      'Sin entretenimiento, pero es tolerable. -5 bienestar.',
  },
  {
    id: 'coffee_shop',
    name: 'Café en Cafetería',
    description:
      'Tu ritual matutino favorito. No es necesario, pero te alegra el día.',
    amount: 85,
    type: 'want',
    icon: '☕',
    urgency: 7,
    wellbeingImpact: -3,
    recurring: false,
    consequence: 'Te lo saltas. Pequeña decepción. -3 bienestar.',
  },
  {
    id: 'restaurant',
    name: 'Cena en Restaurante',
    description:
      'Tus amigos te invitaron a cenar. Puedes cocinar en casa si quieres ahorrar.',
    amount: 450,
    type: 'want',
    icon: '🍕',
    urgency: 1,
    wellbeingImpact: -8,
    recurring: false,
    consequence:
      'Te quedas en casa. Pierdes momento social. -8 bienestar.',
  },
  {
    id: 'concert',
    name: 'Boleto de Concierto',
    description:
      'Tu banda favorita viene a la ciudad. Solo este fin de semana.',
    amount: 800,
    type: 'want',
    icon: '🎸',
    urgency: 2,
    wellbeingImpact: -12,
    recurring: false,
    consequence: 'Te lo pierdes. FOMO real. -12 bienestar.',
  },
  {
    id: 'gym',
    name: 'Membresía Gimnasio',
    description:
      'Ejercicio para mantenerte saludable y liberar estrés.',
    amount: 500,
    type: 'want',
    icon: '💪',
    urgency: 5,
    wellbeingImpact: -10,
    recurring: true,
    consequence:
      'Sin ejercicio, más estrés acumulado. -10 bienestar.',
  },
  {
    id: 'game',
    name: 'Videojuego Nuevo',
    description:
      'El juego que todos están jugando. Puedes esperarte al descuento.',
    amount: 1200,
    type: 'want',
    icon: '🎮',
    urgency: 7,
    wellbeingImpact: -5,
    recurring: false,
    consequence:
      'Lo compras después. No pasa nada grave. -5 bienestar.',
  },
  {
    id: 'clothes',
    name: 'Ropa Nueva',
    description:
      'Viste ropa padre en oferta. No la necesitas pero te gusta.',
    amount: 650,
    type: 'want',
    icon: '👟',
    urgency: 5,
    wellbeingImpact: -6,
    recurring: false,
    consequence:
      'No la compras. Leve decepción. -6 bienestar.',
  },
  {
    id: 'books',
    name: 'Libros/Cursos',
    description:
      'Material educativo para mejorar tus habilidades.',
    amount: 400,
    type: 'want',
    icon: '📚',
    urgency: 7,
    wellbeingImpact: -7,
    recurring: false,
    consequence:
      'Puedes aprender gratis en internet. -7 bienestar.',
  },
  {
    id: 'birthday_gift',
    name: 'Regalo de Cumpleaños',
    description:
      'Es el cumpleaños de tu mejor amigo. Quieres darle un regalo.',
    amount: 350,
    type: 'want',
    icon: '🎁',
    urgency: 1,
    wellbeingImpact: -10,
    recurring: false,
    consequence:
      'Llegas sin regalo. Momento incómodo. -10 bienestar.',
  },
  {
    id: 'streaming_music',
    name: 'Spotify Premium',
    description:
      'Música sin anuncios mientras trabajas.',
    amount: 120,
    type: 'want',
    icon: '🎵',
    urgency: 7,
    wellbeingImpact: -4,
    recurring: true,
    consequence:
      'Versión gratis con anuncios. Molesto pero funcional. -4 bienestar.',
  },
  {
    id: 'fast_food',
    name: 'Comida Rápida',
    description:
      'Llegas cansado del trabajo. Pedir comida es tentador.',
    amount: 180,
    type: 'want',
    icon: '🍔',
    urgency: 7,
    wellbeingImpact: -5,
    recurring: false,
    consequence:
      'Cocinas en casa. Más trabajo pero más barato. -5 bienestar.',
  },
];
