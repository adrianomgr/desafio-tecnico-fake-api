import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../domain/model/product';
import { ProductApiService } from '../infrastructure/api/product.api.service';
import * as ProductActions from '../infrastructure/store/product/product.actions';
import * as ProductSelectors from '../infrastructure/store/product/product.selectors';

@Injectable({
  providedIn: 'root',
})
export class PublicHomeFacadeService {
  private readonly store = inject(Store);
  private readonly productApiService = inject(ProductApiService);

  products$ = this.store.select(ProductSelectors.selectAllProducts);
  categories$ = this.store.select(ProductSelectors.selectCategories);
  loading$ = this.store.select(ProductSelectors.selectProductsLoading);
  error$ = this.store.select(ProductSelectors.selectProductsError);

  loadProducts(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }

  loadCategories(): void {
    this.store.dispatch(ProductActions.loadCategories());
  }

  getAllProducts(): Observable<Product[]> {
    return this.productApiService.getAllProducts();
  }

  getAllCategories(): Observable<string[]> {
    return this.productApiService.getAllCategories();
  }
}
