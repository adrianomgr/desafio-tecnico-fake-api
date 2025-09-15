import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartViewData } from '../domain/interface/cart-view-data.interface';
import { CartError } from '../domain/model/cart';
import { PublicCartItem } from '../domain/model/public-cart';
import * as ProductSelectors from '../infrastructure/store/product/product.selectors';
import * as PublicCartActions from '../infrastructure/store/public-cart/public-cart.actions';
import * as PublicCartSelectors from '../infrastructure/store/public-cart/public-cart.selectors';

@Injectable({
  providedIn: 'root',
})
export class CartFacadeService {
  readonly localCartItems$: Observable<PublicCartItem[]>;
  readonly localCartItemCount$: Observable<number>;
  readonly localCartTotal$: Observable<number>;
  readonly loading$: Observable<boolean>;
  readonly error$: Observable<CartError | null>;

  constructor(private readonly store: Store) {
    this.localCartItems$ = this.store.select(PublicCartSelectors.selectCartItems);
    this.localCartItemCount$ = this.store.select(PublicCartSelectors.selectCartItemCount);
    this.localCartTotal$ = this.store.select(PublicCartSelectors.selectCartTotal);
    this.loading$ = this.store.select(PublicCartSelectors.selectCartLoading);
    this.error$ = this.store.select(PublicCartSelectors.selectCartError);
  }

  addToLocalCart(productId: number, quantity: number = 1): void {
    this.store.dispatch(PublicCartActions.addToCart({ productId, quantity }));
  }

  removeFromLocalCart(productId: number): void {
    this.store.dispatch(PublicCartActions.removeFromCart({ productId }));
  }

  updateLocalCartQuantity(productId: number, quantity: number): void {
    this.store.dispatch(PublicCartActions.updateCartQuantity({ productId, quantity }));
  }

  clearLocalCart(): void {
    this.store.dispatch(PublicCartActions.clearCart());
  }

  getCartViewData(): Observable<CartViewData> {
    return combineLatest([
      this.localCartItems$,
      this.store.select(ProductSelectors.selectAllProducts),
      this.loading$,
      this.error$,
    ]).pipe(
      map(([cartItems, products, loading, error]) => ({
        cartItems,
        products,
        loading,
        error,
      }))
    );
  }
}
