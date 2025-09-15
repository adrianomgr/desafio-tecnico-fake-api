import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Subject } from 'rxjs';
import { DashboardStats } from '../domain/model/dashboard';
import { Product } from '../domain/model/product';
import { CartApiService } from '../infrastructure/api/cart.api.service';
import { ProductApiService } from '../infrastructure/api/product.api.service';
import { UserApiService } from '../infrastructure/api/user.api.service';
@Injectable({
  providedIn: 'root',
})
export class DashboardFacadeService implements OnDestroy {
  private readonly AUTO_REFRESH_INTERVAL = 1 * 60; // 60 segundos

  private readonly userApiService = inject(UserApiService);
  private readonly cartApiService = inject(CartApiService);
  private readonly productApiService = inject(ProductApiService);

  private readonly dashboardStatsSubject = new BehaviorSubject<DashboardStats[]>([]);
  readonly dashboardStats$ = this.dashboardStatsSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private readonly countdownSubject = new BehaviorSubject<number>(this.AUTO_REFRESH_INTERVAL);
  readonly countdown$ = this.countdownSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  private countdownTimer?: number;

  constructor() {
    this.loadDashboardStats();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopCountdown();
  }

  refreshDashboardStats(): void {
    this.loadDashboardStats();
    this.restartCountdown();
  }

  private startCountdown(): void {
    this.countdownTimer = setInterval(() => {
      const currentCount = this.countdownSubject.value;
      if (currentCount <= 1) {
        this.loadDashboardStats();
        this.countdownSubject.next(this.AUTO_REFRESH_INTERVAL);
      } else {
        this.countdownSubject.next(currentCount - 1);
      }
    }, 1000); // Atualiza a cada segundo
  }

  private stopCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
  }

  private restartCountdown(): void {
    this.stopCountdown();
    this.countdownSubject.next(this.AUTO_REFRESH_INTERVAL);
    this.startCountdown();
  }

  private loadDashboardStats(): void {
    this.loadingSubject.next(true);

    combineLatest({
      products: this.productApiService.getAllProducts(),
      categories: this.productApiService.getAllCategories(),
      carts: this.cartApiService.getAllCarts(),
      users: this.userApiService.getAllUsers(),
    })
      .pipe(
        map(({ products, categories, carts, users }) => {
          const stats: DashboardStats[] = [];
          const productsCount = products?.length || 0;
          const usersCount = users?.length || 0;
          const cartsCount = carts?.length || 0;
          const totalRevenue =
            products?.reduce((sum: number, product: Product) => sum + product.price, 0) * 0.1 || 0;
          const averagePrice =
            products && products.length > 0
              ? products.reduce((sum: number, product: Product) => sum + product.price, 0) /
                products.length
              : 0;
          const categoriesCount = categories?.length || 0;

          stats.push(DashboardStats.createProductsStat(productsCount));
          stats.push(DashboardStats.createUsersStat(usersCount));
          stats.push(DashboardStats.createCartsStat(cartsCount));
          stats.push(DashboardStats.createRevenueStat(totalRevenue));
          stats.push(DashboardStats.createAveragePriceStat(averagePrice));
          stats.push(DashboardStats.createCategoriesStat(categoriesCount));

          return stats;
        })
      )
      .subscribe({
        next: (stats) => {
          this.dashboardStatsSubject.next(stats);
          this.loadingSubject.next(false);
        },
        error: (error) => {
          console.error('Erro ao carregar estatísticas do dashboard:', error);
          this.loadingSubject.next(false);
        },
      });
  }
}
