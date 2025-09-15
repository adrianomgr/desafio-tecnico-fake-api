import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-forbidden',
  imports: [CardModule, ButtonModule],
  templateUrl: './forbidden-view.component.html',
  styleUrls: ['./forbidden-view.component.scss'],
})
export class ForbiddenViewComponent {
  private readonly router = inject(Router);

  goToBlog(): void {
    this.router.navigate(['/public-blog']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
