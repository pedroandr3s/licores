import type { CategorySlug, Product, ProductShape } from '@/types';

interface Def {
  id: string;
  name: string;
  brand: string;
  cat: CategorySlug;
  sub: string;
  desc: string;
  feats: string[];
  price: number;
  orig: number;
  shape: ProductShape;
  colors: [string, string];
  rating: number;
  reviews: number;
  stock: number;
  sold: number;
  tags: string;
  featured?: boolean;
  isNew?: boolean;
  free?: boolean;
  delivery?: boolean;
  pickup?: boolean;
}

const defs: Def[] = [
  // ───────────── Perfumería ─────────────
  {
    id: 'perfume-noir-intense', name: 'Perfume Noir Intense EDP 100 ml', brand: 'Maison Noir', cat: 'perfumeria', sub: 'Perfumes hombre',
    desc: 'Eau de parfum intensa con salida de bergamota y pimienta negra, corazón de lavanda y fondo ambarado de vainilla y maderas oscuras. Larga duración, ideal para noche y ocasiones especiales.',
    feats: ['Concentración Eau de Parfum', 'Frasco de vidrio de 100 ml', 'Notas amaderadas y ambaradas', 'Duración estimada de 8 a 10 horas'],
    price: 19990, orig: 39990, shape: 'perfume', colors: ['#1d1b34', '#d4a62a'], rating: 4.8, reviews: 1284, stock: 46, sold: 3120,
    tags: 'perfume fragancia eau de parfum hombre noche regalo', featured: true, free: true,
  },
  {
    id: 'eau-de-parfum-rosa-velvet', name: 'Eau de Parfum Rosa Velvet 75 ml', brand: 'Lumière', cat: 'perfumeria', sub: 'Perfumes mujer',
    desc: 'Floral y envolvente: rosa de damasco, peonía y un fondo suave de almizcle blanco. Una fragancia elegante para el día a día.',
    feats: ['Concentración Eau de Parfum', 'Frasco de 75 ml', 'Notas florales y almizcladas', 'Incluye estuche de regalo'],
    price: 29990, orig: 44990, shape: 'perfume', colors: ['#e5578a', '#f4c6d7'], rating: 4.7, reviews: 902, stock: 28, sold: 1740,
    tags: 'perfume fragancia mujer floral rosa regalo', featured: true,
  },
  {
    id: 'colonia-aqua-fresh', name: 'Colonia Aqua Fresh 200 ml', brand: 'Brisa', cat: 'perfumeria', sub: 'Colonias',
    desc: 'Colonia cítrica y marina para refrescarte después de la ducha. Notas de limón, menta y sal marina.',
    feats: ['Formato familiar de 200 ml', 'Fragancia unisex', 'Spray con difusor fino', 'Ligera y refrescante'],
    price: 9990, orig: 15990, shape: 'perfume', colors: ['#2f9bd8', '#bfe6fa'], rating: 4.4, reviews: 516, stock: 120, sold: 1310,
    tags: 'colonia perfume fresco unisex cítrico verano',
  },
  {
    id: 'perfume-oud-royal', name: 'Perfume Oud Royal EDP 100 ml', brand: 'Maison Noir', cat: 'perfumeria', sub: 'Perfumes hombre',
    desc: 'Inspirado en las fragancias de Oriente Medio: oud, azafrán y ámbar. Una firma olfativa profunda y sofisticada.',
    feats: ['Concentración Eau de Parfum', 'Frasco de 100 ml', 'Notas orientales y especiadas', 'Edición de colección'],
    price: 49990, orig: 69990, shape: 'perfume', colors: ['#5b2a0a', '#d9a94b'], rating: 4.9, reviews: 388, stock: 9, sold: 690,
    tags: 'perfume oud oriental lujo hombre unisex', featured: true, free: true,
  },
  {
    id: 'body-mist-vanilla-dream', name: 'Body Mist Vanilla Dream 236 ml', brand: 'Glow Lab', cat: 'perfumeria', sub: 'Body mist',
    desc: 'Bruma corporal de vainilla cremosa y caramelo suave. Aplícala sobre la piel hidratada para una fragancia dulce y ligera.',
    feats: ['Bruma corporal de 236 ml', 'Aroma dulce a vainilla', 'Fórmula con aloe vera', 'No mancha la ropa'],
    price: 6490, orig: 12990, shape: 'pump', colors: ['#d99a4e', '#f8e3b8'], rating: 4.6, reviews: 744, stock: 85, sold: 2210,
    tags: 'body mist bruma corporal vainilla dulce', featured: true,
  },
  {
    id: 'set-perfumes-viaje-4x30', name: 'Set Perfumes de Viaje 4 x 30 ml', brand: 'Lumière', cat: 'perfumeria', sub: 'Sets de regalo',
    desc: 'Cuatro fragancias icónicas en formato viaje, listas para llevar en la cartera. El regalo perfecto para descubrir tu favorita.',
    feats: ['4 perfumes de 30 ml', 'Caja de regalo incluida', 'Formato apto para cabina de avión', 'Fragancias unisex y femeninas'],
    price: 17490, orig: 34990, shape: 'box', colors: ['#7b45f5', '#ffcf3a'], rating: 4.5, reviews: 203, stock: 7, sold: 540,
    tags: 'set perfumes regalo viaje miniatura', isNew: true,
  },

  // ───────────── Cuidado personal ─────────────
  {
    id: 'shampoo-reparacion-total', name: 'Shampoo Reparación Total 400 ml', brand: 'Verde Vivo', cat: 'cuidado-personal', sub: 'Cuidado del cabello',
    desc: 'Shampoo con keratina vegetal y aceite de argán que repara el cabello dañado desde la primera lavada. Libre de sulfatos agresivos.',
    feats: ['Con keratina vegetal y argán', 'Para cabello dañado o teñido', 'Frasco con dosificador de 400 ml', 'Sin parabenos'],
    price: 4990, orig: 6990, shape: 'pump', colors: ['#1f9d6b', '#bdeed7'], rating: 4.7, reviews: 1650, stock: 210, sold: 2890,
    tags: 'shampoo champú cabello pelo keratina reparación', featured: true,
  },
  {
    id: 'acondicionador-keratina-400', name: 'Acondicionador Keratina 400 ml', brand: 'Verde Vivo', cat: 'cuidado-personal', sub: 'Cuidado del cabello',
    desc: 'Acondicionador de acción profunda que desenreda, suaviza y aporta brillo. Complemento ideal de la línea Reparación Total.',
    feats: ['Fórmula con keratina y proteínas', 'Desenreda y suaviza', 'Frasco de 400 ml', 'Uso diario'],
    price: 4990, orig: 6990, shape: 'pump', colors: ['#2fae7a', '#d3f5e5'], rating: 4.6, reviews: 1120, stock: 180, sold: 2140,
    tags: 'acondicionador cabello pelo keratina suavizante',
  },
  {
    id: 'crema-corporal-karite-400', name: 'Crema Corporal Karité 400 ml', brand: 'Aqualia', cat: 'cuidado-personal', sub: 'Cuidado corporal',
    desc: 'Hidratación intensa por 48 horas con manteca de karité y vitamina E. Textura cremosa de rápida absorción.',
    feats: ['Manteca de karité y vitamina E', 'Hidratación por 48 horas', 'Pote de 400 ml', 'Apta para piel seca'],
    price: 6990, orig: 9990, shape: 'jar', colors: ['#f2b84b', '#fff0cf'], rating: 4.5, reviews: 612, stock: 96, sold: 1420,
    tags: 'crema corporal hidratante piel karité',
  },
  {
    id: 'desodorante-roll-on-dry-48h', name: 'Desodorante Roll-on Dry 48h Pack x3', brand: 'Frescor', cat: 'cuidado-personal', sub: 'Desodorantes',
    desc: 'Protección antitranspirante por 48 horas sin dejar manchas blancas. Pack ahorro de tres unidades.',
    feats: ['Pack de 3 unidades de 50 ml', 'Protección 48 horas', 'Sin alcohol', 'Dermatológicamente testeado'],
    price: 5490, orig: 7990, shape: 'rollon', colors: ['#3a8ee6', '#cfe5ff'], rating: 4.3, reviews: 431, stock: 140, sold: 1650,
    tags: 'desodorante antitranspirante roll on hombre mujer',
  },
  {
    id: 'pasta-dental-whitening-pack3', name: 'Pasta Dental Whitening Pack x3', brand: 'Sonríe', cat: 'cuidado-personal', sub: 'Higiene bucal',
    desc: 'Pasta dental blanqueadora con flúor y carbón activado. Elimina manchas superficiales y refresca el aliento.',
    feats: ['3 tubos de 100 g', 'Con flúor y carbón activado', 'Sabor menta fresca', 'Protección anticaries'],
    price: 5990, orig: 8990, shape: 'tube', colors: ['#16a3b8', '#d9f5f9'], rating: 4.4, reviews: 389, stock: 160, sold: 1180,
    tags: 'pasta dental dientes blanqueadora higiene bucal',
  },
  {
    id: 'jabon-liquido-manos-aloe-500', name: 'Jabón Líquido de Manos Aloe 500 ml', brand: 'Aqualia', cat: 'cuidado-personal', sub: 'Jabones',
    desc: 'Jabón líquido con aloe vera que limpia sin resecar. Aroma suave y espuma cremosa.',
    feats: ['Frasco con dosificador de 500 ml', 'Con extracto de aloe vera', 'pH balanceado', 'Biodegradable'],
    price: 2490, orig: 3990, shape: 'pump', colors: ['#49b86a', '#d8f6df'], rating: 4.2, reviews: 276, stock: 300, sold: 980,
    tags: 'jabón líquido manos aloe higiene',
  },

  // ───────────── Limpieza ─────────────
  {
    id: 'detergente-liquido-ultra-3l', name: 'Detergente Líquido Ultra 3 L', brand: 'Pulso', cat: 'limpieza', sub: 'Ropa',
    desc: 'Detergente concentrado que remueve manchas difíciles incluso en agua fría. Rinde hasta 40 lavados.',
    feats: ['Botella de 3 litros', 'Hasta 40 lavados', 'Eficaz en agua fría', 'Apto lavadoras automáticas'],
    price: 9990, orig: 14990, shape: 'jug', colors: ['#2f8de0', '#bfe0ff'], rating: 4.6, reviews: 1890, stock: 240, sold: 2760,
    tags: 'detergente líquido ropa lavado lavadora', featured: true, free: true,
  },
  {
    id: 'limpiador-multiuso-lavanda-900', name: 'Limpiador Multiuso Lavanda 900 ml', brand: 'Pulso', cat: 'limpieza', sub: 'Superficies',
    desc: 'Limpia y desinfecta pisos, mesones y baños con un delicado aroma a lavanda. Gatillo regulable.',
    feats: ['Spray de 900 ml', 'Elimina 99,9% de bacterias', 'Aroma a lavanda', 'Para múltiples superficies'],
    price: 2290, orig: 3490, shape: 'spray', colors: ['#8e63e6', '#e4d8ff'], rating: 4.4, reviews: 540, stock: 260, sold: 1530,
    tags: 'limpiador multiuso desinfectante spray superficies lavanda',
  },
  {
    id: 'lavaloza-concentrado-limon-750', name: 'Lavaloza Concentrado Limón 750 ml', brand: 'Cítrika', cat: 'limpieza', sub: 'Cocina',
    desc: 'Lavaloza concentrado con poder desengrasante y aroma a limón natural. Cuida tus manos.',
    feats: ['Botella de 750 ml', 'Alto poder desengrasante', 'Con extracto de limón', 'Cuida la piel de tus manos'],
    price: 1990, orig: 2990, shape: 'pump', colors: ['#f5c400', '#fff3b0'], rating: 4.5, reviews: 822, stock: 320, sold: 1870,
    tags: 'lavaloza lavavajillas limón cocina platos',
  },
  {
    id: 'suavizante-primavera-2-8l', name: 'Suavizante Primavera 2,8 L', brand: 'Cítrika', cat: 'limpieza', sub: 'Ropa',
    desc: 'Suavizante concentrado con microcápsulas de fragancia que mantiene tu ropa fresca por días.',
    feats: ['Botella de 2,8 litros', 'Fragancia floral duradera', 'Reduce la estática', 'Fórmula concentrada'],
    price: 4290, orig: 6490, shape: 'jug', colors: ['#ee6fa6', '#ffd9e8'], rating: 4.5, reviews: 702, stock: 150, sold: 1390,
    tags: 'suavizante ropa fragancia lavado',
  },
  {
    id: 'papel-higienico-doble-hoja-24', name: 'Papel Higiénico Doble Hoja 24 rollos', brand: 'Nube', cat: 'limpieza', sub: 'Papel y desechables',
    desc: 'Papel higiénico suave y resistente de doble hoja. Pack familiar de 24 rollos de 30 metros.',
    feats: ['24 rollos de 30 metros', 'Doble hoja', 'Hipoalergénico', 'Pack familiar'],
    price: 11990, orig: 16990, shape: 'rolls', colors: ['#5e7cf0', '#dfe6ff'], rating: 4.7, reviews: 2050, stock: 190, sold: 2410,
    tags: 'papel higiénico rollos baño familiar', featured: true, free: true,
  },

  // ───────────── Hogar ─────────────
  {
    id: 'set-sabanas-microfibra-2-plazas', name: 'Set de Sábanas Microfibra 2 Plazas', brand: 'CasaNova', cat: 'hogar', sub: 'Dormitorio',
    desc: 'Set de sábanas de microfibra ultra suave de 144 hilos. Incluye sábana bajera, encimera y dos fundas.',
    feats: ['Incluye 4 piezas', 'Microfibra de 144 hilos', 'Resistente al lavado', 'Cama 2 plazas'],
    price: 12490, orig: 24990, shape: 'sheets', colors: ['#6aa9e9', '#e0eefc'], rating: 4.5, reviews: 468, stock: 12, sold: 860,
    tags: 'sábanas cama dormitorio microfibra textil', featured: true,
  },
  {
    id: 'lampara-mesa-nordica', name: 'Lámpara de Mesa Nórdica', brand: 'CasaNova', cat: 'hogar', sub: 'Iluminación',
    desc: 'Lámpara de mesa de diseño nórdico con pantalla de tela y base de madera. Luz cálida que crea ambientes acogedores.',
    feats: ['Base de madera natural', 'Pantalla de tela', 'Compatible con ampolleta E27', 'Altura de 42 cm'],
    price: 19990, orig: 29990, shape: 'lamp', colors: ['#e0a458', '#fff1d6'], rating: 4.6, reviews: 214, stock: 6, sold: 430,
    tags: 'lámpara iluminación decoración velador nórdica',
  },
  {
    id: 'juego-ollas-antiadherentes-5', name: 'Juego de Ollas Antiadherentes 5 pzas', brand: 'Chef Línea', cat: 'hogar', sub: 'Cocina y mesa',
    desc: 'Set de cinco ollas con recubrimiento antiadherente y tapas de vidrio templado. Aptas para todo tipo de cocinas.',
    feats: ['5 piezas con tapa', 'Recubrimiento antiadherente', 'Mangos ergonómicos', 'Aptas para cocina eléctrica y a gas'],
    price: 34990, orig: 59990, shape: 'pot', colors: ['#d94b4b', '#f4cfcf'], rating: 4.6, reviews: 351, stock: 34, sold: 760,
    tags: 'ollas cocina cocinar antiadherente menaje', featured: true, free: true, delivery: false,
  },
  {
    id: 'set-tazas-ceramica-6', name: 'Set de 6 Tazas de Cerámica 300 ml', brand: 'Hogarte', cat: 'hogar', sub: 'Cocina y mesa',
    desc: 'Seis tazas de cerámica esmaltada en colores surtidos. Aptas para microondas y lavavajillas.',
    feats: ['6 tazas de 300 ml', 'Colores surtidos', 'Aptas para microondas', 'Lavables en lavavajillas'],
    price: 11990, orig: 19990, shape: 'mug', colors: ['#2ea6a0', '#d4f2ef'], rating: 4.4, reviews: 289, stock: 58, sold: 640,
    tags: 'tazas cerámica café té mesa',
  },
  {
    id: 'almohada-viscoelastica-cervical', name: 'Almohada Viscoelástica Cervical', brand: 'Descansa', cat: 'hogar', sub: 'Dormitorio',
    desc: 'Almohada ergonómica de espuma viscoelástica que se adapta a tu cuello y mejora la postura mientras duermes.',
    feats: ['Espuma viscoelástica de alta densidad', 'Funda lavable', 'Soporte cervical', 'Medidas 60 x 35 cm'],
    price: 6990, orig: 22990, shape: 'pillow', colors: ['#7b8cf0', '#e5e8ff'], rating: 4.3, reviews: 507, stock: 22, sold: 920,
    tags: 'almohada dormitorio descanso cervical viscoelástica', pickup: false,
  },
  {
    id: 'organizador-apilable-3-niveles', name: 'Organizador Apilable 3 Niveles', brand: 'Hogarte', cat: 'hogar', sub: 'Organización',
    desc: 'Torre organizadora con tres cajones transparentes. Perfecta para ropa, juguetes o artículos de baño.',
    feats: ['3 cajones transparentes', 'Fácil de armar sin herramientas', 'Plástico resistente', 'Altura de 78 cm'],
    price: 10990, orig: 17990, shape: 'box', colors: ['#2fb3e8', '#d3f0fc'], rating: 4.2, reviews: 134, stock: 44, sold: 310,
    tags: 'organizador cajones orden almacenamiento', isNew: true,
  },

  // ───────────── Tecnología ─────────────
  {
    id: 'audifonos-bluetooth-airwave-pro', name: 'Audífonos Bluetooth AirWave Pro', brand: 'Sonora', cat: 'tecnologia', sub: 'Audio',
    desc: 'Audífonos inalámbricos con cancelación activa de ruido, 40 horas de batería y micrófono con claridad de voz.',
    feats: ['Cancelación activa de ruido', 'Hasta 40 horas de batería', 'Bluetooth 5.3', 'Carga rápida USB-C'],
    price: 29990, orig: 49990, shape: 'headphones', colors: ['#3b3f6e', '#7ee0d2'], rating: 4.7, reviews: 1432, stock: 64, sold: 2200,
    tags: 'audífonos auriculares bluetooth inalámbricos música', featured: true, free: true,
  },
  {
    id: 'parlante-portatil-boomgo-20w', name: 'Parlante Portátil BoomGo 20 W', brand: 'Sonora', cat: 'tecnologia', sub: 'Audio',
    desc: 'Parlante Bluetooth resistente al agua con sonido envolvente de 20 W y luces LED. Hasta 12 horas de reproducción.',
    feats: ['Potencia de 20 W', 'Resistente al agua IPX6', 'Hasta 12 horas de batería', 'Conexión Bluetooth y auxiliar'],
    price: 39990, orig: 59990, shape: 'speaker', colors: ['#e0483a', '#2a2a3d'], rating: 4.6, reviews: 876, stock: 38, sold: 1210,
    tags: 'parlante bluetooth altavoz música portátil', featured: true, free: true,
  },
  {
    id: 'smartwatch-fitline-s2', name: 'Smartwatch FitLine S2', brand: 'Volt', cat: 'tecnologia', sub: 'Wearables',
    desc: 'Reloj inteligente con pantalla AMOLED, monitor de actividad, sueño y más de 100 modos deportivos. Notificaciones en tu muñeca.',
    feats: ['Pantalla AMOLED de 1,8"', 'Monitor de sueño y actividad', 'Resistente al agua 5 ATM', 'Batería de hasta 10 días'],
    price: 44990, orig: 79990, shape: 'watch', colors: ['#6f6bf0', '#1c1c33'], rating: 4.5, reviews: 342, stock: 14, sold: 780,
    tags: 'smartwatch reloj inteligente deporte fitness', isNew: true, free: true, featured: true,
  },
  {
    id: 'power-bank-20000-usb-c', name: 'Power Bank 20.000 mAh USB-C', brand: 'Volt', cat: 'tecnologia', sub: 'Cargadores y baterías',
    desc: 'Batería externa de alta capacidad con carga rápida de 22,5 W y tres puertos. Carga tu teléfono hasta 4 veces.',
    feats: ['Capacidad de 20.000 mAh', 'Carga rápida de 22,5 W', '3 puertos de salida', 'Indicador LED de carga'],
    price: 17990, orig: 29990, shape: 'powerbank', colors: ['#1d3fd1', '#7fe3ff'], rating: 4.6, reviews: 995, stock: 77, sold: 1670,
    tags: 'power bank batería externa cargador portátil celular',
  },
  {
    id: 'cargador-rapido-usb-c-45w', name: 'Cargador Rápido USB-C 45 W', brand: 'Volt', cat: 'tecnologia', sub: 'Cargadores y baterías',
    desc: 'Cargador compacto de 45 W compatible con notebooks, tablets y smartphones. Tecnología GaN de baja temperatura.',
    feats: ['Potencia de 45 W', 'Tecnología GaN', 'Compatible con notebook y celular', 'Protección contra sobrecarga'],
    price: 11990, orig: 19990, shape: 'box', colors: ['#2b2b45', '#5ee6a8'], rating: 4.5, reviews: 466, stock: 90, sold: 1040,
    tags: 'cargador usb-c carga rápida notebook celular', isNew: true,
  },
  {
    id: 'mouse-inalambrico-ergonomico', name: 'Mouse Inalámbrico Ergonómico', brand: 'Nexo', cat: 'tecnologia', sub: 'Computación',
    desc: 'Mouse inalámbrico de diseño ergonómico con sensor de 1600 DPI y clics silenciosos. Receptor USB nano.',
    feats: ['Conexión inalámbrica 2,4 GHz', 'Sensor de 1600 DPI', 'Clics silenciosos', 'Batería de hasta 12 meses'],
    price: 7490, orig: 24990, shape: 'mouse', colors: ['#475569', '#38bdf8'], rating: 4.2, reviews: 318, stock: 52, sold: 880,
    tags: 'mouse inalámbrico computador oficina ergonómico',
  },

  // ───────────── Snacks ─────────────
  {
    id: 'papas-fritas-crunchy-250', name: 'Papas Fritas Crunchy Clásicas 250 g', brand: 'Crunchy Co.', cat: 'snacks', sub: 'Salados',
    desc: 'Papas fritas cortadas en rodajas finas y crocantes, con sal de mar. Formato familiar para compartir.',
    feats: ['Bolsa de 250 g', 'Sal de mar', 'Aceite vegetal', 'Ideales para compartir'],
    price: 2490, orig: 3490, shape: 'bag', colors: ['#f2a900', '#fff0b8'], rating: 4.6, reviews: 1320, stock: 400, sold: 2150,
    tags: 'papas fritas snack salado picoteo', featured: true,
  },
  {
    id: 'mix-frutos-secos-premium-500', name: 'Mix Frutos Secos Premium 500 g', brand: 'Campo Real', cat: 'snacks', sub: 'Frutos secos',
    desc: 'Mezcla de almendras, nueces, castañas de cajú y pasas rubias seleccionadas. Energía natural para tu día.',
    feats: ['Bolsa de 500 g', 'Sin sal agregada', 'Almendras, nueces y cajú', 'Fuente de fibra'],
    price: 6990, orig: 9990, shape: 'bag', colors: ['#a86a2f', '#f1dcc0'], rating: 4.7, reviews: 640, stock: 110, sold: 1450,
    tags: 'frutos secos mix nueces almendras snack saludable',
  },
  {
    id: 'galletas-choco-chips-x12', name: 'Galletas Choco Chips Pack x12', brand: 'Dulce Hogar', cat: 'snacks', sub: 'Dulces',
    desc: 'Galletas con trozos de chocolate semi amargo, horneadas con mantequilla. Pack de 12 paquetes individuales.',
    feats: ['12 paquetes individuales', 'Con trozos de chocolate', 'Receta con mantequilla', 'Ideales para la colación'],
    price: 3990, orig: 5990, shape: 'box', colors: ['#7a4326', '#f3c98b'], rating: 4.5, reviews: 573, stock: 230, sold: 1620,
    tags: 'galletas chocolate dulce colación snack', isNew: true,
  },
  {
    id: 'barras-proteicas-chocolate-x12', name: 'Barras Proteicas Chocolate Pack x12', brand: 'FitBite', cat: 'snacks', sub: 'Barras',
    desc: 'Barras con 20 g de proteína y bajo contenido de azúcar. Sabor chocolate con cobertura crocante.',
    feats: ['12 barras de 45 g', '20 g de proteína por barra', 'Bajas en azúcar', 'Sin gluten'],
    price: 11990, orig: 17990, shape: 'box', colors: ['#2c8a6e', '#b7ecd9'], rating: 4.3, reviews: 241, stock: 0, sold: 590,
    tags: 'barras proteicas fitness proteína snack deporte',
  },
  {
    id: 'chocolate-70-cacao-pack3', name: 'Chocolate 70% Cacao Pack x3', brand: 'Cacao Sur', cat: 'snacks', sub: 'Dulces',
    desc: 'Chocolate amargo con 70% de cacao de origen, elaborado en pequeños lotes. Intenso y con notas a frutos rojos.',
    feats: ['3 barras de 100 g', '70% cacao', 'Sin aceite de palma', 'Cacao de origen'],
    price: 4990, orig: 7990, shape: 'box', colors: ['#4a2a1a', '#c98b4f'], rating: 4.8, reviews: 418, stock: 140, sold: 1090,
    tags: 'chocolate cacao amargo dulce regalo',
  },

  // ───────────── Bebidas ─────────────
  {
    id: 'agua-mineral-sin-gas-6x1-5', name: 'Agua Mineral sin Gas 6 x 1,5 L', brand: 'Vertiente', cat: 'bebidas', sub: 'Aguas',
    desc: 'Agua mineral natural sin gas de vertiente cordillerana. Pack de seis botellas para toda la semana.',
    feats: ['6 botellas de 1,5 litros', 'Sin gas', 'Baja en sodio', 'Botella reciclable'],
    price: 4990, orig: 6990, shape: 'drink', colors: ['#2fa7e6', '#d6f0ff'], rating: 4.6, reviews: 980, stock: 350, sold: 1980,
    tags: 'agua mineral sin gas bebida pack',
  },
  {
    id: 'nectar-durazno-1-5l-pack6', name: 'Néctar de Durazno 1,5 L Pack x6', brand: 'Campo Real', cat: 'bebidas', sub: 'Jugos y néctares',
    desc: 'Néctar con pulpa de durazno de la zona central. Sin colorantes artificiales, pack de seis botellas.',
    feats: ['6 botellas de 1,5 litros', 'Con pulpa de fruta', 'Sin colorantes artificiales', 'Para toda la familia'],
    price: 7990, orig: 11990, shape: 'drink', colors: ['#f08a3a', '#ffe1c2'], rating: 4.4, reviews: 457, stock: 160, sold: 1210,
    tags: 'néctar jugo durazno bebida pack',
  },
  {
    id: 'cafe-grano-tostado-1kg', name: 'Café en Grano Tostado 1 kg', brand: 'Altura', cat: 'bebidas', sub: 'Café',
    desc: 'Café 100% arábica de tostado medio con notas a chocolate y avellana. Perfecto para máquina espresso y prensa francesa.',
    feats: ['Bolsa de 1 kg', '100% arábica', 'Tostado medio', 'Válvula de frescura'],
    price: 13990, orig: 19990, shape: 'bag', colors: ['#5c3a21', '#d9b48a'], rating: 4.8, reviews: 733, stock: 72, sold: 1360,
    tags: 'café grano arábica espresso bebida',
  },
  {
    id: 'vino-reserva-cabernet-750', name: 'Vino Reserva Cabernet Sauvignon 750 ml', brand: 'Valle Antiguo', cat: 'bebidas', sub: 'Vinos',
    desc: 'Cabernet Sauvignon de cosecha reserva con crianza en barricas. Aromas a cassis y vainilla, taninos suaves.',
    feats: ['Botella de 750 ml', 'Cosecha reserva', 'Crianza en barrica', 'Valle del Maule'],
    price: 6990, orig: 9990, shape: 'wine', colors: ['#6d1230', '#e9d3a2'], rating: 4.5, reviews: 392, stock: 98, sold: 1010,
    tags: 'vino tinto cabernet sauvignon reserva alcohol', delivery: false, featured: true,
  },
  {
    id: 'bebida-cola-sin-azucar-6x500', name: 'Bebida Cola Sin Azúcar 6 x 500 ml', brand: 'Burbuja', cat: 'bebidas', sub: 'Bebidas',
    desc: 'Bebida cola cero azúcar con todo el sabor de siempre. Pack de seis latas listas para enfriar.',
    feats: ['6 latas de 500 ml', 'Cero azúcar', 'Cero calorías', 'Lata reciclable'],
    price: 3990, orig: 5990, shape: 'can', colors: ['#2a2a3d', '#e0483a'], rating: 4.3, reviews: 612, stock: 280, sold: 1340,
    tags: 'bebida cola cero azúcar gaseosa lata',
  },

  // ───────────── Mascotas ─────────────
  {
    id: 'alimento-perro-adulto-15kg', name: 'Alimento Perro Adulto Carne y Arroz 15 kg', brand: 'PetPal', cat: 'mascotas', sub: 'Perros',
    desc: 'Alimento completo para perros adultos con carne, arroz y vegetales. Favorece la digestión y mantiene un pelaje brillante.',
    feats: ['Saco de 15 kg', 'Proteína de carne real', 'Con omega 3 y 6', 'Para razas medianas y grandes'],
    price: 34990, orig: 49990, shape: 'bag', colors: ['#c9622b', '#ffe0c7'], rating: 4.7, reviews: 1180, stock: 60, sold: 1560,
    tags: 'alimento perro comida mascota croquetas adulto', featured: true, free: true, pickup: false,
  },
  {
    id: 'alimento-gato-adulto-salmon-7-5kg', name: 'Alimento Gato Adulto Salmón 7,5 kg', brand: 'PetPal', cat: 'mascotas', sub: 'Gatos',
    desc: 'Alimento balanceado para gatos adultos con salmón y taurina. Cuida el sistema urinario y el pelaje.',
    feats: ['Saco de 7,5 kg', 'Con salmón y taurina', 'Control de bolas de pelo', 'Cuida la salud urinaria'],
    price: 24990, orig: 34990, shape: 'bag', colors: ['#3b82c4', '#d8eafa'], rating: 4.6, reviews: 702, stock: 48, sold: 1120,
    tags: 'alimento gato comida mascota salmón felino', free: true,
  },
  {
    id: 'arena-sanitaria-aglomerante-10kg', name: 'Arena Sanitaria Aglomerante 10 kg', brand: 'Michi Clean', cat: 'mascotas', sub: 'Gatos',
    desc: 'Arena de bentonita que forma bloques compactos y controla los olores hasta por 10 días.',
    feats: ['Saco de 10 kg', 'Aglomerante', 'Control de olores', 'Baja generación de polvo'],
    price: 8990, orig: 12990, shape: 'bag', colors: ['#8b7355', '#eadfcc'], rating: 4.4, reviews: 458, stock: 85, sold: 970,
    tags: 'arena sanitaria gato mascota higiene bentonita',
  },
  {
    id: 'shampoo-perro-avena-500', name: 'Shampoo para Perros Avena 500 ml', brand: 'PetPal', cat: 'mascotas', sub: 'Perros',
    desc: 'Shampoo suave con avena coloidal para pieles sensibles. Limpia, desenreda y deja un aroma fresco.',
    feats: ['Frasco de 500 ml', 'Con avena coloidal', 'pH adecuado para perros', 'Para todas las razas'],
    price: 4990, orig: 7990, shape: 'pump', colors: ['#d19a3a', '#fbe9c6'], rating: 4.5, reviews: 321, stock: 110, sold: 760,
    tags: 'shampoo perro mascota baño avena',
  },
  {
    id: 'comedero-antideslizante-doble-acero', name: 'Comedero Antideslizante Doble Acero', brand: 'Huellitas', cat: 'mascotas', sub: 'Accesorios',
    desc: 'Comedero doble de acero inoxidable con base de goma antideslizante. Uno para agua y otro para alimento.',
    feats: ['Dos cuencos de 350 ml', 'Acero inoxidable', 'Base antideslizante', 'Fácil de lavar'],
    price: 9990, orig: 14990, shape: 'bowl', colors: ['#6b7c93', '#d3dbe6'], rating: 4.4, reviews: 188, stock: 66, sold: 420,
    tags: 'comedero bebedero perro gato mascota accesorio', isNew: true,
  },

  // ───────────── Belleza ─────────────
  {
    id: 'labial-mate-cherry', name: 'Labial Mate Larga Duración Cherry', brand: 'Glow Lab', cat: 'belleza', sub: 'Maquillaje labios',
    desc: 'Labial de acabado mate aterciopelado y color intenso. Hasta 12 horas de duración sin resecar los labios.',
    feats: ['Acabado mate', 'Hasta 12 horas de duración', 'Con vitamina E', 'Tono Cherry'],
    price: 4490, orig: 8990, shape: 'lipstick', colors: ['#c4163f', '#2a2a3d'], rating: 4.6, reviews: 1043, stock: 150, sold: 1950,
    tags: 'labial maquillaje labios mate rojo belleza', featured: true,
  },
  {
    id: 'paleta-sombras-sunset-12', name: 'Paleta de Sombras Sunset 12 Tonos', brand: 'Glow Lab', cat: 'belleza', sub: 'Maquillaje ojos',
    desc: 'Doce sombras en tonos cálidos mates y brillantes, de alta pigmentación y fácil difuminado.',
    feats: ['12 tonos', 'Acabado mate y satinado', 'Alta pigmentación', 'Incluye espejo'],
    price: 8990, orig: 14990, shape: 'compact', colors: ['#d9602b', '#4a2a3d'], rating: 4.5, reviews: 612, stock: 0, sold: 1280,
    tags: 'paleta sombras maquillaje ojos belleza',
  },
  {
    id: 'base-liquida-skin-glow-30', name: 'Base Líquida Skin Glow 30 ml', brand: 'Lumière', cat: 'belleza', sub: 'Rostro',
    desc: 'Base de cobertura media con acabado luminoso y ácido hialurónico. Se siente ligera y natural.',
    feats: ['Frasco de 30 ml', 'Cobertura media modulable', 'Con ácido hialurónico', 'SPF 15'],
    price: 10990, orig: 16990, shape: 'pump', colors: ['#d9a37a', '#f6e1cf'], rating: 4.4, reviews: 398, stock: 64, sold: 880,
    tags: 'base maquillaje líquida rostro piel belleza', isNew: true,
  },
  {
    id: 'mascara-pestanas-volumen-extremo', name: 'Máscara de Pestañas Volumen Extremo', brand: 'Glow Lab', cat: 'belleza', sub: 'Maquillaje ojos',
    desc: 'Máscara de pestañas resistente al agua que aporta volumen y definición sin grumos.',
    feats: ['Volumen y definición', 'Resistente al agua', 'Cepillo curvo', 'Color negro intenso'],
    price: 5990, orig: 9990, shape: 'tube', colors: ['#2a2a3d', '#ff4b8a'], rating: 4.5, reviews: 846, stock: 120, sold: 1470,
    tags: 'máscara pestañas rimel maquillaje ojos belleza', isNew: true,
  },
  {
    id: 'serum-vitamina-c-30', name: 'Sérum Vitamina C 30 ml', brand: 'Aqualia', cat: 'belleza', sub: 'Skincare',
    desc: 'Sérum facial antioxidante con 10% de vitamina C y ácido hialurónico. Ilumina, unifica el tono y previene signos de la edad.',
    feats: ['Frasco con gotario de 30 ml', '10% de vitamina C', 'Con ácido hialurónico', 'Uso diurno'],
    price: 11990, orig: 19990, shape: 'pump', colors: ['#f08a1c', '#ffe3bd'], rating: 4.7, reviews: 521, stock: 73, sold: 1240,
    tags: 'sérum vitamina c skincare rostro piel facial', isNew: true, featured: true,
  },

  // ───────────── Infantil ─────────────
  {
    id: 'panales-soft-baby-talla-g-72', name: 'Pañales Soft Baby Talla G 72 un.', brand: 'BabyNube', cat: 'infantil', sub: 'Pañales y toallitas',
    desc: 'Pañales ultra suaves con indicador de humedad y barreras anti-filtración. Hasta 12 horas de protección.',
    feats: ['72 unidades talla G', 'Indicador de humedad', 'Hipoalergénicos', 'Hasta 12 horas de protección'],
    price: 17990, orig: 24990, shape: 'bag', colors: ['#3fb8d9', '#dff5fb'], rating: 4.7, reviews: 1760, stock: 130, sold: 2300,
    tags: 'pañales bebé talla g infantil', featured: true, free: true,
  },
  {
    id: 'bloques-construccion-120', name: 'Set Bloques de Construcción 120 pzas', brand: 'Juegatón', cat: 'infantil', sub: 'Juguetes',
    desc: 'Set de 120 bloques de colores compatibles entre sí. Estimula la creatividad y la motricidad fina.',
    feats: ['120 piezas', 'Plástico libre de BPA', 'Edad recomendada: 3 años o más', 'Incluye bolsa de almacenamiento'],
    price: 10990, orig: 21990, shape: 'blocks', colors: ['#e84a3c', '#2f8de0'], rating: 4.6, reviews: 436, stock: 42, sold: 840,
    tags: 'bloques construcción juguete niños infantil', featured: true,
  },
  {
    id: 'toallitas-humedas-sensitive-x3', name: 'Toallitas Húmedas Sensitive Pack x3', brand: 'BabyNube', cat: 'infantil', sub: 'Pañales y toallitas',
    desc: 'Toallitas húmedas sin alcohol ni perfume, con aloe vera y vitamina E. Ideales para piel sensible de bebés.',
    feats: ['3 paquetes de 80 toallitas', 'Sin alcohol ni perfume', 'Con aloe vera', 'Probadas dermatológicamente'],
    price: 5990, orig: 8990, shape: 'box', colors: ['#4ecb9b', '#dff7ee'], rating: 4.6, reviews: 902, stock: 170, sold: 1580,
    tags: 'toallitas húmedas bebé piel sensible infantil',
  },
  {
    id: 'mamadera-anticolicos-260', name: 'Mamadera Anticólicos 260 ml', brand: 'BabyNube', cat: 'infantil', sub: 'Alimentación bebé',
    desc: 'Mamadera con válvula anticólicos que reduce el paso de aire. Tetina de silicona suave de flujo medio.',
    feats: ['Capacidad de 260 ml', 'Válvula anticólicos', 'Silicona de grado médico', 'Libre de BPA'],
    price: 6990, orig: 9990, shape: 'bottle', colors: ['#6bb7e8', '#e5f3fc'], rating: 4.5, reviews: 367, stock: 88, sold: 720,
    tags: 'mamadera biberón bebé alimentación infantil',
  },
  {
    id: 'peluche-oso-abrazos-45', name: 'Peluche Oso Abrazos 45 cm', brand: 'Juegatón', cat: 'infantil', sub: 'Juguetes',
    desc: 'Oso de peluche ultra suave de 45 cm. Su relleno hipoalergénico lo hace perfecto para abrazar y dormir.',
    feats: ['Altura de 45 cm', 'Relleno hipoalergénico', 'Lavable a mano', 'Apto desde los 0 meses'],
    price: 9990, orig: 19990, shape: 'plush', colors: ['#c98a5a', '#f5dcc4'], rating: 4.8, reviews: 588, stock: 31, sold: 960,
    tags: 'peluche oso juguete regalo bebé niños',
  },
];

