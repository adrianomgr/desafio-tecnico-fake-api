import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../domain/model/product';
import { ProductApiService } from '../infrastructure/api/product.api.service';
import * as ProductActions from '../infrastructure/store/product/product.actions';
import * as ProductSelectors from '../infrastructure/store/product/product.selectors';
import * as PublicCartActions from '../infrastructure/store/public-cart/public-cart.actions';
import * as PublicCartSelectors from '../infrastructure/store/public-cart/public-cart.selectors';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailFacadeService {
  private readonly store = inject(Store);
  private readonly productApiService = inject(ProductApiService);

  selectedProduct$ = this.store.select(ProductSelectors.selectSelectedProduct);
  loading$ = this.store.select(ProductSelectors.selectProductsLoading);
  error$ = this.store.select(ProductSelectors.selectProductsError);

  localCartItems$ = this.store.select(PublicCartSelectors.selectCartItems);

  loadProduct(id: number): void {
    this.store.dispatch(ProductActions.loadProduct({ id }));
  }

  getProductById(id: number): Observable<Product> {
    return this.productApiService.getProductById(id);
  }

  addToLocalCart(productId: number, quantity: number): void {
    this.store.dispatch(PublicCartActions.addToCart({ productId, quantity }));
  }

  updateLocalCartQuantity(productId: number, quantity: number): void {
    this.store.dispatch(PublicCartActions.updateCartQuantity({ productId, quantity }));
  }

  removeFromLocalCart(productId: number): void {
    this.store.dispatch(PublicCartActions.removeFromCart({ productId }));
  }
}
