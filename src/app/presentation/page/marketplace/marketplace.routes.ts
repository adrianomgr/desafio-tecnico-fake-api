import { Routes } from '@angular/router';

export const marketplaceRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./template/marketplace-layout/marketplace-layout.component').then(
        (m) => m.MarketplaceLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./marketplace-view.component').then((m) => m.MarketplaceViewComponent),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./cart-view/cart-view.component').then((m) => m.CartViewComponent),
      },
    ],
  },
];
