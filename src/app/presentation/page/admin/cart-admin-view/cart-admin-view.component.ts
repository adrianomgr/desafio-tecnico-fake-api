import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartFacadeService } from '../../../../abstraction/cart.facade.service';
import { CartWithDetails } from '../../../../domain/model/cart';

@Component({
  selector: 'app-cart-admin-view',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    CardModule,
    ToastModule,
    ProgressSpinnerModule,
    TagModule,
    ToolbarModule,
    InputTextModule,
  ],
  providers: [MessageService],
  templateUrl: './cart-admin-view.component.html',
  styleUrls: ['./cart-admin-view.component.scss'],
})
export class CartAdminViewComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  carts: CartWithDetails[] = [];
  loading = false;
  error: any = null;
  expandedRows: any = {};

  constructor(
    private readonly cartFacade: CartFacadeService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCartsWithDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCartsWithDetails(): void {
    this.loading = true;
    this.cartFacade
      .loadCartsWithDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (carts) => {
          this.carts = carts;
          this.loading = false;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar carrinhos',
            life: 3000,
          });
        },
      });
  }

  onGlobalFilter(table: any, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  refreshCarts(): void {
    this.loadCartsWithDetails();
    this.messageService.add({
      severity: 'info',
      summary: 'Carregando',
      detail: 'Atualizando lista de carrinhos...',
      life: 2000,
    });
  }

  getCartItemCount(cart: CartWithDetails): number {
    return cart.totalItems || 0;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  getUserDisplayName(cart: CartWithDetails): string {
    if (cart.user) {
      return cart.user.username;
    }
    return `Usuário ${cart.userId}`;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  toggleRow(cart: CartWithDetails): void {
    if (this.expandedRows[cart.id]) {
      delete this.expandedRows[cart.id];
    } else {
      this.expandedRows[cart.id] = true;
    }
  }

  isRowExpanded(cart: CartWithDetails): boolean {
    return !!this.expandedRows[cart.id];
  }
}
