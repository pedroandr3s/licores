export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  { q: '¿Cómo compro en MIXMARKET?', a: 'Agrega tus productos al carrito, elige si quieres despacho o retiro en tienda, completa tus datos y escoge un método de pago. Recibirás el número de tu pedido al finalizar.' },
  { q: '¿Cuánto cuesta el despacho?', a: 'El despacho a domicilio cuesta $3.990 y es gratis en compras desde $30.000 o cuando todos tus productos tienen la insignia "Envío gratis". El retiro en tienda siempre es gratis.' },
  { q: '¿En cuánto tiempo llega mi pedido?', a: 'Los despachos llegan entre 2 y 4 días hábiles según tu comuna. El retiro en tienda está disponible desde 2 horas después de confirmar tu compra.' },
  { q: '¿Cómo funciona el retiro en tienda?', a: 'Selecciona una tienda al comprar. Te avisaremos cuando tu pedido esté listo y solo debes presentar tu número de pedido y tu cédula de identidad.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Tarjetas de crédito y débito, transferencia bancaria y Webpay. En esta demostración ningún pago es real y no se procesan datos de tarjetas.' },
  { q: '¿Puedo cambiar o devolver un producto?', a: 'Tienes 30 días desde la recepción para solicitar cambios o devoluciones, con el producto sin uso y en su empaque original. Puedes gestionarlo en cualquiera de nuestras tiendas.' },
  { q: '¿Cómo acumulo puntos en el Club MIXMARKET?', a: 'Por cada $100 de compra sumas 1 punto. Puedes canjearlos por vales de compra, despachos gratis y productos exclusivos.' },
  { q: '¿Cómo sigo mi pedido?', a: 'Entra a Mis pedidos para ver el estado de cada compra: pedido recibido, preparando, listo para retiro o en camino, y entregado.' },
  { q: '¿Qué pasa si un producto está agotado?', a: 'Los productos agotados aparecen marcados y no se pueden agregar al carrito. Algunos pueden estar disponibles solo en ciertas tiendas.' },
  { q: '¿Esto es una tienda real?', a: 'No. MIXMARKET es una demostración de e-commerce con datos ficticios: no hay inventario, pagos ni despachos reales.' },
];

export interface InfoPage {
  slug: string;
  title: string;
  description: string;
  sections: { heading: string; body: string }[];
}

export const infoPages: InfoPage[] = [
  {
    slug: 'quienes-somos',
    title: 'Quiénes somos',
    description: 'Conoce la historia y los valores de MIXMARKET.',
    sections: [
      { heading: 'Todo lo que buscas, en un solo lugar', body: 'MIXMARKET nació en San Carlos con una idea simple: reunir en una sola tienda los productos del día a día, con buenos precios y una forma de comprar sin vueltas. Hoy tenemos cinco tiendas en Ñuble y una tienda online que funciona igual de bien desde el celular.' },
      { heading: 'Lo que nos importa', body: 'Precios claros, entrega confiable y atención cercana. Por eso mostramos la disponibilidad de cada producto en cada tienda y te dejamos elegir cómo recibir tu compra.' },
      { heading: 'Una demostración', body: 'Este sitio es un mockup ficticio construido para mostrar cómo funciona una plataforma de retail. Las marcas, productos, tiendas y precios son inventados.' },
    ],
  },
  {
    slug: 'trabaja-con-nosotros',
    title: 'Trabaja con nosotros',
    description: 'Súmate al equipo de MIXMARKET.',
    sections: [
      { heading: 'Buscamos personas que quieran crecer', body: 'Estamos formando equipos en tiendas, logística y atención al cliente. Valoramos las ganas de aprender por sobre la experiencia previa.' },
      { heading: 'Beneficios', body: 'Descuento permanente de colaborador, horarios compatibles con estudios, capacitaciones pagadas y puntos Club MIXMARKET para tu familia.' },
      { heading: 'Cómo postular', body: 'Escríbenos a personas@mixmarket.example con tu nombre, tienda de interés y un breve resumen de tu experiencia. Este correo es ficticio: la postulación no se envía a ningún lugar.' },
    ],
  },
  {
    slug: 'contacto',
    title: 'Contacto',
    description: 'Canales de atención al cliente de MIXMARKET.',
    sections: [
      { heading: 'Servicio al cliente', body: 'Atendemos de lunes a sábado de 09:00 a 19:00. Teléfono: +56 42 220 0000. Correo: ayuda@mixmarket.example. Datos ficticios para fines de demostración.' },
      { heading: 'En tienda', body: 'Puedes acercarte a cualquiera de nuestras tiendas para consultas, cambios y retiros. Revisa horarios y direcciones en la sección Tiendas.' },
      { heading: 'Tu pedido', body: 'Si tienes dudas sobre un pedido, ten a mano tu número (por ejemplo MM-20261005-48291) y escríbenos. Lo revisaremos en menos de 24 horas.' },
    ],
  },
  {
    slug: 'terminos-y-condiciones',
    title: 'Términos y condiciones',
    description: 'Condiciones de uso del sitio de demostración MIXMARKET.',
    sections: [
      { heading: 'Alcance', body: 'Este sitio es una demostración sin fines comerciales. No se realizan ventas, cobros ni despachos reales, y toda la información mostrada es ficticia.' },
      { heading: 'Datos personales', body: 'La información que ingreses en formularios (datos de contacto, direcciones, tarjetas de prueba) no se envía a ningún servidor. Solo se guarda en el almacenamiento local de tu navegador y puedes borrarla en cualquier momento.' },
      { heading: 'Precios y stock', body: 'Los precios, descuentos y la disponibilidad son datos de ejemplo y pueden cambiar sin aviso.' },
    ],
  },
  {
    slug: 'politicas-de-despacho',
    title: 'Políticas de despacho',
    description: 'Costos, plazos y cobertura de despacho de MIXMARKET.',
    sections: [
      { heading: 'Costos', body: 'El despacho a domicilio cuesta $3.990. Es gratis en compras desde $30.000 y en productos con insignia "Envío gratis". El retiro en tienda no tiene costo.' },
      { heading: 'Plazos', body: 'Entre 2 y 4 días hábiles desde la confirmación de tu compra. No realizamos despachos los domingos ni festivos.' },
      { heading: 'Cobertura', body: 'Despachamos a las regiones de Ñuble, Biobío, Maule, O\'Higgins, Metropolitana, Valparaíso y La Araucanía. Algunos productos están disponibles solo para retiro en tienda.' },
    ],
  },
  {
    slug: 'cambios-y-devoluciones',
    title: 'Cambios y devoluciones',
    description: 'Cómo cambiar o devolver un producto de MIXMARKET.',
    sections: [
      { heading: 'Plazo', body: 'Tienes 30 días corridos desde la recepción del producto para solicitar un cambio o devolución.' },
      { heading: 'Condiciones', body: 'El producto debe estar sin uso, con su empaque original y acompañado de su boleta o número de pedido. Productos de higiene personal abiertos y alimentos no tienen cambio, salvo falla de fábrica.' },
      { heading: 'Cómo hacerlo', body: 'Acércate a cualquier tienda MIXMARKET con tu producto y tu número de pedido. El reembolso se realiza por el mismo medio de pago utilizado.' },
    ],
  },
];

export const getInfoPage = (slug: string) => infoPages.find((p) => p.slug === slug);
