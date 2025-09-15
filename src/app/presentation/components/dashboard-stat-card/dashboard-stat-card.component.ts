import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DashboardStats } from '@app/domain/model/dashboard';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard-stat-card',
  imports: [CommonModule, CardModule],
  templateUrl: './dashboard-stat-card.component.html',
  styleUrl: './dashboard-stat-card.component.scss',
})
export class DashboardStatCardComponent {
  @Input({ required: true }) stat!: DashboardStats;
  @Input() iconColor?: string;
  @Input() icon!: string;
}
