import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Cart, CartCreate, CartUpdate, CartWithDetails } from '../../domain/model/cart';
import { Product } from '../../domain/model/product';
import { User } from '../../domain/model/user';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  private readonly baseUrl = 'https://fakestoreapi.com';

  constructor(private readonly http: HttpClient) {}

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

  // Método para buscar carrinhos com dados de usuários e produtos populados
  getAllCartsWithDetails(): Observable<CartWithDetails[]> {
    return this.getAllCarts().pipe(
      switchMap((carts) => {
        // Buscar todos os usuários e produtos únicos
        const userIds = [...new Set(carts.map((cart) => cart.userId))];
        const productIds = [
          ...new Set(carts.flatMap((cart) => cart.products.map((p) => p.productId))),
        ];

        const users$ = forkJoin(
          userIds.map((userId) => this.http.get<User>(`${this.baseUrl}/users/${userId}`))
        );

        const products$ = forkJoin(
          productIds.map((productId) =>
            this.http.get<Product>(`${this.baseUrl}/products/${productId}`)
          )
        );

        return forkJoin([users$, products$]).pipe(
          map(([users, products]) => this.mapCartsWithDetails(carts, users, products))
        );
      })
    );
  }

  private mapCartsWithDetails(
    carts: Cart[],
    users: User[],
    products: Product[]
  ): CartWithDetails[] {
    return carts.map((cart) => {
      const user = users.find((u) => u.id === cart.userId);
      const productsWithDetails = this.mapCartProductsWithDetails(cart.products, products);
      const totalValue = this.calculateTotalValue(productsWithDetails);
      const totalItems = this.calculateTotalItems(cart.products);

      return {
        ...cart,
        user,
        productsWithDetails,
        totalValue,
        totalItems,
      } as CartWithDetails;
    });
  }

  private mapCartProductsWithDetails(cartProducts: any[], products: Product[]) {
    return cartProducts.map((cartProduct) => {
      const product = products.find((p) => p.id === cartProduct.productId);
      return {
        ...cartProduct,
        product,
        subtotal: product ? product.price * cartProduct.quantity : 0,
      };
    });
  }

  private calculateTotalValue(productsWithDetails: any[]): number {
    return productsWithDetails.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  }

  private calculateTotalItems(products: any[]): number {
    return products.reduce((sum, item) => sum + item.quantity, 0);
  }
}
