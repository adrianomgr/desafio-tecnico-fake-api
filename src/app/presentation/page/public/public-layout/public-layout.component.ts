import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { Subject, takeUntil } from 'rxjs';
import { CartFacadeService } from '../../../../abstraction/cart.facade.service';
import { AuthApiService } from '../../../../infrastructure/api/auth.api.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonModule, MenubarModule],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss', './styles-public.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly cartFacade = inject(CartFacadeService);
  private readonly authService = inject(AuthApiService);
  private readonly destroy$ = new Subject<void>();

  cartItemCount = 0;
  isAuthenticated = false;

  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => {
        this.router.navigate(['/']).catch(console.error);
      },
    },
    {
      label: 'Produtos',
      icon: 'pi pi-shopping-bag',
      command: () => {
        this.router.navigate(['/products']).catch(console.error);
      },
    },
  ];

  ngOnInit(): void {
    this.cartFacade.localCartItemCount$.pipe(takeUntil(this.destroy$)).subscribe((count) => {
      this.cartItemCount = count;
    });

    this.authService.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe((authenticated) => {
      this.isAuthenticated = authenticated;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
