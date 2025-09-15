import { CartError } from '../model/cart';
import { Product } from '../model/product';
import { PublicCartItem } from '../model/public-cart';

export interface CartViewData {
  cartItems: PublicCartItem[];
  products: Product[];
  loading: boolean;
  error: CartError | null;
}
