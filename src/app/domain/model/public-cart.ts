import { CartError } from './cart';

export interface PublicCartItem {
  productId: number;
  quantity: number;
  title: string;
  price: number;
  image: string;
}

export interface PublicCartState {
  items: PublicCartItem[];
  loading: boolean;
  error: CartError | null;
}

export const initialState: PublicCartState = {
  items: [],
  loading: false,
  error: null,
};
