Coloca aquí las fotos reales de los productos (por ejemplo perfume-noir-intense.jpg).

Luego, en src/data/products.ts, agrega al producto correspondiente:
  images: ['/images/products/perfume-noir-intense.jpg', '/images/products/perfume-noir-intense-2.jpg']

Si un producto define `images`, la galería, las tarjetas y el carrito usan esas fotos.
Si la imagen no carga, se muestra automáticamente la ilustración SVG de respaldo.
