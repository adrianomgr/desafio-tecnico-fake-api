import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthApiService);
  const router = inject(Router);

  const redirectToForbidden = () => {
    router.navigate(['/forbidden']);
    return false;
  };

  const allowAccess = () => true;

  return authService.isAuthenticated$.pipe(
    map((isAuthenticated: boolean) => (isAuthenticated ? allowAccess() : redirectToForbidden()))
  );
};
