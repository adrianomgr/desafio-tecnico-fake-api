import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductDetailFacadeService } from '../../../../abstraction/product-detail.facade.service';
import { PageFromEnum } from '../../../../domain/enum/page-from.enum';
import { Product, ProductError } from '../../../../domain/model/product';
import { QuantityControlsComponent } from '../../../components/quantity-controls/quantity-controls.component';
import { CategoryLabelPipe } from '../../../pipe/category-label.pipe';
import { CategorySeverityPipe } from '../../../pipe/category-severity.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ImageModule,
    RatingModule,
    TagModule,
    ToastModule,
    ProgressSpinnerModule,
    DividerModule,
    CategoryLabelPipe,
    CategorySeverityPipe,
    QuantityControlsComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productFacade = inject(ProductDetailFacadeService);
  private readonly messageService = inject(MessageService);

  private readonly destroy$ = new Subject<void>();

  product: Product | null = null;
  loading = false;
  error: ProductError | null = null;
  cartQuantity = 0;
  isInCart = false;

  readonly PageFromEnum = PageFromEnum;

  ngOnInit(): void {
    this.loadProduct();
    this.subscribeToStoreData();
    this.subscribeToCartData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productFacade.loadProduct(Number(productId));
    }
  }

  private subscribeToStoreData(): void {
    this.productFacade.selectedProduct$.pipe(takeUntil(this.destroy$)).subscribe((product) => {
      this.product = product;
    });

    this.productFacade.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });

    this.productFacade.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
      this.error = error;
    });
  }

  private subscribeToCartData(): void {
    this.productFacade.localCartItems$.pipe(takeUntil(this.destroy$)).subscribe((cartItems) => {
      if (this.product) {
        const cartItem = cartItems.find((item) => item.productId === this.product!.id);
        this.isInCart = !!cartItem;
        this.cartQuantity = cartItem?.quantity || 1;
      }
    });
  }

  updateQuantity(newQuantity: number): void {
    if (this.product) {
      this.productFacade.updateLocalCartQuantity(this.product.id, newQuantity);
    }
  }

  removeFromCart(): void {
    if (this.product) {
      this.productFacade.removeFromLocalCart(this.product.id);
    }
  }

  addToCart(): void {
    if (this.product) {
      this.productFacade.addToLocalCart(this.product.id, this.cartQuantity);
    }
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
