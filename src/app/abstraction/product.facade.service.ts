import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ProductCreate, ProductUpdate } from '../domain/model/product';
import { ProductApiService } from '../infrastructure/api/product.api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductFacadeService {
  private readonly productApiService = inject(ProductApiService);

  private readonly _products$ = new BehaviorSubject<Product[]>([]);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _error$ = new BehaviorSubject<string | null>(null);

  readonly products$ = this._products$.asObservable();
  readonly loading$ = this._loading$.asObservable();
  readonly error$ = this._error$.asObservable();

  loadProducts(): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.productApiService.getAllProducts().subscribe({
      next: (products) => {
        this._products$.next(products);
        this._loading$.next(false);
      },
      error: (error) => {
        this._error$.next(error.message || 'Erro ao carregar produtos');
        this._loading$.next(false);
      },
    });
  }

  getAllProducts(): Observable<Product[]> {
    return this.productApiService.getAllProducts();
  }

  getAllCategories(): Observable<string[]> {
    return this.productApiService.getAllCategories();
  }

  loadCategories(): Observable<string[]> {
    return this.productApiService.getAllCategories();
  }

  loadProduct(id: number): Observable<Product> {
    return this.productApiService.getProductById(id);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.productApiService.deleteProduct(id);
  }

  createProduct(product: ProductCreate): Observable<Product> {
    return this.productApiService.createProduct(product);
  }

  updateProduct(product: ProductUpdate): Observable<Product> {
    return this.productApiService.updateProduct(product);
  }
}
