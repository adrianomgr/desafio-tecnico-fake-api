import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthApiService } from '../api/auth.api.service';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authService: jasmine.SpyObj<AuthApiService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthApiService', [], {
      isAuthenticated$: of(true),
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthApiService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authService = TestBed.inject(AuthApiService) as jasmine.SpyObj<AuthApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('deve ser criado', () => {
    expect(authGuard).toBeTruthy();
  });
});
