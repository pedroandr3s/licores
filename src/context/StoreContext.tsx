'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { CartLine, Order, OrderStatus, Redemption, User } from '@/types';
import { DEMO_POINTS, STORAGE_KEY } from '@/lib/constants';
import { getProduct, maxQty } from '@/data/products';
import { mockOrders } from '@/data/orders';
import { calcTotals, type PricedLine, type Totals } from '@/lib/pricing';

export interface PersistedState {
  cart: CartLine[];
  favorites: string[];
  user: User | null;
  orders: Order[];
  points: number;
  redemptions: Redemption[];
  /** El visitante confirmó ser mayor de 18 años (se recuerda en este navegador) */
  ageVerified: boolean;
}

const initialState: PersistedState = {
  cart: [],
  favorites: [],
  user: null,
  orders: mockOrders,
  points: DEMO_POINTS,
  redemptions: [],
  ageVerified: false,
};

export type Action =
  | { type: 'HYDRATE'; state: Partial<PersistedState> }
  | { type: 'CART_ADD'; productId: string; qty: number }
  | { type: 'CART_SET'; productId: string; qty: number }
  | { type: 'CART_REMOVE'; productId: string }
  | { type: 'CART_CLEAR' }
  | { type: 'FAV_TOGGLE'; productId: string }
  | { type: 'FAV_CLEAR' }
  | { type: 'LOGIN'; user: User; points?: number }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; user: Partial<User> }
  | { type: 'ORDER_ADD'; order: Order }
  | { type: 'ORDER_STATUS'; id: string; status: OrderStatus }
  | { type: 'REDEEM'; redemption: Redemption }
  | { type: 'AGE_CONFIRM' }
  | { type: 'RESET' };

function reducer(state: PersistedState, action: Action): PersistedState {
  switch (action.type) {
    case 'HYDRATE': {
      const merged = { ...state, ...action.state };
      merged.cart = merged.cart.filter((l) => getProduct(l.productId));
      merged.favorites = merged.favorites.filter((id) => getProduct(id));
      return merged;
    }
    case 'CART_ADD': {
      const p = getProduct(action.productId);
      if (!p) return state;
      const max = maxQty(p);
      const existing = state.cart.find((l) => l.productId === p.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((l) =>
            l.productId === p.id ? { ...l, qty: Math.min(max, l.qty + action.qty) } : l,
          ),
        };
      }
      if (max <= 0) return state;
      return { ...state, cart: [...state.cart, { productId: p.id, qty: Math.min(max, action.qty) }] };
    }
    case 'CART_SET': {
      const p = getProduct(action.productId);
      if (!p) return state;
      if (action.qty <= 0) return { ...state, cart: state.cart.filter((l) => l.productId !== p.id) };
      const qty = Math.min(maxQty(p), action.qty);
      return { ...state, cart: state.cart.map((l) => (l.productId === p.id ? { ...l, qty } : l)) };
    }
    case 'CART_REMOVE':
      return { ...state, cart: state.cart.filter((l) => l.productId !== action.productId) };
    case 'CART_CLEAR':
      return { ...state, cart: [] };
    case 'FAV_TOGGLE':
      return {
        ...state,
        favorites: state.favorites.includes(action.productId)
          ? state.favorites.filter((id) => id !== action.productId)
          : [action.productId, ...state.favorites],
      };
    case 'FAV_CLEAR':
      return { ...state, favorites: [] };
    case 'LOGIN':
      return { ...state, user: action.user, points: action.points ?? state.points };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'UPDATE_USER':
      return state.user ? { ...state, user: { ...state.user, ...action.user } } : state;
    case 'ORDER_ADD':
      return {
        ...state,
        orders: [action.order, ...state.orders],
        cart: [],
        points: state.user ? state.points + action.order.pointsEarned : state.points,
      };
    case 'ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.id ? { ...o, status: action.status } : o)),
      };
    case 'REDEEM':
      return {
        ...state,
        points: Math.max(0, state.points - action.redemption.points),
        redemptions: [action.redemption, ...state.redemptions],
      };
    case 'AGE_CONFIRM':
      return { ...state, ageVerified: true };
    case 'RESET':
      // La confirmación de edad se conserva: restablecer la demo no la borra
      return { ...initialState, ageVerified: state.ageVerified };
    default:
      return state;
  }
}

interface StoreValue extends PersistedState {
  hydrated: boolean;
  dispatch: Dispatch<Action>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // Cargar desde localStorage una sola vez en el cliente
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'HYDRATE', state: JSON.parse(raw) as Partial<PersistedState> });
    } catch {
      /* almacenamiento no disponible o JSON inválido: se parte desde cero */
    }
    setHydrated(true);
  }, []);

  // Persistir cada cambio (después de hidratar para no pisar los datos guardados)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* cuota excedida o modo privado */
    }
  }, [state, hydrated]);

  const value = useMemo<StoreValue>(() => ({ ...state, hydrated, dispatch }), [state, hydrated]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore debe usarse dentro de <StoreProvider>');
  return ctx;
}

export function useCartLines(): PricedLine[] {
  const { cart } = useStore();
  return useMemo(
    () =>
      cart.flatMap((l) => {
        const product = getProduct(l.productId);
        return product ? [{ product, qty: l.qty }] : [];
      }),
    [cart],
  );
}

export function useCartTotals(): Totals & { lines: PricedLine[] } {
  const lines = useCartLines();
  return useMemo(() => ({ ...calcTotals(lines), lines }), [lines]);
}
