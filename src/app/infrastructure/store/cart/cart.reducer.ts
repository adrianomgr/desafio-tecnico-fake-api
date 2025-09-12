import { createReducer, on } from '@ngrx/store';
import { Cart, CartProduct } from '../../../domain/model/cart';
import * as CartActions from './cart.actions';

export interface CartState {
  carts: Cart[];
  currentCart: Cart | null;
  localCartItems: CartProduct[];
  loading: boolean;
  error: any;
}

export const initialState: CartState = {
  carts: [],
  currentCart: null,
  localCartItems: [],
  loading: false,
  error: null,
};

export const cartReducer = createReducer(
  initialState,

  // Load Carts
  on(CartActions.loadCarts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CartActions.loadCartsSuccess, (state, { carts }) => ({
    ...state,
    carts,
    loading: false,
    error: null,
  })),
  on(CartActions.loadCartsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load User Carts
  on(CartActions.loadUserCarts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CartActions.loadUserCartsSuccess, (state, { carts }) => ({
    ...state,
    carts,
    loading: false,
    error: null,
  })),
  on(CartActions.loadUserCartsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Cart
  on(CartActions.loadCart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CartActions.loadCartSuccess, (state, { cart }) => ({
    ...state,
    currentCart: cart,
    loading: false,
    error: null,
  })),
  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Cart
  on(CartActions.createCart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CartActions.createCartSuccess, (state, { cart }) => ({
    ...state,
    carts: [...state.carts, cart],
    currentCart: cart,
    loading: false,
    error: null,
  })),
  on(CartActions.createCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Cart
  on(CartActions.updateCart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CartActions.updateCartSuccess, (state, { cart }) => ({
    ...state,
    carts: state.carts.map((c) => (c.id === cart.id ? cart : c)),
    currentCart: state.currentCart?.id === cart.id ? cart : state.currentCart,
    loading: false,
    error: null,
  })),
  on(CartActions.updateCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Cart
  on(CartActions.deleteCart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CartActions.deleteCartSuccess, (state, { id }) => ({
    ...state,
    carts: state.carts.filter((cart) => cart.id !== id),
    currentCart: state.currentCart?.id === id ? null : state.currentCart,
    loading: false,
    error: null,
  })),
  on(CartActions.deleteCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Local Cart Management
  on(CartActions.addToLocalCart, (state, { productId, quantity }) => {
    const existingItemIndex = state.localCartItems.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...state.localCartItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
      };
      return {
        ...state,
        localCartItems: updatedItems,
      };
    } else {
      // Add new item
      return {
        ...state,
        localCartItems: [...state.localCartItems, { productId, quantity }],
      };
    }
  }),

  on(CartActions.removeFromLocalCart, (state, { productId }) => ({
    ...state,
    localCartItems: state.localCartItems.filter((item) => item.productId !== productId),
  })),

  on(CartActions.updateLocalCartQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      return {
        ...state,
        localCartItems: state.localCartItems.filter((item) => item.productId !== productId),
      };
    }

    const existingItemIndex = state.localCartItems.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...state.localCartItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity,
      };
      return {
        ...state,
        localCartItems: updatedItems,
      };
    }

    return state;
  }),

  on(CartActions.clearLocalCart, (state) => ({
    ...state,
    localCartItems: [],
  })),

  on(CartActions.setCurrentCart, (state, { cart }) => ({
    ...state,
    currentCart: cart,
  }))
);
