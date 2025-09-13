import { Routes } from '@angular/router';
import { authGuard } from './infrastructure/guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./presentation/page/public/public.routes').then((m) => m.publicRoutes),
  },
  {
    path: 'login',
    loadChildren: () => import('./presentation/page/login/login.routes').then((m) => m.loginRoutes),
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
    redirectTo: '/',
  },
];
