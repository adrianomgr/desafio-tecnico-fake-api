import { createReducer, on } from '@ngrx/store';
import { initialState } from '../../../domain/model/public-cart';
import * as PublicCartActions from './public-cart.actions';

export const publicCartReducer = createReducer(
  initialState,
  on(PublicCartActions.addToCart, (state, { productId, quantity }) => {
    const existingItem = state.items.find((item) => item.productId === productId);

    if (existingItem) {
      // Atualiza quantidade se já existe
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        ),
      };
    } else {
      return {
        ...state,
        items: [
          ...state.items,
          {
            productId,
            quantity,
            title: '', // Será preenchido pelo effect
            price: 0, // Será preenchido pelo effect
            image: '', // Será preenchido pelo effect
          },
        ],
      };
    }
  }),

  on(PublicCartActions.removeFromCart, (state, { productId }) => ({
    ...state,
    items: state.items.filter((item) => item.productId !== productId),
  })),

  on(PublicCartActions.updateCartQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      // Remove item se quantidade for 0 ou menor
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== productId),
      };
    }

    return {
      ...state,
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    };
  }),

  on(PublicCartActions.clearCart, (state) => ({
    ...state,
    items: [],
  })),

  on(PublicCartActions.loadCartFromStorage, (state) => ({
    ...state,
    loading: true,
  })),

  on(PublicCartActions.saveCartToStorage, (state, { items }) => ({
    ...state,
    items: items,
    loading: false,
  })),

  on(PublicCartActions.saveCartToServer, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PublicCartActions.saveCartToServerSuccess, (state) => ({
    ...state,
    loading: false,
    items: [], // Limpa carrinho após salvar
  })),

  on(PublicCartActions.saveCartToServerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
