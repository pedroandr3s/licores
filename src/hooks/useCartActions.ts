'use client';

import { useCallback } from 'react';
import type { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { maxQty } from '@/data/products';

export function useCartActions() {
  const { cart, dispatch } = useStore();
  const { toast } = useUI();

  const qtyInCart = useCallback(
    (productId: string) => cart.find((l) => l.productId === productId)?.qty ?? 0,
    [cart],
  );

  const add = useCallback(
    (p: Product, qty = 1, opts?: { silent?: boolean }) => {
      if (p.stock <= 0) {
        toast({ type: 'error', title: 'Producto agotado', description: 'Por ahora no tenemos stock de este producto.' });
        return false;
      }
      const max = maxQty(p);
      const current = cart.find((l) => l.productId === p.id)?.qty ?? 0;
      if (current >= max) {
        toast({ type: 'info', title: `Máximo ${max} unidades por compra`, description: p.name });
        return false;
      }
      dispatch({ type: 'CART_ADD', productId: p.id, qty });
      if (!opts?.silent) {
        toast({
          type: 'success',
          title: 'Producto agregado al carrito',
          description: p.name,
          action: { label: 'Ver carrito', href: '/carrito' },
        });
      }
      return true;
    },
    [cart, dispatch, toast],
  );

  const setQty = useCallback(
    (productId: string, qty: number) => dispatch({ type: 'CART_SET', productId, qty }),
    [dispatch],
  );

  const remove = useCallback(
    (p: Product) => {
      dispatch({ type: 'CART_REMOVE', productId: p.id });
      toast({
        type: 'info',
        title: 'Producto eliminado',
        description: p.name,
        action: { label: 'Deshacer', onClick: () => dispatch({ type: 'CART_ADD', productId: p.id, qty: 1 }) },
      });
    },
    [dispatch, toast],
  );

  return { add, setQty, remove, qtyInCart };
}

export function useFavorite(productId: string) {
  const { favorites, dispatch } = useStore();
  const { toast } = useUI();
  const isFav = favorites.includes(productId);
  const toggle = useCallback(() => {
    dispatch({ type: 'FAV_TOGGLE', productId });
    toast(
      isFav
        ? { type: 'info', title: 'Quitado de favoritos' }
        : { type: 'success', title: 'Agregado a favoritos', action: { label: 'Ver favoritos', href: '/favoritos' } },
    );
  }, [dispatch, toast, isFav, productId]);
  return { isFav, toggle };
}
