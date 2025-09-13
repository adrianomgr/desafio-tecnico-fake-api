import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./public-home-view/public-home.component').then((m) => m.PublicHomeComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./public-products/public-products.component').then(
            (m) => m.PublicProductsComponent
          ),
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
