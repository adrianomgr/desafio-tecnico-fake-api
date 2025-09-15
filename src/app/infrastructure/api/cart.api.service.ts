import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart, CartCreate, CartUpdate } from '../../domain/model/cart';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://fakestoreapi.com';

  getAllCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.baseUrl}/carts`);
  }

  getCartById(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/carts/${id}`);
  }

  getCartsByUserId(userId: number): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.baseUrl}/carts/user/${userId}`);
  }

  createCart(cart: CartCreate): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/carts`, cart);
  }

  updateCart(cart: CartUpdate): Observable<Cart> {
    return this.http.put<Cart>(`${this.baseUrl}/carts/${cart.id}`, cart);
  }

  deleteCart(id: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.baseUrl}/carts/${id}`);
  }

  getLimitedCarts(limit: number): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.baseUrl}/carts?limit=${limit}`);
  }

  getSortedCarts(sort: 'asc' | 'desc'): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.baseUrl}/carts?sort=${sort}`);
  }

  getCartsInDateRange(startDate: string, endDate: string): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.baseUrl}/carts?startdate=${startDate}&enddate=${endDate}`);
  }
}
