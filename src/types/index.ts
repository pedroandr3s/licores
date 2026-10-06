export type CategorySlug =
  | 'perfumeria'
  | 'cuidado-personal'
  | 'limpieza'
  | 'hogar'
  | 'tecnologia'
  | 'snacks'
  | 'bebidas'
  | 'mascotas'
  | 'belleza'
  | 'infantil';

export type ProductShape =
  | 'perfume' | 'pump' | 'tube' | 'jar' | 'spray' | 'jug' | 'box' | 'bag' | 'can' | 'drink'
  | 'wine' | 'headphones' | 'speaker' | 'watch' | 'mug' | 'lamp' | 'blocks' | 'powerbank'
  | 'bowl' | 'lipstick' | 'compact' | 'plush' | 'pillow' | 'pot' | 'rolls' | 'sheets'
  | 'mouse' | 'rollon' | 'bottle';

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
  freeShipping: boolean;
  tags: string[];
  availableForDelivery: boolean;
  availableForPickup: boolean;
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

export type DeliveryMode = 'delivery' | 'pickup';

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'shipping' | 'delivered';

export type PaymentMethod = 'credit' | 'debit' | 'transfer' | 'webpay';

export interface Address {
  id: string;
  label: string;
  region: string;
  comuna: string;
  street: string;
  number: string;
  apartment?: string;
  notes?: string;
}

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
  shipping: number;
  total: number;
  delivery: {
    mode: DeliveryMode;
    address?: Address;
    storeId?: string;
    date: string; // YYYY-MM-DD
  };
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
