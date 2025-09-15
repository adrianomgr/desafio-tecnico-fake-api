import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthApiService } from '../api/auth.api.service';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
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
  });

  it('deve ser criado', () => {
    expect(authGuard).toBeTruthy();
  });
});
