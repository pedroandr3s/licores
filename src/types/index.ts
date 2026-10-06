export type CategorySlug =
  | 'cervezas'
  | 'vinos'
  | 'destilados'
  | 'licores'
  | 'mixers'
  | 'snacks';

export type ProductShape =
  | 'perfume' | 'pump' | 'tube' | 'jar' | 'spray' | 'jug' | 'box' | 'bag' | 'can' | 'drink'
  | 'wine' | 'headphones' | 'speaker' | 'watch' | 'mug' | 'lamp' | 'blocks' | 'powerbank'
  | 'bowl' | 'lipstick' | 'compact' | 'plush' | 'pillow' | 'pot' | 'rolls' | 'sheets'
  | 'mouse' | 'rollon' | 'bottle' | 'beer' | 'spirit';

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  icon: string;
  subcategories: string[];
  /** Colores del visual de la categoría [fondo-claro, fondo-intenso] */
  colors: [string, string];
  /** Producto cuyo visual representa a la categoría */
  heroProductId: string;
}

export interface Product {
  id: string; // slug (se usa en la URL: /producto/[id])
  sku: string;
  name: string;
  brand: string;
  category: CategorySlug;
  subcategory: string;
  description: string;
  features: string[];
  price: number;
  originalPrice: number;
  discount: number;
  /** Ruta preparada para assets reales: /public/images/products/<id>.jpg */
  image: string;
  /** Si defines `images`, ProductImage las usará en vez del arte generado */
  images?: string[];
  shape: ProductShape;
  colors: [string, string];
  rating: number;
  reviews: number;
  stock: number;
  sold: number;
  featured: boolean;
  isNew: boolean;
  tags: string[];
  /** Contenido / formato (ej. 750 ml, 250 g) */
  volume: string;
  /** Graduación alcohólica (% vol.). Solo en productos con alcohol */
  abv?: number;
  /** Producto con alcohol: exige mayoría de edad */
  isAlcohol: boolean;
}

export type Availability = 'available' | 'low' | 'none';

export interface StoreHours {
  weekdays: [number, number] | null;
  saturday: [number, number] | null;
  sunday: [number, number] | null;
}

export interface Store {
  id: string;
  name: string;
  shortName: string;
  address: string;
  city: string;
  phone: string;
  hoursLabel: string;
  hours: StoreHours;
  distanceKm: number;
  services: string[];
  description: string;
  /** Posición (%) en el mapa ilustrado */
  map: { x: number; y: number };
}

export interface CartLine {
  productId: string;
  qty: number;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered';

export type PaymentMethod = 'credit' | 'debit' | 'transfer' | 'webpay' | 'store';

export interface Customer {
  name: string;
  lastName: string;
  rut: string;
  phone: string;
  email: string;
  newsletter: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: string; // ISO
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discounts: number;
  total: number;
  /** Retiro en tienda (único local): sin despacho a domicilio */
  pickup: {
    storeId: string;
    date: string; // YYYY-MM-DD
  };
  /** El cliente declaró ser mayor de 18 años y presentará su cédula al retirar */
  ageConfirmed: boolean;
  customer: Customer;
  payment: { method: PaymentMethod; label: string };
  pointsEarned: number;
}

export interface User {
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
}

export interface Redemption {
  id: string;
  rewardId: string;
  title: string;
  points: number;
  date: string; // ISO
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  shape: ProductShape;
  colors: [string, string];
}

/** Movimiento de inventario (ventas, ajustes y reposiciones). */
export interface StockMove {
  id: string;
  date: string; // ISO
  productId: string;
  /** Variación de unidades (negativa en ventas) */
  delta: number;
  /** Stock resultante */
  after: number;
  reason: 'venta' | 'ajuste' | 'reposicion';
  /** Número de pedido (ventas) */
  ref?: string;
}
