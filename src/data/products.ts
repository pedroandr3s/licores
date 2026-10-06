import type { CategorySlug, Product, ProductShape } from '@/types';

interface Def {
  id: string;
  name: string;
  brand: string;
  cat: CategorySlug;
  sub: string;
  desc: string;
  feats: string[];
  /** Contenido / formato */
  vol: string;
  /** Graduación alcohólica (% vol.) */
  abv?: number;
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
}

const ALCOHOL: CategorySlug[] = ['cervezas', 'vinos', 'destilados', 'licores'];

const defs: Def[] = [
  // ───────────── Cervezas ─────────────
  {
    id: 'cerveza-lager-andina-pack-6', name: 'Cerveza Lager Andina Pack 6 x 355 ml', brand: 'Cervecería Andina', cat: 'cervezas', sub: 'Lager',
    desc: 'Lager rubia, ligera y refrescante, con amargor suave y final limpio. La compañera perfecta de cualquier asado o junta de fin de semana.',
    feats: ['Pack de 6 latas de 355 ml', 'Estilo American Lager', 'Se sirve mejor a 4 °C', 'Ideal para asados y picoteo'],
    vol: '6 x 355 ml', abv: 4.7, price: 6990, orig: 8490, shape: 'can', colors: ['#e8a600', '#7a4a00'], rating: 4.6, reviews: 1320, stock: 140, sold: 4210,
    tags: 'cerveza lager pack latas rubia asado', featured: true,
  },
  {
    id: 'cerveza-ipa-ruta-sur-355', name: 'Cerveza IPA Ruta Sur 355 ml', brand: 'Ruta Sur', cat: 'cervezas', sub: 'Ale e IPA',
    desc: 'India Pale Ale con aromas cítricos y de lúpulo patagónico. Amargor marcado y cuerpo medio, para quienes buscan más carácter.',
    feats: ['Botella de 355 ml', 'Lúpulo cítrico y resinoso', 'IBU 55', 'Sin pasteurizar'],
    vol: '355 ml', abv: 6.5, price: 2290, orig: 2790, shape: 'beer', colors: ['#2f7a3a', '#d6a31a'], rating: 4.7, reviews: 640, stock: 96, sold: 1860,
    tags: 'cerveza ipa artesanal lúpulo botella', featured: true,
  },
  {
    id: 'cerveza-stout-volcan-330', name: 'Cerveza Stout Volcán 330 ml', brand: 'Volcán Brewing', cat: 'cervezas', sub: 'Artesanales',
    desc: 'Stout oscura con notas de café tostado, cacao y un toque de caramelo. Cremosa, suave y de final seco.',
    feats: ['Botella de 330 ml', 'Maltas tostadas', 'Notas de café y cacao', 'Elaboración artesanal en lotes'],
    vol: '330 ml', abv: 5.8, price: 2490, orig: 2990, shape: 'beer', colors: ['#2a1a12', '#8a5a2b'], rating: 4.8, reviews: 312, stock: 44, sold: 720,
    tags: 'cerveza stout oscura artesanal café cacao', isNew: true,
  },
  {
    id: 'cerveza-golden-ale-pack-12', name: 'Cerveza Golden Ale Pack 12 x 350 ml', brand: 'Cervecería Andina', cat: 'cervezas', sub: 'Packs',
    desc: 'Golden Ale dorada y frutal, fácil de tomar. El pack grande para cuando la junta va en serio.',
    feats: ['Pack de 12 latas de 350 ml', 'Notas de miel y fruta', 'Cuerpo ligero', 'Ahorra más que comprando por unidad'],
    vol: '12 x 350 ml', abv: 5.0, price: 13990, orig: 17990, shape: 'can', colors: ['#f2c230', '#c47a00'], rating: 4.5, reviews: 480, stock: 60, sold: 1540,
    tags: 'cerveza golden ale pack 12 latas fiesta', featured: true,
  },
  {
    id: 'cerveza-pilsner-bohemia-pack-6', name: 'Cerveza Pilsner Bohemia Pack 6 x 330 ml', brand: 'Bohemia Gold', cat: 'cervezas', sub: 'Importadas',
    desc: 'Pilsner importada de estilo checo: dorada, aromática y de amargor elegante. Botella retornable de vidrio verde.',
    feats: ['Pack de 6 botellas de 330 ml', 'Estilo Czech Pilsner', 'Lúpulo Saaz', 'Producto importado'],
    vol: '6 x 330 ml', abv: 4.9, price: 8990, orig: 10490, shape: 'beer', colors: ['#2e7d4f', '#f2d26b'], rating: 4.6, reviews: 208, stock: 38, sold: 590,
    tags: 'cerveza pilsner importada botella pack',
  },
  {
    id: 'cerveza-lager-litro-710', name: 'Cerveza Lager Lata Litro 710 ml', brand: 'Cervecería Andina', cat: 'cervezas', sub: 'Lager',
    desc: 'La lata grande de la casa: la misma lager rubia de siempre, en formato 710 ml.',
    feats: ['Lata de 710 ml', 'Estilo American Lager', 'Ideal para compartir de a dos'],
    vol: '710 ml', abv: 4.7, price: 1490, orig: 1790, shape: 'can', colors: ['#e8a600', '#7a4a00'], rating: 4.4, reviews: 904, stock: 200, sold: 3380,
    tags: 'cerveza lager lata litro',
  },
  {
    id: 'cerveza-weiss-trigo-500', name: 'Cerveza Weiss de Trigo 500 ml', brand: 'Volcán Brewing', cat: 'cervezas', sub: 'Artesanales',
    desc: 'Cerveza de trigo turbia con aromas a plátano y clavo de olor. Suave, cremosa y muy refrescante.',
    feats: ['Botella de 500 ml', 'Trigo y cebada malteada', 'Notas de banana y especias', 'Se sirve en vaso alto'],
    vol: '500 ml', abv: 5.2, price: 2990, orig: 3490, shape: 'beer', colors: ['#e9b44c', '#8a5a2b'], rating: 4.5, reviews: 176, stock: 52, sold: 410,
    tags: 'cerveza weiss trigo artesanal',
  },

  // ───────────── Vinos ─────────────
  {
    id: 'vino-cabernet-reserva-750', name: 'Vino Cabernet Sauvignon Reserva 750 ml', brand: 'Viña Los Robles', cat: 'vinos', sub: 'Tintos',
    desc: 'Tinto de cuerpo medio con aromas a cassis y pimentón, taninos redondos y un paso por barrica que le da complejidad.',
    feats: ['Botella de 750 ml', 'Cepa Cabernet Sauvignon', '6 meses en barrica', 'Maridaje: carnes rojas y quesos'],
    vol: '750 ml', abv: 13.5, price: 5490, orig: 7490, shape: 'wine', colors: ['#7a1f3d', '#e8c6a0'], rating: 4.7, reviews: 1480, stock: 110, sold: 3560,
    tags: 'vino tinto cabernet reserva carne', featured: true,
  },
  {
    id: 'vino-carmenere-gran-reserva-750', name: 'Vino Carmenère Gran Reserva 750 ml', brand: 'Viña Valle Claro', cat: 'vinos', sub: 'Tintos',
    desc: 'La cepa emblema de Chile: especiado, de frutos negros maduros y final largo. Ideal para regalar o para una cena especial.',
    feats: ['Botella de 750 ml', 'Cepa Carmenère', '12 meses en barrica', 'Valle de Colchagua'],
    vol: '750 ml', abv: 14.0, price: 8990, orig: 11990, shape: 'wine', colors: ['#4a1230', '#d9a94b'], rating: 4.8, reviews: 612, stock: 36, sold: 1180,
    tags: 'vino tinto carmenere gran reserva regalo', featured: true,
  },
  {
    id: 'vino-merlot-caja-1l', name: 'Vino Merlot en Caja 1 L', brand: 'Viña Los Robles', cat: 'vinos', sub: 'Tintos',
    desc: 'Merlot suave y frutado en formato caja, práctico para la mesa de todos los días.',
    feats: ['Caja de 1 litro', 'Cepa Merlot', 'Fácil de guardar y transportar'],
    vol: '1 L', abv: 12.5, price: 2990, orig: 3490, shape: 'box', colors: ['#8a2b3d', '#f0d6c0'], rating: 4.2, reviews: 835, stock: 180, sold: 2740,
    tags: 'vino tinto merlot caja litro',
  },
  {
    id: 'vino-syrah-reserva-750', name: 'Vino Syrah Reserva 750 ml', brand: 'Viña Piedra Azul', cat: 'vinos', sub: 'Tintos',
    desc: 'Syrah intenso, con notas de mora, pimienta negra y un fondo ahumado. Pide carne a la parrilla.',
    feats: ['Botella de 750 ml', 'Cepa Syrah', 'Notas de pimienta y mora', 'Valle de Limarí'],
    vol: '750 ml', abv: 14.5, price: 6290, orig: 8290, shape: 'wine', colors: ['#3a1030', '#c9a14a'], rating: 4.6, reviews: 388, stock: 48, sold: 820,
    tags: 'vino tinto syrah reserva parrilla',
  },
  {
    id: 'vino-sauvignon-blanc-750', name: 'Vino Sauvignon Blanc 750 ml', brand: 'Viña Valle Claro', cat: 'vinos', sub: 'Blancos',
    desc: 'Blanco fresco y cítrico, con notas de pomelo y hierba recién cortada. Perfecto para mariscos y ensaladas.',
    feats: ['Botella de 750 ml', 'Cepa Sauvignon Blanc', 'Se sirve a 8 °C', 'Valle de Casablanca'],
    vol: '750 ml', abv: 12.5, price: 4990, orig: 6490, shape: 'wine', colors: ['#9bb33a', '#f3efc0'], rating: 4.5, reviews: 730, stock: 90, sold: 1960,
    tags: 'vino blanco sauvignon blanc fresco mariscos', featured: true,
  },
  {
    id: 'vino-chardonnay-reserva-750', name: 'Vino Chardonnay Reserva 750 ml', brand: 'Viña Piedra Azul', cat: 'vinos', sub: 'Blancos',
    desc: 'Chardonnay con carácter: manzana madura, vainilla y un toque de mantequilla de su paso por barrica.',
    feats: ['Botella de 750 ml', 'Cepa Chardonnay', 'Parcial en barrica', 'Maridaje: pollo, pescados y quesos suaves'],
    vol: '750 ml', abv: 13.5, price: 6490, orig: 8490, shape: 'wine', colors: ['#d4b84a', '#fff3c4'], rating: 4.6, reviews: 294, stock: 41, sold: 760,
    tags: 'vino blanco chardonnay reserva barrica',
  },
  {
    id: 'vino-rose-cabernet-750', name: 'Vino Rosé Cabernet 750 ml', brand: 'Viña Los Robles', cat: 'vinos', sub: 'Rosé',
    desc: 'Rosé seco y frutal, con aromas a frutilla y cereza. Muy bueno bien helado en tardes de verano.',
    feats: ['Botella de 750 ml', 'Cepa Cabernet Sauvignon', 'Seco y fresco', 'Se sirve a 6 °C'],
    vol: '750 ml', abv: 12.0, price: 4690, orig: 5990, shape: 'wine', colors: ['#e8788f', '#ffe3ea'], rating: 4.4, reviews: 156, stock: 33, sold: 340,
    tags: 'vino rosé rose verano', isNew: true,
  },
  {
    id: 'espumante-brut-750', name: 'Espumante Brut 750 ml', brand: 'Viña Valle Claro', cat: 'vinos', sub: 'Espumantes',
    desc: 'Espumante seco de burbuja fina y persistente, con aromas a manzana verde y pan tostado. Para brindar sin motivo… o con todos.',
    feats: ['Botella de 750 ml', 'Método Charmat', 'Seco (Brut)', 'Se sirve a 6 °C'],
    vol: '750 ml', abv: 11.5, price: 5990, orig: 7990, shape: 'wine', colors: ['#c9b04a', '#fff7d6'], rating: 4.7, reviews: 910, stock: 70, sold: 2480,
    tags: 'espumante brut champagne brindis celebración', featured: true,
  },
  {
    id: 'espumante-moscatel-dulce-750', name: 'Espumante Moscatel Dulce 750 ml', brand: 'Viña Piedra Azul', cat: 'vinos', sub: 'Espumantes',
    desc: 'Espumante dulce y aromático de uva moscatel, ligero y fácil de tomar. El favorito de las celebraciones.',
    feats: ['Botella de 750 ml', 'Uva Moscatel', 'Dulce y aromático', 'Ideal con postres'],
    vol: '750 ml', abv: 7.5, price: 4990, orig: 6490, shape: 'wine', colors: ['#d9a63a', '#fff0c9'], rating: 4.5, reviews: 365, stock: 58, sold: 1010,
    tags: 'espumante moscatel dulce postre',
  },

  // ───────────── Destilados ─────────────
  {
    id: 'pisco-reserva-40-750', name: 'Pisco Reserva 40° 750 ml', brand: 'Cóndor Andino', cat: 'destilados', sub: 'Pisco',
    desc: 'Pisco chileno de doble destilación, con aromas a uva moscatel y flores blancas. Excelente solo, en pisco sour o con ginger.',
    feats: ['Botella de 750 ml', '40° de graduación', 'Doble destilación', 'Valle del Elqui'],
    vol: '750 ml', abv: 40, price: 8990, orig: 10990, shape: 'spirit', colors: ['#d9c27a', '#6a4a12'], rating: 4.8, reviews: 1730, stock: 85, sold: 3920,
    tags: 'pisco reserva 40 elqui pisco sour', featured: true,
  },
  {
    id: 'pisco-especial-35-1l', name: 'Pisco Especial 35° 1 L', brand: 'Huaso Viejo', cat: 'destilados', sub: 'Pisco',
    desc: 'El pisco de todos los días: suave, versátil y rendidor. Pide cola, ginger o limón.',
    feats: ['Botella de 1 litro', '35° de graduación', 'Ideal para combinados', 'Formato familiar'],
    vol: '1 L', abv: 35, price: 7490, orig: 8990, shape: 'spirit', colors: ['#e3d28a', '#7a5a1a'], rating: 4.5, reviews: 2210, stock: 160, sold: 5480,
    tags: 'pisco especial 35 litro combinado piscola', featured: true,
  },
  {
    id: 'pisco-sour-listo-700', name: 'Pisco Sour Listo para Servir 700 ml', brand: 'Cóndor Andino', cat: 'destilados', sub: 'Pisco',
    desc: 'Pisco sour premezclado con limón de pica y un toque de jarabe de goma. Solo agrega hielo y sirve.',
    feats: ['Botella de 700 ml', 'Listo para servir', 'Con limón de pica', 'Mantener refrigerado después de abrir'],
    vol: '700 ml', abv: 12, price: 4990, orig: 5990, shape: 'spirit', colors: ['#c9d36a', '#4a5a12'], rating: 4.3, reviews: 420, stock: 64, sold: 1320,
    tags: 'pisco sour listo premezclado cóctel', isNew: true,
  },
  {
    id: 'whisky-blended-12-750', name: 'Whisky Blended 12 Años 750 ml', brand: 'Highland Craft', cat: 'destilados', sub: 'Whisky',
    desc: 'Blend de maltas y granos con 12 años de maduración: miel, frutos secos y un final ahumado muy suave.',
    feats: ['Botella de 750 ml', '40° de graduación', '12 años de maduración', 'Se sirve solo, con hielo o con agua'],
    vol: '750 ml', abv: 40, price: 16990, orig: 21990, shape: 'spirit', colors: ['#b8741a', '#2a1a08'], rating: 4.8, reviews: 540, stock: 22, sold: 980,
    tags: 'whisky escocés blended 12 años regalo', featured: true,
  },
  {
    id: 'bourbon-reserva-750', name: 'Bourbon Reserva 750 ml', brand: 'Old Ridge', cat: 'destilados', sub: 'Whisky',
    desc: 'Bourbon de maíz con notas de vainilla, caramelo y roble tostado. Dulce, redondo y con cuerpo.',
    feats: ['Botella de 750 ml', '43° de graduación', 'Barrica de roble americano nuevo', 'Ideal para old fashioned'],
    vol: '750 ml', abv: 43, price: 14990, orig: 18990, shape: 'spirit', colors: ['#a8541a', '#3a1a08'], rating: 4.6, reviews: 276, stock: 18, sold: 510,
    tags: 'bourbon whisky americano vainilla',
  },
  {
    id: 'ron-dorado-750', name: 'Ron Dorado 750 ml', brand: 'Isla Caribe', cat: 'destilados', sub: 'Ron',
    desc: 'Ron añejado con notas de caña, vainilla y especias. Muy bueno con cola o en un mojito.',
    feats: ['Botella de 750 ml', '38° de graduación', 'Añejado 3 años', 'Para cuba libre y mojitos'],
    vol: '750 ml', abv: 38, price: 7990, orig: 9990, shape: 'spirit', colors: ['#c8761a', '#4a2a08'], rating: 4.5, reviews: 630, stock: 52, sold: 1420,
    tags: 'ron dorado añejo cuba libre mojito',
  },
  {
    id: 'vodka-premium-750', name: 'Vodka Premium 750 ml', brand: 'Nórdika', cat: 'destilados', sub: 'Vodka',
    desc: 'Vodka cuatro veces destilado y filtrado, limpio, neutro y suave. Base ideal para tragos largos.',
    feats: ['Botella de 750 ml', '40° de graduación', 'Cuádruple destilación', 'Para screwdriver, moscow mule y más'],
    vol: '750 ml', abv: 40, price: 8490, orig: 10490, shape: 'spirit', colors: ['#9ac4e8', '#e8f2fc'], rating: 4.4, reviews: 502, stock: 61, sold: 1330,
    tags: 'vodka premium neutro trago',
  },
  {
    id: 'gin-botanico-700', name: 'Gin Botánico 700 ml', brand: 'Jardín Seco', cat: 'destilados', sub: 'Gin',
    desc: 'Gin de enebro con pepino, cilantro y cáscara de cítricos. Fresco y aromático: pide una tónica y una rodaja de pepino.',
    feats: ['Botella de 700 ml', '42° de graduación', 'Botánicos naturales', 'Ideal para gin tonic'],
    vol: '700 ml', abv: 42, price: 11990, orig: 14990, shape: 'spirit', colors: ['#2f8e6a', '#cdeedd'], rating: 4.7, reviews: 188, stock: 29, sold: 460,
    tags: 'gin botánico enebro gin tonic', isNew: true,
  },
  {
    id: 'tequila-reposado-750', name: 'Tequila Reposado 750 ml', brand: 'Agave Real', cat: 'destilados', sub: 'Tequila',
    desc: '100% agave azul reposado en barrica: notas de agave cocido, caramelo y pimienta. Para tomar solo o en margarita.',
    feats: ['Botella de 750 ml', '38° de graduación', '100% agave azul', 'Reposado 6 meses'],
    vol: '750 ml', abv: 38, price: 12990, orig: 15990, shape: 'spirit', colors: ['#d49a2a', '#6a3a08'], rating: 4.6, reviews: 234, stock: 24, sold: 530,
    tags: 'tequila reposado agave margarita',
  },

  // ───────────── Licores y aperitivos ─────────────
  {
    id: 'crema-de-whisky-700', name: 'Crema de Whisky 700 ml', brand: 'Dublín Cream', cat: 'licores', sub: 'Cremas',
    desc: 'Licor cremoso a base de whisky, crema de leche y cacao. Sírvelo con hielo o en el café.',
    feats: ['Botella de 700 ml', '17° de graduación', 'Cremoso y dulce', 'Sin necesidad de refrigerar antes de abrir'],
    vol: '700 ml', abv: 17, price: 9490, orig: 11990, shape: 'spirit', colors: ['#c9a37a', '#fff1de'], rating: 4.7, reviews: 346, stock: 38, sold: 880,
    tags: 'crema whisky licor cremoso postre',
  },
  {
    id: 'amargo-aperitivo-750', name: 'Amargo Aperitivo de Hierbas 750 ml', brand: 'Amaro Sur', cat: 'licores', sub: 'Aperitivos',
    desc: 'Aperitivo amargo de hierbas y raíces, para tomar antes de comer, con soda o en coctelería.',
    feats: ['Botella de 750 ml', '25° de graduación', 'Hierbas y raíces andinas', 'Sabor amargo y herbal'],
    vol: '750 ml', abv: 25, price: 6990, orig: 8490, shape: 'spirit', colors: ['#a8281f', '#f5c6a0'], rating: 4.4, reviews: 152, stock: 31, sold: 390,
    tags: 'amargo aperitivo hierbas digestivo',
  },
  {
    id: 'licor-de-cafe-700', name: 'Licor de Café 700 ml', brand: 'Café Noir', cat: 'licores', sub: 'Licores de café y hierbas',
    desc: 'Licor de café tostado con vainilla. Base del clásico vaina y ideal para postres y helados.',
    feats: ['Botella de 700 ml', '20° de graduación', 'Café arábica y vainilla', 'Ideal para postres'],
    vol: '700 ml', abv: 20, price: 8290, orig: 9990, shape: 'spirit', colors: ['#3a2418', '#c9a37a'], rating: 4.5, reviews: 208, stock: 26, sold: 470,
    tags: 'licor café vaina postre',
  },
  {
    id: 'aperitivo-spritz-naranja-750', name: 'Aperitivo Spritz Naranja 750 ml', brand: 'Rosso Aperitivo', cat: 'licores', sub: 'Aperitivos',
    desc: 'Aperitivo de naranja amarga para preparar spritz: 3 partes de espumante, 2 de aperitivo y 1 de soda.',
    feats: ['Botella de 750 ml', '11° de graduación', 'Naranja amarga y ruibarbo', 'Receta spritz en la etiqueta'],
    vol: '750 ml', abv: 11, price: 7490, orig: 8990, shape: 'spirit', colors: ['#f07a1a', '#ffe0b8'], rating: 4.6, reviews: 274, stock: 40, sold: 760,
    tags: 'aperitivo spritz naranja aperol verano', isNew: true, featured: true,
  },

  // ───────────── Bebidas y mixers ─────────────
  {
    id: 'bebida-cola-3l', name: 'Bebida Cola 3 L', brand: 'Fizz', cat: 'mixers', sub: 'Bebidas',
    desc: 'Cola clásica en formato familiar de 3 litros. La mezcla de siempre con pisco, ron o whisky.',
    feats: ['Botella de 3 litros', 'Se sirve bien fría', 'Ideal para combinados'],
    vol: '3 L', price: 2790, orig: 3290, shape: 'drink', colors: ['#3a1a12', '#e8282f'], rating: 4.5, reviews: 2140, stock: 260, sold: 6120,
    tags: 'bebida cola gaseosa mixer 3 litros', featured: true,
  },
  {
    id: 'bebida-limon-lima-3l', name: 'Bebida Limón-Lima 3 L', brand: 'Fizz', cat: 'mixers', sub: 'Bebidas',
    desc: 'Gaseosa de limón y lima, cítrica y refrescante. Muy buena con vodka o tequila.',
    feats: ['Botella de 3 litros', 'Sabor limón-lima', 'Se sirve bien fría'],
    vol: '3 L', price: 2690, orig: 3190, shape: 'drink', colors: ['#9bd43a', '#e8f5a0'], rating: 4.4, reviews: 904, stock: 190, sold: 2870,
    tags: 'bebida limón lima gaseosa mixer',
  },
  {
    id: 'ginger-ale-15l', name: 'Ginger Ale 1,5 L', brand: 'Fizz', cat: 'mixers', sub: 'Bebidas',
    desc: 'Ginger ale con jengibre natural. El acompañante clásico del pisco, y base del Chilcano.',
    feats: ['Botella de 1,5 litros', 'Con jengibre natural', 'Ideal para chilcano'],
    vol: '1,5 L', price: 1990, orig: 2390, shape: 'drink', colors: ['#d8a52a', '#fff0c0'], rating: 4.6, reviews: 710, stock: 150, sold: 2240,
    tags: 'ginger ale jengibre mixer chilcano',
  },
  {
    id: 'agua-tonica-pack-6', name: 'Agua Tónica Pack 6 x 220 ml', brand: 'Nórdika Mixers', cat: 'mixers', sub: 'Aguas y tónicas',
    desc: 'Tónica premium con quinina natural y burbuja fina, pensada para gin tonic.',
    feats: ['Pack de 6 botellas de 220 ml', 'Quinina natural', 'Burbuja fina'],
    vol: '6 x 220 ml', price: 4990, orig: 5990, shape: 'drink', colors: ['#c8e0f0', '#2f8de0'], rating: 4.7, reviews: 332, stock: 72, sold: 940,
    tags: 'agua tónica gin tonic mixer premium', featured: true,
  },
  {
    id: 'energetica-pack-4', name: 'Bebida Energética Pack 4 x 473 ml', brand: 'Voltio', cat: 'mixers', sub: 'Energéticas',
    desc: 'Bebida energética con cafeína y taurina. Se mezcla con vodka en los tragos de la noche.',
    feats: ['Pack de 4 latas de 473 ml', 'Con cafeína y taurina', 'Sírvela bien fría'],
    vol: '4 x 473 ml', price: 5990, orig: 6990, shape: 'can', colors: ['#2f8de0', '#14122b'], rating: 4.2, reviews: 590, stock: 88, sold: 1860,
    tags: 'energética energy drink lata vodka',
  },
  {
    id: 'jugo-naranja-1l', name: 'Jugo de Naranja 1 L', brand: 'Campo Vivo', cat: 'mixers', sub: 'Jugos',
    desc: 'Jugo de naranja exprimido, sin azúcar añadida. Para screwdriver, mimosa o el desayuno de después.',
    feats: ['Caja de 1 litro', 'Sin azúcar añadida', 'Mantener refrigerado'],
    vol: '1 L', price: 2290, orig: 2690, shape: 'box', colors: ['#f5a623', '#fff0cc'], rating: 4.5, reviews: 268, stock: 96, sold: 720,
    tags: 'jugo naranja mimosa screwdriver',
  },
  {
    id: 'agua-mineral-con-gas-15l', name: 'Agua Mineral con Gas 1,5 L', brand: 'Cristalina', cat: 'mixers', sub: 'Aguas y tónicas',
    desc: 'Agua mineral con gas natural, para hidratarte entre trago y trago o preparar un spritz.',
    feats: ['Botella de 1,5 litros', 'Con gas', 'Baja en sodio'],
    vol: '1,5 L', price: 1290, orig: 1490, shape: 'drink', colors: ['#bfe6fa', '#2f9bd8'], rating: 4.6, reviews: 411, stock: 230, sold: 1980,
    tags: 'agua mineral con gas soda spritz',
  },
  {
    id: 'hielo-cubos-2kg', name: 'Hielo en Cubos 2 kg', brand: 'Polar', cat: 'mixers', sub: 'Hielo',
    desc: 'Hielo cristalino en cubos, de agua purificada. Retíralo al final de tu visita para que llegue bien frío.',
    feats: ['Bolsa de 2 kg', 'Agua purificada', 'Retíralo al final, se mantiene congelado'],
    vol: '2 kg', price: 1990, orig: 2290, shape: 'bag', colors: ['#bfe6fa', '#2f9bd8'], rating: 4.7, reviews: 840, stock: 120, sold: 4380,
    tags: 'hielo cubos bolsa fiesta', featured: true,
  },

  // ───────────── Papas y snacks ─────────────
  {
    id: 'papas-fritas-clasicas-250', name: 'Papas Fritas Clásicas 250 g', brand: 'Crunchy', cat: 'snacks', sub: 'Papas fritas',
    desc: 'Las papas fritas de siempre: finas, crujientes y con la sal justa. Bolsa familiar para compartir.',
    feats: ['Bolsa de 250 g', 'Papas fritas en aceite vegetal', 'Con sal', 'Formato familiar'],
    vol: '250 g', price: 2490, orig: 2990, shape: 'bag', colors: ['#ffcf3a', '#e8543a'], rating: 4.7, reviews: 3120, stock: 300, sold: 7840,
    tags: 'papas fritas clásicas snack sal picar', featured: true,
  },
  {
    id: 'papas-onduladas-bbq-180', name: 'Papas Onduladas BBQ 180 g', brand: 'Crunchy', cat: 'snacks', sub: 'Papas fritas',
    desc: 'Papas onduladas extracrujientes con sabor a salsa barbacoa ahumada.',
    feats: ['Bolsa de 180 g', 'Corte ondulado', 'Sabor barbacoa', 'Extracrujientes'],
    vol: '180 g', price: 2190, orig: 2590, shape: 'bag', colors: ['#8a2b1a', '#ffb347'], rating: 4.6, reviews: 1480, stock: 210, sold: 4320,
    tags: 'papas fritas onduladas bbq barbacoa',
  },
  {
    id: 'papas-queso-cheddar-140', name: 'Papas Sabor Queso Cheddar 140 g', brand: 'Crunchy', cat: 'snacks', sub: 'Papas fritas',
    desc: 'Papas fritas con intenso sabor a queso cheddar, para los fanáticos del queso.',
    feats: ['Bolsa de 140 g', 'Sabor queso cheddar', 'Cortas y crujientes'],
    vol: '140 g', price: 1790, orig: 2190, shape: 'bag', colors: ['#f5a623', '#ffe08a'], rating: 4.5, reviews: 960, stock: 180, sold: 3010,
    tags: 'papas fritas queso cheddar snack',
  },
  {
    id: 'papas-kettle-sal-mar-200', name: 'Papas Kettle Sal de Mar 200 g', brand: 'Rústica', cat: 'snacks', sub: 'Papas fritas',
    desc: 'Papas cocidas por lotes en marmita, con piel y sal de mar. Más gruesas y más crocantes.',
    feats: ['Bolsa de 200 g', 'Cocción por lotes', 'Con piel', 'Sal de mar'],
    vol: '200 g', price: 2990, orig: 3490, shape: 'bag', colors: ['#c9a14a', '#fff3d6'], rating: 4.8, reviews: 540, stock: 85, sold: 1220,
    tags: 'papas kettle sal de mar gourmet', featured: true,
  },
  {
    id: 'papas-picantes-chile-150', name: 'Papas Picantes Chile 150 g', brand: 'Crunchy', cat: 'snacks', sub: 'Papas fritas',
    desc: 'Papas con una cubierta de ají y limón que pica de verdad. Para valientes.',
    feats: ['Bolsa de 150 g', 'Sabor ají y limón', 'Nivel de picante: alto'],
    vol: '150 g', price: 1990, orig: 2390, shape: 'bag', colors: ['#c8281f', '#ffd14a'], rating: 4.4, reviews: 188, stock: 76, sold: 410,
    tags: 'papas picantes ají chile limón', isNew: true,
  },
  {
    id: 'ramitas-saladas-200', name: 'Ramitas Saladas 200 g', brand: 'Tostadita', cat: 'snacks', sub: 'Ramitas y maní',
    desc: 'Ramitas de trigo horneadas con sal. Crujientes, livianas y perfectas con una cerveza.',
    feats: ['Bolsa de 200 g', 'Horneadas', 'Con sal'],
    vol: '200 g', price: 1690, orig: 1990, shape: 'bag', colors: ['#e0a040', '#fff0cc'], rating: 4.3, reviews: 420, stock: 130, sold: 1760,
    tags: 'ramitas saladas snack cerveza',
  },
  {
    id: 'mani-salado-400', name: 'Maní Salado 400 g', brand: 'Campo Vivo', cat: 'snacks', sub: 'Ramitas y maní',
    desc: 'Maní tostado y salado, el clásico del picoteo. Bolsa grande para toda la junta.',
    feats: ['Bolsa de 400 g', 'Tostado y salado', 'Fuente de proteínas'],
    vol: '400 g', price: 2890, orig: 3390, shape: 'bag', colors: ['#b87a3a', '#fff0d8'], rating: 4.6, reviews: 702, stock: 140, sold: 2090,
    tags: 'maní salado frutos secos picar',
  },
  {
    id: 'tortilla-chips-230', name: 'Tortilla Chips de Maíz 230 g', brand: 'Sol Maya', cat: 'snacks', sub: 'Chips y tortillas',
    desc: 'Chips de maíz azul y amarillo, ideales para acompañar con guacamole, salsa o queso fundido.',
    feats: ['Bolsa de 230 g', 'Maíz natural', 'Sin conservantes', 'Para mojar en salsas'],
    vol: '230 g', price: 2590, orig: 3090, shape: 'bag', colors: ['#3a6ea8', '#ffd14a'], rating: 4.5, reviews: 330, stock: 92, sold: 860,
    tags: 'tortilla chips nachos maíz guacamole',
  },
  {
    id: 'mix-coctel-500', name: 'Mix Cóctel para Picar 500 g', brand: 'Tostadita', cat: 'snacks', sub: 'Mix para picar',
    desc: 'Mezcla de maní, ramitas, palitos y habas fritas. Todo el picoteo en una sola bolsa.',
    feats: ['Bolsa de 500 g', 'Maní, ramitas, palitos y habas', 'Formato fiesta'],
    vol: '500 g', price: 3490, orig: 3990, shape: 'bag', colors: ['#d2682a', '#ffe7c4'], rating: 4.7, reviews: 618, stock: 105, sold: 2330,
    tags: 'mix cóctel picar fiesta maní ramitas', featured: true,
  },
];

