import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Cart, CartProduct } from '../../../domain/model/cart';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

// Cart selectors
export const selectAllCarts = createSelector(selectCartState, (state) => state.carts);

export const selectCurrentCart = createSelector(selectCartState, (state) => state.currentCart);

export const selectCartsLoading = createSelector(selectCartState, (state) => state.loading);

export const selectCartsError = createSelector(selectCartState, (state) => state.error);

// Local cart selectors
export const selectLocalCartItems = createSelector(
  selectCartState,
  (state) => state.localCartItems
);

export const selectLocalCartItemCount = createSelector(
  selectLocalCartItems,
  (items: CartProduct[]) =>
    items.reduce((total: number, item: CartProduct) => total + item.quantity, 0)
);

export const selectLocalCartTotal = createSelector(selectLocalCartItems, (items: CartProduct[]) => {
  // Note: This would need product prices to calculate the actual total
  // For now, returning the count. In a real app, you'd need to join with product data
  return items.reduce((total: number, item: CartProduct) => total + item.quantity, 0);
});

// Helper selectors
export const selectCartById = (id: number) =>
  createSelector(selectAllCarts, (carts: Cart[]) => carts.find((cart: Cart) => cart.id === id));

export const selectCartsByUserId = (userId: number) =>
  createSelector(selectAllCarts, (carts: Cart[]) =>
    carts.filter((cart: Cart) => cart.userId === userId)
  );

export const selectIsProductInLocalCart = (productId: number) =>
  createSelector(selectLocalCartItems, (items: CartProduct[]) =>
    items.some((item: CartProduct) => item.productId === productId)
  );

export const selectLocalCartProductQuantity = (productId: number) =>
  createSelector(selectLocalCartItems, (items: CartProduct[]) => {
    const item = items.find((item: CartProduct) => item.productId === productId);
    return item ? item.quantity : 0;
  });
