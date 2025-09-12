import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import Aura from '@primeuix/themes/aura';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { CartApiService } from './infrastructure/api/cart.api.service';
import { authInterceptor } from './infrastructure/interceptor';
import { CartEffects } from './infrastructure/store/cart/cart.effects';
import { cartReducer } from './infrastructure/store/cart/cart.reducer';
import { ProductEffects } from './infrastructure/store/product/product.effects';
import { productReducer } from './infrastructure/store/product/product.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync('animations'),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideStore({
      products: productReducer,
      cart: cartReducer,
    }),
    provideEffects([ProductEffects, CartEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    ConfirmationService,
    MessageService,
    CartApiService,
    JwtHelperService,
    {
      provide: JWT_OPTIONS,
      useValue: {
        tokenGetter: () => {
          return localStorage.getItem('jwt_token');
        },
        allowedDomains: ['localhost:4200', 'fakestoreapi.com'],
        disallowedRoutes: [],
      },
    },
  ],
};
