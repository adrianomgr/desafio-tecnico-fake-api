import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from '@app/domain/model/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginResponse } from '../contract/response/login.response';
import { AuthApiService } from './auth.api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;
  let jwtHelperSpy: jasmine.SpyObj<JwtHelperService>;
  const baseUrl = 'https://fakestoreapi.com';

  beforeEach(() => {
    const jwtSpy = jasmine.createSpyObj('JwtHelperService', {
      isTokenExpired: false,
      decodeToken: { sub: 1 },
    });

    TestBed.configureTestingModule({
      providers: [
        AuthApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: JwtHelperService, useValue: jwtSpy },
      ],
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
    jwtHelperSpy = TestBed.inject(JwtHelperService) as jasmine.SpyObj<JwtHelperService>;

    // Limpar localStorage antes de cada teste
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('getUserById', () => {
    it('deve buscar um usuário específico pelo ID', () => {
      const userId = 1;
      const mockUser: User = {
        id: userId,
        email: 'john@gmail.com',
        username: 'johnd',
        password: 'm38rmF$',
      };

      service.getUserById(userId).subscribe((user) => {
        expect(user).toEqual(mockUser);
        expect(user.id).toBe(userId);
      });

      const req = httpMock.expectOne(`${baseUrl}/users/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('login', () => {
    it('deve realizar login com sucesso e configurar autenticação', () => {
      const username = 'johnd';
      const password = 'm38rmF$';
      const mockToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXIiOiJqb2huZCIsImlhdCI6MTY0Nzg4MjA0M30.abc123';
      const mockLoginResponse: LoginResponse = {
        token: mockToken,
      };

      // Mock JWT
      jwtHelperSpy.decodeToken.and.returnValue({ sub: 1 });

      service.login(username, password).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
        expect(response.token).toBe(mockToken);
        expect(service.idcurrentUser()).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });
      req.flush(mockLoginResponse);

      expect(localStorage.getItem('jwt_token')).toBe(mockToken);
    });

    it('deve configurar estado de autenticação como verdadeiro após login', () => {
      const username = 'admin';
      const password = 'admin123';
      const mockToken = 'valid.jwt.token';
      const mockResponse: LoginResponse = { token: mockToken };

      jwtHelperSpy.decodeToken.and.returnValue({ sub: 2 });

      service.login(username, password).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/auth/login`);
      req.flush(mockResponse);

      service.isAuthenticated$.subscribe((isAuth) => {
        expect(isAuth).toBe(true);
      });
    });
  });

  describe('logout', () => {
    it('deve realizar logout e limpar dados de autenticação', () => {
      localStorage.setItem('jwt_token', 'some.jwt.token');
      service.idcurrentUser.set(1);

      service.logout();

      expect(localStorage.getItem('jwt_token')).toBeNull();
      expect(service.idcurrentUser()).toBeUndefined();

      service.isAuthenticated$.subscribe((isAuth) => {
        expect(isAuth).toBe(false);
      });
    });
  });

  describe('getToken', () => {
    it('deve retornar token do localStorage quando existir', () => {
      const mockToken = 'stored.jwt.token';
      localStorage.setItem('jwt_token', mockToken);

      const token = service.getToken();

      expect(token).toBe(mockToken);
    });

    it('deve retornar null quando não houver token no localStorage', () => {
      localStorage.clear();

      const token = service.getToken();

      expect(token).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar true quando token existe e não está expirado', () => {
      const validToken = 'valid.jwt.token';
      localStorage.setItem('jwt_token', validToken);

      (jwtHelperSpy.isTokenExpired as jasmine.Spy).and.returnValue(false);

      const isAuth = service.isAuthenticated();

      expect(isAuth).toBe(true);
    });

    it('deve retornar false quando token não existe ou está expirado', () => {
      localStorage.clear();

      let isAuth = service.isAuthenticated();

      expect(isAuth).toBe(false);

      const expiredToken = 'expired.jwt.token';
      localStorage.setItem('jwt_token', expiredToken);
      (jwtHelperSpy.isTokenExpired as jasmine.Spy).and.returnValue(true);

      isAuth = service.isAuthenticated();

      expect(isAuth).toBe(false);
    });
  });
});
