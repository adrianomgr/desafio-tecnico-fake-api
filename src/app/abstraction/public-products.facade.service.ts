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
export class PublicProductsFacadeService {
  private readonly store = inject(Store);
  private readonly productApiService = inject(ProductApiService);

  filteredProducts$ = this.store.select(ProductSelectors.selectFilteredProducts);
  selectedCategory$ = this.store.select(ProductSelectors.selectSelectedCategory);
  searchTerm$ = this.store.select(ProductSelectors.selectSearchTerm);
  categories$ = this.store.select(ProductSelectors.selectCategories);
  loading$ = this.store.select(ProductSelectors.selectProductsLoading);
  error$ = this.store.select(ProductSelectors.selectProductsError);

  loadProducts(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }

  loadCategories(): void {
    this.store.dispatch(ProductActions.loadCategories());
  }

  loadProductsByCategory(category: string): void {
    this.store.dispatch(ProductActions.loadProductsByCategory({ category }));
  }

  setSelectedCategory(category: string | null): void {
    this.store.dispatch(ProductActions.setSelectedCategory({ category }));
  }

  setSearchTerm(searchTerm: string): void {
    this.store.dispatch(ProductActions.setSearchTerm({ searchTerm }));
  }

  setSortOrder(sortOrder: 'asc' | 'desc' | null): void {
    this.store.dispatch(ProductActions.setSortOrder({ sortOrder }));
  }

  clearFilters(): void {
    this.store.dispatch(ProductActions.setSelectedCategory({ category: null }));
    this.store.dispatch(ProductActions.setSearchTerm({ searchTerm: '' }));
  }

  clearState(): void {
    this.store.dispatch(ProductActions.clearProductState());
  }

  getAllProducts(): Observable<Product[]> {
    return this.productApiService.getAllProducts();
  }

  getAllCategories(): Observable<string[]> {
    return this.productApiService.getAllCategories();
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.productApiService.getProductsByCategory(category);
  }
}
