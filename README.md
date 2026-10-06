# Botillería Oasis — mockup de tienda de licores

Demo frontend de una botillería de Quirihue (Avenida Prat 813): cervezas, vinos, destilados, licores, bebidas y papas fritas.
**Un solo local y solo retiro en tienda** (no hay despacho). Sin backend, base de datos ni pagos reales: todo funciona con datos locales y `localStorage`.

## Cómo ejecutarlo

```bash
npm install
npm run dev      # http://localhost:3000
```

Producción: `npm run build && npm start`. Chequeo de tipos: `npm run typecheck`. Requiere Node 20.9 o superior.

## Qué incluye

| Ruta | Contenido |
| --- | --- |
| `/` | Landing: ofertas al comienzo, categorías, más vendidos, **Dónde encontrarnos** (foto del local), novedades y marcas |
| `/productos`, `/productos/[categoria]`, `/nuevos`, `/ofertas`, `/marcas` | Catálogo con búsqueda, filtros, orden y paginación (los filtros viven en la URL) |
| `/producto/[id]` | Ficha con graduación alcohólica, stock en vivo y aviso de retiro con cédula |
| `/carrito`, `/checkout`, `/checkout/confirmacion` | Compra solo con retiro: día de retiro, datos, declaración de mayoría de edad (+18) y pago |
| `/mis-pedidos`, `/favoritos`, `/club`, `/cuenta`, `/ayuda` | Resto de secciones |
| `/donde-encontrarnos` | Foto, horario, mapa interactivo de Google Maps y botón «Cómo llegar» |
| `/admin` | **Panel de administración** (ver abajo) |

Al entrar al sitio se pide confirmar que se tiene 18 años o más. Los productos con alcohol exigen una declaración de edad en el checkout y avisan que se retira con cédula.

## Panel de administración (`/admin`)

Botón **Admin** en el encabezado. Contraseña de la demo: `admin123` (no es seguridad real: no hay servidor).

- **Ventas:** filtros por período, categoría, método de pago, estado, tipo (con/sin alcohol) y búsqueda; KPIs con variación contra el período anterior; gráficos de ingresos, pedidos, categorías, medios de pago, alcohol vs. otros, estados, top de productos, tamaño de pedido y mapa de calor día × hora; tabla de pedidos y exportación a CSV.
- **Inventario y stock:** valor y unidades en stock, alertas de stock bajo/agotado, cobertura en días, edición de stock por producto (± y valor exacto), reposición masiva e historial de movimientos.
- **El stock se actualiza con las compras:** cada pedido descuenta unidades, y las etiquetas «¡Últimas N unidades!», «Agotado», la disponibilidad y el límite de cantidad del carrito se actualizan al instante. El checkout revisa el stock antes de confirmar.
- Las ventas históricas son simuladas (determinísticas); los pedidos que hagas en la demo se suman a las estadísticas.

## Cómo está organizado

```
src/
  app/            rutas (App Router) y metadata
  components/     UI de la tienda y components/admin (panel y gráficos SVG propios, sin librerías)
  context/        StoreContext (carrito, favoritos, pedidos, stock, edad → localStorage) y UIContext
  data/           products · categories · stores · orders · sales (ventas simuladas) · content · rewards
  lib/            precios, filtros, búsqueda, fechas, RUT, analytics
public/           logo.jpg y local.jpg
```

## Reiniciar la demo

Botón **Restablecer demo** en el footer (borra carrito, pedidos y stock; conserva la confirmación de edad), o borra la clave `oasis:v1` de `localStorage`.

## Notas

- Marcas, precios, teléfono y horarios son ficticios. La foto del local es la vista previa pública de Instagram (captura de Street View).
- Para SEO real define `NEXT_PUBLIC_SITE_URL`.
