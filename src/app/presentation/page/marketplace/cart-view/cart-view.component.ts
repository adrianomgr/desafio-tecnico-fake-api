import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartFacadeService } from '../../../../abstraction/cart.facade.service';
import { ProductFacadeService } from '../../../../abstraction/product.facade.service';
import { CartProduct } from '../../../../domain/model/cart';
import { Product } from '../../../../domain/model/product';
import { CategoryLabelPipe } from '../../../pipe/category-label.pipe';
import { CategorySeverityPipe } from '../../../pipe/category-severity.pipe';

interface CartItemWithProduct extends CartProduct {
  product: Product | null;
}

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ImageModule,
    InputNumberModule,
    ProgressSpinnerModule,
    TagModule,
    ToastModule,
    CategoryLabelPipe,
    CategorySeverityPipe,
  ],
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss'],
})
export class CartViewComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  cartItems: CartItemWithProduct[] = [];
  loading = false;
  error: any = null;
  updatingItem: number | null = null;

  constructor(
    private readonly cartFacade: CartFacadeService,
    private readonly productFacade: ProductFacadeService,
    private readonly messageService: MessageService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.subscribeToCartData();
    // Load carts from server to test the endpoint
    this.cartFacade.loadCarts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToCartData(): void {
    // Combine local cart items with product data
    combineLatest([
      this.cartFacade.localCartItems$,
      this.productFacade.products$,
      this.cartFacade.loading$,
      this.cartFacade.error$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([cartItems, products, loading, error]) => {
        this.loading = loading;
        this.error = error;

        // Map cart items to include product data
        this.cartItems = cartItems.map((cartItem) => ({
          ...cartItem,
          product: products.find((product) => product.id === cartItem.productId) || null,
        }));
      });

    // Load products if not already loaded
    this.productFacade.loadProducts();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.updatingItem = productId;
    this.cartFacade.updateLocalCartQuantity(productId, quantity);

    // Reset updating state after a brief delay
    setTimeout(() => {
      this.updatingItem = null;
    }, 300);
  }

  removeItem(productId: number): void {
    const item = this.cartItems.find((item) => item.productId === productId);
    if (item && item.product) {
      this.cartFacade.removeFromLocalCart(productId);
      this.messageService.add({
        severity: 'info',
        summary: 'Item Removido',
        detail: `${item.product.title} foi removido do carrinho`,
        life: 3000,
      });
    }
  }

  clearCart(): void {
    this.cartFacade.clearLocalCart();
    this.messageService.add({
      severity: 'info',
      summary: 'Carrinho Limpo',
      detail: 'Todos os itens foram removidos do carrinho',
      life: 3000,
    });
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Carrinho Vazio',
        detail: 'Adicione produtos ao carrinho antes de finalizar',
        life: 3000,
      });
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Funcionalidade em Desenvolvimento',
      detail: 'O checkout será implementado em breve',
      life: 3000,
    });
  }

  continueShopping(): void {
    this.router.navigate(['/marketplace']);
  }

  viewProductDetail(productId: number): void {
    this.router.navigate(['/marketplace/product', productId]);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  // Helper method for template to convert string to number
  toNumber(value: string | number): number {
    return typeof value === 'string' ? Number(value) : value;
  }
}
