import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardFacadeService } from '@app/abstraction/dashboard.facade.service';
import { DashboardStats } from '@app/domain/model/dashboard';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject } from 'rxjs';
import { DashboardStatCardComponent } from '../../../components/dashboard-stat-card/dashboard-stat-card.component';

@Component({
  selector: 'app-dashboard-view',
  imports: [
    CommonModule,
    CardModule,
    ProgressSpinnerModule,
    DashboardStatCardComponent,
    RouterModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss',
})
export class DashboardViewComponent implements OnDestroy {
  private readonly dashboardFacade = inject(DashboardFacadeService);
  private readonly destroy$ = new Subject<void>();

  dashboardStats$: Observable<DashboardStats[]>;
  loading$: Observable<boolean>;
  countdown$: Observable<number>;

  constructor() {
    this.dashboardStats$ = this.dashboardFacade.dashboardStats$;
    this.loading$ = this.dashboardFacade.loading$;
    this.countdown$ = this.dashboardFacade.countdown$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshStats(): void {
    this.dashboardFacade.refreshDashboardStats();
  }

  formatCountdown(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
