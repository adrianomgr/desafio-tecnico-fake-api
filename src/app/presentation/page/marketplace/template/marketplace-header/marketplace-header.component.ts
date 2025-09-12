import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { CartIconComponent } from '../../../../components/cart-icon/cart-icon.component';

@Component({
  selector: 'app-marketplace-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToolbarModule, TooltipModule, CartIconComponent],
  templateUrl: './marketplace-header.component.html',
  styleUrl: './marketplace-header.component.scss',
})
export class MarketplaceHeaderComponent {
  constructor(private readonly router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToSignUp(): void {
    this.router.navigate(['/sign-up']);
  }

  goToPublicBlog(): void {
    this.router.navigate(['/public-blog']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
