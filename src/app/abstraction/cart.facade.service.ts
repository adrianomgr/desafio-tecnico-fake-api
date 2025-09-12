import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Cart, CartCreate, CartProduct, CartUpdate, CartWithDetails } from '../domain/model/cart';
import { CartApiService } from '../infrastructure/api/cart.api.service';
import * as CartActions from '../infrastructure/store/cart/cart.actions';
import * as CartSelectors from '../infrastructure/store/cart/cart.selectors';

@Injectable({
  providedIn: 'root',
})
export class CartFacadeService {
  // Selectors
  readonly carts$: Observable<Cart[]>;
  readonly currentCart$: Observable<Cart | null>;
  readonly localCartItems$: Observable<CartProduct[]>;
  readonly localCartTotal$: Observable<number>;
  readonly localCartItemCount$: Observable<number>;
  readonly loading$: Observable<boolean>;
  readonly error$: Observable<any>;

  constructor(private readonly store: Store, private readonly cartApiService: CartApiService) {
    this.carts$ = this.store.select(CartSelectors.selectAllCarts);
    this.currentCart$ = this.store.select(CartSelectors.selectCurrentCart);
    this.localCartItems$ = this.store.select(CartSelectors.selectLocalCartItems);
    this.localCartTotal$ = this.store.select(CartSelectors.selectLocalCartTotal);
    this.localCartItemCount$ = this.store.select(CartSelectors.selectLocalCartItemCount);
    this.loading$ = this.store.select(CartSelectors.selectCartsLoading);
    this.error$ = this.store.select(CartSelectors.selectCartsError);
  }

  // Cart Actions
  loadCarts(): void {
    this.store.dispatch(CartActions.loadCarts());
  }

  // Método específico para admin - carregar carrinhos com dados populados
  loadCartsWithDetails(): Observable<CartWithDetails[]> {
    return this.cartApiService.getAllCartsWithDetails();
  }

  loadUserCarts(userId: number): void {
    this.store.dispatch(CartActions.loadUserCarts({ userId }));
  }

  loadCart(id: number): void {
    this.store.dispatch(CartActions.loadCart({ id }));
  }

  createCart(cart: CartCreate): void {
    this.store.dispatch(CartActions.createCart({ cart }));
  }

  updateCart(cart: CartUpdate): void {
    this.store.dispatch(CartActions.updateCart({ cart }));
  }

  deleteCart(id: number): void {
    this.store.dispatch(CartActions.deleteCart({ id }));
  }

  // Local Cart Actions (for managing cart in frontend before persisting)
  addToLocalCart(productId: number, quantity: number = 1): void {
    this.store.dispatch(CartActions.addToLocalCart({ productId, quantity }));
  }

  removeFromLocalCart(productId: number): void {
    this.store.dispatch(CartActions.removeFromLocalCart({ productId }));
  }

  updateLocalCartQuantity(productId: number, quantity: number): void {
    this.store.dispatch(CartActions.updateLocalCartQuantity({ productId, quantity }));
  }

  clearLocalCart(): void {
    this.store.dispatch(CartActions.clearLocalCart());
  }

  setCurrentCart(cart: Cart | null): void {
    this.store.dispatch(CartActions.setCurrentCart({ cart }));
  }

  // Helper method to save local cart to server
  saveLocalCartToServer(userId: number): void {
    // This will be handled by effects - dispatching the local cart items to create a new cart
    this.store.dispatch(CartActions.saveLocalCartToServer({ userId }));
  }
}
