import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductCreate, ProductUpdate } from '../../domain/model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://fakestoreapi.com/products';

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/category/${category}`);
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }

  createProduct(product: ProductCreate): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  updateProduct(product: ProductUpdate): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.baseUrl}/${id}`);
  }
}
