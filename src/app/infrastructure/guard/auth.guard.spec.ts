import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { AuthApiService } from '../api/auth.api.service';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthApiService', ['method'], {
      isAuthenticated$: of(true),
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    route = {} as ActivatedRouteSnapshot;
    state = {} as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthApiService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('deve permitir acesso quando usuário está autenticado', (done) => {
    authServiceSpy.isAuthenticated$ = of(true);

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    if (result && typeof result === 'object' && 'subscribe' in result) {
      result.subscribe((canActivate) => {
        expect(canActivate).toBe(true);
        done();
      });
    } else {
      expect(result).toBe(true);
      done();
    }
  });

  it('deve bloquear acesso quando usuário não está autenticado', (done) => {
    const unauthenticatedSpy = jasmine.createSpyObj('AuthApiService', ['method'], {
      isAuthenticated$: of(false),
    });

    TestBed.overrideProvider(AuthApiService, { useValue: unauthenticatedSpy });

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    if (result && typeof result === 'object' && 'subscribe' in result) {
      result.subscribe((canActivate) => {
        expect(canActivate).toBe(false);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/forbidden']);
        done();
      });
    } else {
      expect(result).toBe(false);
      done();
    }
  });
});