function build(d: Def, i: number): Product {
  return {
    id: d.id,
    sku: `MM-${String(i + 1).padStart(4, '0')}`,
    name: d.name,
    brand: d.brand,
    category: d.cat,
    subcategory: d.sub,
    description: d.desc,
    features: d.feats,
    price: d.price,
    originalPrice: d.orig,
    discount: Math.round((1 - d.price / d.orig) * 100),
    image: `/images/products/${d.id}.jpg`,
    shape: d.shape,
    colors: d.colors,
    rating: d.rating,
    reviews: d.reviews,
    stock: d.stock,
    sold: d.sold,
    featured: d.featured ?? false,
    isNew: d.isNew ?? false,
    freeShipping: d.free ?? false,
    tags: d.tags.split(' '),
    availableForDelivery: d.delivery ?? true,
    availableForPickup: d.pickup ?? true,
  };
}

export const products: Product[] = defs.map(build);

export const productMap: Record<string, Product> = Object.fromEntries(products.map((p) => [p.id, p]));

export const getProduct = (id: string): Product | undefined => productMap[id];

export const brands: string[] = Array.from(new Set(products.map((p) => p.brand))).sort((a, b) =>
  a.localeCompare(b, 'es'),
);

export const MAX_QTY_PER_LINE = 10;

export const maxQty = (p: Product) => Math.max(0, Math.min(p.stock, MAX_QTY_PER_LINE));

export function getRelated(product: Product, n = 5): Product[] {
  const same = products.filter((p) => p.category === product.category && p.id !== product.id);
  const sub = same.filter((p) => p.subcategory === product.subcategory);
  const rest = same.filter((p) => p.subcategory !== product.subcategory);
  const others = products.filter((p) => p.category !== product.category && p.featured);
  return [...sub, ...rest, ...others].slice(0, n);
}
