import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardFacadeService } from '@app/abstraction/dashboard.facade.service';
import { CardModule } from 'primeng/card';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-view',
  imports: [CommonModule, CardModule],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss',
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly dashboardFacade: DashboardFacadeService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
