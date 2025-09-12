import { Routes } from '@angular/router';
import { authGuard } from './infrastructure/guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./presentation/page/login/login.routes').then((m) => m.loginRoutes),
  },
  {
    path: 'marketplace',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./presentation/page/marketplace/marketplace.routes').then((m) => m.marketplaceRoutes),
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./presentation/page/forbidden/forbidden-view.component').then(
        (m) => m.ForbiddenViewComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./presentation/page/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
