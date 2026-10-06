# MIXMARKET — mockup de e-commerce

Demo frontend de una tienda retail chilena ficticia. **No hay backend, base de datos, autenticación ni pagos reales:**
todo funciona con datos locales y `localStorage`.

> Concepto: "Todo lo que buscas, en un solo lugar."

## Cómo ejecutarlo

```bash
npm install
npm run dev      # http://localhost:3000
```

Producción: `npm run build && npm start`. Chequeo de tipos: `npm run typecheck`.
Requiere Node 20.9 o superior.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · lucide-react ·
fuentes autoalojadas (Bricolage Grotesque y Figtree vía `@fontsource-variable`, sin llamadas a Google).

## Qué incluye

| Ruta | Contenido |
| --- | --- |
| `/` | Hero con 5 slides, beneficios, categorías, más vendidos (con pestañas), ofertas flash, banners, novedades y marcas |
| `/productos`, `/productos/[categoria]`, `/nuevos` | Catálogo con búsqueda, filtros (categoría, precio, marca, disponibilidad, descuento), orden y paginación. Los filtros viven en la URL |
| `/producto/[id]` | Galería con zoom, precio, stock, cantidad, "¿Cómo quieres recibirlo?" con disponibilidad por tienda, pestañas y opiniones |
| `/ofertas` | Hasta 70% OFF, contador, ofertas flash y filtros por descuento |
| `/carrito`, `/checkout`, `/checkout/confirmacion` | Carrito, checkout de 3 pasos (entrega → datos → pago) y pedido creado |
| `/mis-pedidos`, `/mis-pedidos/[id]` | Pedidos con línea de tiempo; puedes "simular" el avance de estado |
| `/favoritos`, `/club`, `/tiendas`, `/tiendas/[id]`, `/cuenta`, `/marcas`, `/ayuda`, `/ayuda/[slug]` | Resto de secciones enlazadas desde header y footer |

Header con buscador (sugerencias en vivo), selector de tienda, menú de categorías, login/registro simulados
(botón "Entrar con la cuenta demo" → **Andrés**), favoritos y carrito con cajón lateral.

## Cómo está organizado

```
src/
  app/            rutas (App Router) y metadata/SEO
  components/     Header, Footer, SearchBar, ProductCard, ProductGrid, CategoryCard, HeroBanner, CartDrawer,
                  CartItem, QuantitySelector, ProductGallery, DeliverySelector, StoreSelector, CheckoutSteps,
                  OrderSummary, OrderCard, FavoriteButton, LoginModal, Toast, FilterSidebar, SortDropdown, ...
  context/        StoreContext (carrito, favoritos, usuario, pedidos, tienda, modalidad → localStorage)
                  UIContext (cajón, modales, toasts)
  data/           products.ts · categories.ts · stores.ts · orders.ts · regions.ts · rewards.ts · content.ts
  lib/            precios, filtros/orden, búsqueda, fechas, RUT, disponibilidad, pedidos
```

## Reglas de negocio simuladas

- Despacho: **$3.990**, gratis desde **$30.000** o si todos los productos tienen "Envío gratis". Retiro en tienda: siempre gratis.
- Algunos productos son solo retiro o solo despacho; si el carrito mezcla ambos, el checkout lo avisa.
- Disponibilidad por tienda: determinística a partir del stock (la tienda San Carlos nunca queda sin stock si el producto está disponible).
- Puntos del Club: 1 punto por cada $100. Registrarse regala 800 puntos; la cuenta demo parte con 2.450.
- RUT validado con dígito verificador; el pago valida formato pero **no procesa nada ni guarda datos de tarjeta** (solo los últimos 4 dígitos en el pedido).
  Tarjeta de prueba: botón "Usar tarjeta de prueba".
- Número de pedido: `MM-AAAAMMDD-#####`.

## Reiniciar la demo

Botón **Restablecer demo** en el footer (o borrar la clave `mixmarket:v1` de `localStorage`).

## Imágenes

Los productos se dibujan como ilustraciones SVG propias (`ProductImage.tsx`), para no depender de archivos externos.
Para usar fotos reales, mira `public/images/products/README.txt`.

## Notas

- Marca, logotipo, textos y datos son ficticios; no se copió material de Liquidos.cl.
- Para SEO real, define `NEXT_PUBLIC_SITE_URL` y agrega una imagen Open Graph.
