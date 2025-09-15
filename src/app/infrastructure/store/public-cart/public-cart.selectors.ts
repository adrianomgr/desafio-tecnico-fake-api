import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PublicCartItem, PublicCartState } from '../../../domain/model/public-cart';

export const selectPublicCartState = createFeatureSelector<PublicCartState>('publicCart');

export const selectCartItems = createSelector(selectPublicCartState, (state) => state.items);

export const selectCartItemCount = createSelector(selectCartItems, (items: PublicCartItem[]) =>
  items.reduce((total: number, item: PublicCartItem) => total + item.quantity, 0)
);

export const selectCartTotal = createSelector(selectCartItems, (items: PublicCartItem[]) =>
  items.reduce((total: number, item: PublicCartItem) => total + item.price * item.quantity, 0)
);

export const selectCartLoading = createSelector(selectPublicCartState, (state) => state.loading);

export const selectCartError = createSelector(selectPublicCartState, (state) => state.error);

export const selectCartItemById = (productId: number) =>
  createSelector(selectCartItems, (items: PublicCartItem[]) =>
    items.find((item: PublicCartItem) => item.productId === productId)
  );

export const selectIsProductInCart = (productId: number) =>
  createSelector(selectCartItems, (items: PublicCartItem[]) =>
    items.some((item: PublicCartItem) => item.productId === productId)
  );
