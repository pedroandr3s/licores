export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  { q: '¿Cómo compro en Oasis?', a: 'Agrega tus productos al carrito, elige el día de retiro, completa tus datos y escoge un método de pago. Recibirás el número de tu pedido al finalizar.' },
  { q: '¿Hacen despacho a domicilio?', a: 'No. Tenemos un único local en Quirihue y todas las compras son con retiro en tienda, sin costo.' },
  { q: '¿En cuánto tiempo está listo mi pedido?', a: 'Normalmente en 1 hora desde que confirmas tu compra, dentro del horario de atención del local. Si compras con el local cerrado, estará listo al abrir.' },
  { q: '¿Qué necesito para retirar?', a: 'Tu número de pedido y tu cédula de identidad vigente. Debes ser mayor de 18 años: si pides alcohol y no puedes acreditar tu edad, no podremos entregarte el pedido.' },
  { q: '¿Puede retirar otra persona?', a: 'Sí, siempre que sea mayor de 18 años, lleve su cédula y el número de pedido. Si el pedido incluye alcohol, la edad se verifica con la cédula de quien retira.' },
  { q: '¿Venden alcohol a menores de edad?', a: 'Nunca. La venta de bebidas alcohólicas a menores de 18 años está prohibida. Al entrar al sitio, al pagar y al retirar verificamos que eres mayor de edad.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Tarjetas de crédito y débito, transferencia, Webpay o pago en tienda al retirar. En esta demostración ningún pago es real y no se procesan datos de tarjetas.' },
  { q: '¿Puedo cambiar o devolver un producto?', a: 'Revisa tu pedido al retirarlo. Aceptamos cambios por botellas dañadas, envases defectuosos o fallas de fábrica. Los productos abiertos o que requieren frío no tienen cambio.' },
  { q: '¿Cómo acumulo puntos en el Club Oasis?', a: 'Por cada $100 de compra sumas 1 punto. Puedes canjearlos por vales de compra y productos. Los canjes son para mayores de 18 años.' },
  { q: '¿Cómo sigo mi pedido?', a: 'Entra a Mis pedidos para ver el estado de cada compra: recibido, preparando, listo para retiro y retirado.' },
  { q: '¿Esto es una tienda real?', a: 'No. Oasis es una demostración de e-commerce con datos ficticios: no hay inventario, pagos ni ventas reales de alcohol.' },
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
    description: 'Conoce la historia y los valores de Oasis.',
    sections: [
      { heading: 'Un solo local, bien surtido', body: 'Oasis nació en Quirihue con una idea simple: reunir en un solo lugar cervezas, vinos, destilados y todo el picoteo para la junta, con buenos precios y retiro rápido. Tenemos un único local y una tienda online para reservar tu pedido y retirarlo sin filas.' },
      { heading: 'Consumo responsable', body: 'Solo vendemos a mayores de 18 años y verificamos la edad al retirar. Si vas a beber, no manejes: designa un conductor o usa transporte seguro.' },
      { heading: 'Una demostración', body: 'Este sitio es un mockup ficticio construido para mostrar cómo funciona una tienda de licores con retiro en local. Las marcas, productos, precios y el local son inventados.' },
    ],
  },
  {
    slug: 'trabaja-con-nosotros',
    title: 'Trabaja con nosotros',
    description: 'Súmate al equipo de Oasis.',
    sections: [
      { heading: 'Buscamos personas responsables', body: 'Necesitamos gente mayor de 18 años para atención en el local y preparación de pedidos. Valoramos el buen trato y las ganas de aprender sobre vinos, cervezas y destilados.' },
      { heading: 'Beneficios', body: 'Capacitaciones pagadas en servicio responsable de alcohol, descuento de colaborador y horarios compatibles con estudios.' },
      { heading: 'Cómo postular', body: 'Escríbenos a personas@oasis.example con tu nombre y un breve resumen de tu experiencia. Este correo es ficticio: la postulación no se envía a ningún lugar.' },
    ],
  },
  {
    slug: 'contacto',
    title: 'Contacto',
    description: 'Canales de atención al cliente de Oasis.',
    sections: [
      { heading: 'Atención al cliente', body: 'Atendemos durante el horario del local. Teléfono: +56 42 220 1450. Correo: ayuda@oasis.example. Datos ficticios para fines de demostración.' },
      { heading: 'En el local', body: "Avenida Prat 813, Quirihue. Puedes pasar por consultas, retiros y reclamos. Revisa los horarios en la sección Nuestro local." },
      { heading: 'Tu pedido', body: 'Si tienes dudas sobre un pedido, ten a mano tu número (por ejemplo ML-20261005-48291) y escríbenos. Lo revisaremos en menos de 24 horas.' },
    ],
  },
  {
    slug: 'terminos-y-condiciones',
    title: 'Términos y condiciones',
    description: 'Condiciones de uso del sitio de demostración Oasis.',
    sections: [
      { heading: 'Alcance', body: 'Este sitio es una demostración sin fines comerciales. No se realizan ventas, cobros ni entregas reales, y toda la información mostrada es ficticia.' },
      { heading: 'Venta de alcohol', body: 'La venta de bebidas alcohólicas está prohibida a menores de 18 años. Al comprar declaras ser mayor de edad y aceptas acreditarlo con tu cédula de identidad al retirar. Nos reservamos el derecho de no entregar el pedido si no se puede verificar la edad.' },
      { heading: 'Datos personales', body: 'La información que ingreses en formularios (datos de contacto, tarjetas de prueba) no se envía a ningún servidor. Solo se guarda en el almacenamiento local de tu navegador y puedes borrarla en cualquier momento.' },
      { heading: 'Precios y stock', body: 'Los precios, descuentos y la disponibilidad son datos de ejemplo y pueden cambiar sin aviso.' },
    ],
  },
  {
    slug: 'politicas-de-retiro',
    title: 'Políticas de retiro',
    description: 'Cómo, cuándo y con qué documentos retirar tu pedido en Oasis.',
    sections: [
      { heading: 'Solo retiro en tienda', body: "No hacemos despacho a domicilio ni reparto. Todos los pedidos se retiran en Botillería Oasis (Avenida Prat 813), sin costo." },
      { heading: 'Plazos', body: 'Tu pedido queda listo en 1 hora dentro del horario del local. Lo guardamos hasta 48 horas desde el día de retiro que elegiste; pasado ese plazo se anula.' },
      { heading: 'Qué debes llevar', body: 'Tu número de pedido y tu cédula de identidad vigente. Si el pedido incluye alcohol, quien retira debe ser mayor de 18 años y acreditarlo; si no es posible, no se entrega el pedido.' },
      { heading: 'Pago en tienda', body: 'Puedes elegir pagar al retirar, con tarjeta o efectivo. Si no retiras tu pedido, no se te cobra nada.' },
    ],
  },
  {
    slug: 'cambios-y-devoluciones',
    title: 'Cambios y devoluciones',
    description: 'Cómo cambiar o devolver un producto de Oasis.',
    sections: [
      { heading: 'Revisa al retirar', body: 'Te recomendamos revisar tus productos en el mostrador. Los reclamos por botellas rotas, envases dañados o productos equivocados se resuelven en el momento.' },
      { heading: 'Cuándo aceptamos cambios', body: 'Hasta 7 días después del retiro, por fallas de fábrica o productos defectuosos, con el envase y la boleta. No hay cambios en productos abiertos, refrigerados ni por gusto.' },
      { heading: 'Cómo hacerlo', body: 'Acércate al local con tu producto y tu número de pedido. El reembolso se realiza por el mismo medio de pago utilizado.' },
    ],
  },
];

export const getInfoPage = (slug: string) => infoPages.find((p) => p.slug === slug);
