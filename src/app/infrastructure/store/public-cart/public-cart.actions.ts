import { createAction, props } from '@ngrx/store';
import { CartError } from '../../../domain/model/cart';
import { PublicCartItem } from '../../../domain/model/public-cart';

export const addToCart = createAction(
  '[Public Cart] Add To Cart',
  props<{ productId: number; quantity: number }>()
);

export const removeFromCart = createAction(
  '[Public Cart] Remove From Cart',
  props<{ productId: number }>()
);

export const updateCartQuantity = createAction(
  '[Public Cart] Update Cart Quantity',
  props<{ productId: number; quantity: number }>()
);

export const clearCart = createAction('[Public Cart] Clear Cart');

export const loadCartFromStorage = createAction('[Public Cart] Load Cart From Storage');

export const saveCartToStorage = createAction(
  '[Public Cart] Save Cart To Storage',
  props<{ items: PublicCartItem[] }>()
);

export const saveCartToServer = createAction(
  '[Public Cart] Save Cart To Server',
  props<{ userId?: number }>()
);

export const saveCartToServerSuccess = createAction(
  '[Public Cart] Save Cart To Server Success',
  props<{ cartId: number }>()
);

export const saveCartToServerFailure = createAction(
  '[Public Cart] Save Cart To Server Failure',
  props<{ error: CartError }>()
);
