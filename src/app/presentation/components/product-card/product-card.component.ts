import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { CartFacadeService } from '../../../abstraction/cart.facade.service';
import { PageFromEnum } from '../../../domain/enum/page-from.enum';
import { Product } from '../../../domain/model/product';
import { CategoryLabelPipe } from '../../pipe/category-label.pipe';
import { CategorySeverityPipe } from '../../pipe/category-severity.pipe';
import { QuantityControlsComponent } from '../quantity-controls/quantity-controls.component';

export type ProductCardType = 'home' | 'products';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    RatingModule,
    TagModule,
    TooltipModule,
    CategoryLabelPipe,
    CategorySeverityPipe,
    QuantityControlsComponent,
  ],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Input() type: ProductCardType = 'home';
  @Input() showQuantitySelector = true;
  @Input() showAddToCart = true;
  @Input() pageFrom: PageFromEnum = PageFromEnum.PUBLIC_PRODUCTS;
  @Output() productClick = new EventEmitter<Product>();

  private readonly router = inject(Router);
  private readonly cartFacade = inject(CartFacadeService);
  private readonly destroy$ = new Subject<void>();

  quantity = 1;
  isInCart = false;
  cartQuantity = 0;

  readonly PageFromEnum = PageFromEnum;

  ngOnInit(): void {
    // Subscribe to cart items to check if this product is in cart
    this.cartFacade.localCartItems$.pipe(takeUntil(this.destroy$)).subscribe((cartItems) => {
      const cartItem = cartItems.find((item) => item.productId === this.product.id);
      this.isInCart = !!cartItem;
      this.cartQuantity = cartItem?.quantity || 0;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get showCategory(): boolean {
    return this.type === 'products';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  onCardClick(): void {
    this.productClick.emit(this.product);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.cartFacade.addToLocalCart(this.product.id, 1);
  }

  onAddToCartWrapper(): void {
    this.cartFacade.addToLocalCart(this.product.id, 1);
  }

  updateQuantity(newQuantity: number): void {
    this.cartFacade.updateLocalCartQuantity(this.product.id, newQuantity);
  }

  increaseQuantity(event: Event): void {
    event.stopPropagation();
    this.cartFacade.updateLocalCartQuantity(this.product.id, this.cartQuantity + 1);
  }

  decreaseQuantity(event: Event): void {
    event.stopPropagation();
    if (this.cartQuantity <= 1) {
      this.removeFromCart(event);
    } else {
      this.cartFacade.updateLocalCartQuantity(this.product.id, this.cartQuantity - 1);
    }
  }

  removeFromCart(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.cartFacade.removeFromLocalCart(this.product.id);
  }
}
