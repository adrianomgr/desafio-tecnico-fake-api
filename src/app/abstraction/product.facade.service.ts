import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product, ProductCreate, ProductUpdate } from '../domain/model/product';
import * as ProductActions from '../infrastructure/store/product/product.actions';
import * as ProductSelectors from '../infrastructure/store/product/product.selectors';

@Injectable({
  providedIn: 'root',
})
export class ProductFacadeService {
  // Selectors
  readonly products$: Observable<Product[]>;
  readonly filteredProducts$: Observable<Product[]>;
  readonly selectedProduct$: Observable<Product | null>;
  readonly categories$: Observable<string[]>;
  readonly selectedCategory$: Observable<string | null>;
  readonly searchTerm$: Observable<string>;
  readonly sortOrder$: Observable<'asc' | 'desc' | null>;
  readonly loading$: Observable<boolean>;
  readonly error$: Observable<any>;

  constructor(private readonly store: Store) {
    this.products$ = this.store.select(ProductSelectors.selectAllProducts);
    this.filteredProducts$ = this.store.select(ProductSelectors.selectFilteredProducts);
    this.selectedProduct$ = this.store.select(ProductSelectors.selectSelectedProduct);
    this.categories$ = this.store.select(ProductSelectors.selectCategories);
    this.selectedCategory$ = this.store.select(ProductSelectors.selectSelectedCategory);
    this.searchTerm$ = this.store.select(ProductSelectors.selectSearchTerm);
    this.sortOrder$ = this.store.select(ProductSelectors.selectSortOrder);
    this.loading$ = this.store.select(ProductSelectors.selectProductsLoading);
    this.error$ = this.store.select(ProductSelectors.selectProductsError);
  }

  // Actions
  loadProducts(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }

  loadProductsByCategory(category: string): void {
    this.store.dispatch(ProductActions.loadProductsByCategory({ category }));
  }

  loadCategories(): void {
    this.store.dispatch(ProductActions.loadCategories());
  }

  loadProduct(id: number): void {
    this.store.dispatch(ProductActions.loadProduct({ id }));
  }

  createProduct(product: ProductCreate): void {
    this.store.dispatch(ProductActions.createProduct({ product }));
  }

  updateProduct(product: ProductUpdate): void {
    this.store.dispatch(ProductActions.updateProduct({ product }));
  }

  deleteProduct(id: number): void {
    this.store.dispatch(ProductActions.deleteProduct({ id }));
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

  clearState(): void {
    this.store.dispatch(ProductActions.clearProductState());
  }

  getProductById(id: number): Observable<Product | null> {
    return this.store.select(ProductSelectors.selectProductById(id));
  }
}
