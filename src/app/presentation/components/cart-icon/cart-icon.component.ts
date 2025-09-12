import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartFacadeService } from '../../../abstraction/cart.facade.service';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, ButtonModule, BadgeModule, TooltipModule],
  template: `
    <div class="cart-icon-container">
      <p-button
        icon="pi pi-shopping-cart"
        [outlined]="true"
        severity="secondary"
        class="cart-button"
        (onClick)="goToCart()"
        pTooltip="Ver Carrinho ({{ (cartItemCount$ | async) || 0 }} itens)"
        tooltipPosition="bottom"
      >
        <span *ngIf="(cartItemCount$ | async) && (cartItemCount$ | async)! > 0" class="cart-badge">
          {{ cartItemCount$ | async }}
        </span>
      </p-button>
    </div>
  `,
  styles: [
    `
      .cart-icon-container {
        position: relative;
        display: inline-block;
      }

      .cart-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background-color: #e74c3c;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        z-index: 1000;
        min-width: 20px;
      }

      :host ::ng-deep .cart-button {
        .p-button {
          position: relative;
          border-radius: 50%;
          width: 40px;
          height: 40px;
        }
      }
    `,
  ],
})
export class CartIconComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  cartItemCount$: Observable<number>;

  constructor(private readonly cartFacade: CartFacadeService, private readonly router: Router) {
    this.cartItemCount$ = this.cartFacade.localCartItemCount$;
  }

  ngOnInit(): void {
    // Subscribe to initialize the cart state if needed
    this.cartItemCount$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToCart(): void {
    this.router.navigate(['/marketplace/cart']);
  }
}
