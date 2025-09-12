import { HttpClient } from '@angular/common/http';
import { Injectable, resource, ResourceRef, signal, WritableSignal } from '@angular/core';
import { User } from '@app/domain/model/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, firstValueFrom, map, Observable, tap } from 'rxjs';
import { LoginResponse } from '../contract/response/login.response';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly baseUrl = 'https://fakestoreapi.com';
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public idcurrentUser: WritableSignal<number | undefined> = signal(undefined);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly TOKEN_KEY = 'jwt_token';

  constructor(private readonly http: HttpClient, private readonly jwtHelper: JwtHelperService) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const storedUserId = this.decodeToken(token).sub;
      if (storedUserId) {
        this.idcurrentUser.set(Number(storedUserId));
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  getProfile: ResourceRef<User | undefined> = resource({
    params: () => ({ id: this.idcurrentUser() }),
    loader: async ({ params }) => {
      if (params.id) {
        return await firstValueFrom(
          this.getUserById(params.id).pipe(map((fakeUser) => new User(fakeUser)))
        );
      }

      return undefined;
    },
  });

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const body = { username, password };
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, body).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
          const decodedToken = this.decodeToken(response.token);
          const userId = decodedToken.sub;

          this.idcurrentUser.set(userId);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.idcurrentUser.set(undefined);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private decodeToken(token: string): { sub: number } {
    return this.jwtHelper.decodeToken(token) as { sub: number };
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }
}
