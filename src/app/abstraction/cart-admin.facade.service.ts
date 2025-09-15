import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, switchMap, tap } from 'rxjs';
import { CartProduct, CartProductWithDetails, CartWithDetails } from '../domain/model/cart';
import { Product } from '../domain/model/product';
import { User } from '../domain/model/user';
import { CartApiService } from '../infrastructure/api/cart.api.service';
import { ProductApiService } from '../infrastructure/api/product.api.service';
import { UserApiService } from '../infrastructure/api/user.api.service';

@Injectable({
  providedIn: 'root',
})
export class CartAdminFacadeService {
  private readonly _cartsWithDetails$ = new BehaviorSubject<CartWithDetails[]>([]);

  constructor(
    private readonly cartApiService: CartApiService,
    private readonly userApiService: UserApiService,
    private readonly productApiService: ProductApiService
  ) {}

  get cartsWithDetails$() {
    return this._cartsWithDetails$.asObservable();
  }

  loadCartsWithDetails(): void {
    if (this._cartsWithDetails$.value.length > 0) {
      return;
    }

    this.refreshCartsWithDetails();
  }

  refreshCartsWithDetails(): void {
    this.cartApiService
      .getAllCarts()
      .pipe(
        switchMap((carts) => {
          const userIds = [...new Set(carts.map((cart) => cart.userId))];
          const productIds = [
            ...new Set(carts.flatMap((cart) => cart.products.map((p) => p.productId))),
          ];

          const users$ = forkJoin(userIds.map((userId) => this.userApiService.getUserById(userId)));

          const products$ = forkJoin(
            productIds.map((productId) => this.productApiService.getProductById(productId))
          );

          return forkJoin([users$, products$]).pipe(
            map(([users, products]) => this.mapCartsWithDetails(carts, users, products))
          );
        }),
        tap({
          next: (cartsWithDetails) => {
            this._cartsWithDetails$.next(cartsWithDetails);
          },
        })
      )
      .subscribe();
  }

  private mapCartsWithDetails(carts: any[], users: User[], products: Product[]): CartWithDetails[] {
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

  private mapCartProductsWithDetails(
    cartProducts: CartProduct[],
    products: Product[]
  ): CartProductWithDetails[] {
    return cartProducts.map((cartProduct) => {
      const product = products.find((p) => p.id === cartProduct.productId);
      return {
        ...cartProduct,
        product,
        subtotal: product ? product.price * cartProduct.quantity : 0,
      };
    });
  }

  private calculateTotalValue(productsWithDetails: CartProductWithDetails[]): number {
    return productsWithDetails.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  }

  private calculateTotalItems(products: CartProduct[]): number {
    return products.reduce((sum, item) => sum + item.quantity, 0);
  }
}