function build(d: Def, i: number): Product {
  return {
    id: d.id,
    sku: `ML-${String(i + 1).padStart(4, '0')}`,
    name: d.name,
    brand: d.brand,
    category: d.cat,
    subcategory: d.sub,
    description: d.desc,
    features: d.abv ? [`Graduación alcohólica: ${String(d.abv).replace('.', ',')}° (% vol.)`, ...d.feats] : d.feats,
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
    tags: d.tags.split(' '),
    volume: d.vol,
    abv: d.abv,
    isAlcohol: ALCOHOL.includes(d.cat),
  };
}

export const products: Product[] = defs.map(build);

export const productMap: Record<string, Product> = Object.fromEntries(products.map((p) => [p.id, p]));

export const getProduct = (id: string): Product | undefined => productMap[id];

export const brands: string[] = Array.from(new Set(products.map((p) => p.brand))).sort((a, b) =>
  a.localeCompare(b, 'es'),
);

export const MAX_QTY_PER_LINE = 12;

export const maxQty = (p: Product) => Math.max(0, Math.min(p.stock, MAX_QTY_PER_LINE));

export function getRelated(product: Product, n = 5): Product[] {
  const same = products.filter((p) => p.category === product.category && p.id !== product.id);
  const sub = same.filter((p) => p.subcategory === product.subcategory);
  const rest = same.filter((p) => p.subcategory !== product.subcategory);
  const others = products.filter((p) => p.category !== product.category && p.featured);
  return [...sub, ...rest, ...others].slice(0, n);
}
