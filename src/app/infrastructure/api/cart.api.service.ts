import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart, CartCreate, CartUpdate } from '../../domain/model/cart';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://fakestoreapi.com/carts';

  getAllCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.baseUrl}`);
  }

  createCart(cart: CartCreate): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}`, cart);
  }

  updateCart(cart: CartUpdate): Observable<Cart> {
    return this.http.put<Cart>(`${this.baseUrl}/${cart.id}`, cart);
  }

  deleteCart(id: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.baseUrl}/${id}`);
  }
}
