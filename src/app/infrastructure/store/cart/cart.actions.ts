import { createAction, props } from '@ngrx/store';
import { Cart, CartCreate, CartUpdate } from '../../../domain/model/cart';

export const loadCarts = createAction('[Cart] Load Carts');
export const loadCartsSuccess = createAction(
  '[Cart] Load Carts Success',
  props<{ carts: Cart[] }>()
);
export const loadCartsFailure = createAction('[Cart] Load Carts Failure', props<{ error: any }>());

export const loadUserCarts = createAction('[Cart] Load User Carts', props<{ userId: number }>());
export const loadUserCartsSuccess = createAction(
  '[Cart] Load User Carts Success',
  props<{ carts: Cart[] }>()
);
export const loadUserCartsFailure = createAction(
  '[Cart] Load User Carts Failure',
  props<{ error: any }>()
);

export const loadCart = createAction('[Cart] Load Cart', props<{ id: number }>());
export const loadCartSuccess = createAction('[Cart] Load Cart Success', props<{ cart: Cart }>());
export const loadCartFailure = createAction('[Cart] Load Cart Failure', props<{ error: any }>());

export const createCart = createAction('[Cart] Create Cart', props<{ cart: CartCreate }>());
export const createCartSuccess = createAction(
  '[Cart] Create Cart Success',
  props<{ cart: Cart }>()
);
export const createCartFailure = createAction(
  '[Cart] Create Cart Failure',
  props<{ error: any }>()
);

export const updateCart = createAction('[Cart] Update Cart', props<{ cart: CartUpdate }>());
export const updateCartSuccess = createAction(
  '[Cart] Update Cart Success',
  props<{ cart: Cart }>()
);
export const updateCartFailure = createAction(
  '[Cart] Update Cart Failure',
  props<{ error: any }>()
);

export const deleteCart = createAction('[Cart] Delete Cart', props<{ id: number }>());
export const deleteCartSuccess = createAction(
  '[Cart] Delete Cart Success',
  props<{ id: number }>()
);
export const deleteCartFailure = createAction(
  '[Cart] Delete Cart Failure',
  props<{ error: any }>()
);

// Local cart actions (for managing cart in frontend before persisting)
export const addToLocalCart = createAction(
  '[Cart] Add To Local Cart',
  props<{ productId: number; quantity: number }>()
);

export const removeFromLocalCart = createAction(
  '[Cart] Remove From Local Cart',
  props<{ productId: number }>()
);

export const updateLocalCartQuantity = createAction(
  '[Cart] Update Local Cart Quantity',
  props<{ productId: number; quantity: number }>()
);

export const clearLocalCart = createAction('[Cart] Clear Local Cart');

export const setCurrentCart = createAction(
  '[Cart] Set Current Cart',
  props<{ cart: Cart | null }>()
);

export const saveLocalCartToServer = createAction(
  '[Cart] Save Local Cart To Server',
  props<{ userId: number }>()
);
