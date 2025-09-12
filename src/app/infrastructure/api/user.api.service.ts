import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../domain/model/user';
import { CreateUserRequest } from '../contract/request/create-user.request';
import { UpdateUserRequest } from '../contract/request/update-user.request';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly baseUrl = 'https://fakestoreapi.com';

  constructor(private readonly http: HttpClient) {}

  // Buscar todos os usuários da FakeStore API
  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.baseUrl}/users`)
      .pipe(map((users) => users.map((user) => new User(user))));
  }

  // Buscar usuário por ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`).pipe(map((user) => new User(user)));
  }

  // Criar novo usuário (usando FakeStore API format)
  createUser(user: CreateUserRequest): Observable<User> {
    const userData = {
      email: user.email,
      username: user.username,
      password: user.password,
    };

    return this.http
      .post<User>(`${this.baseUrl}/users`, userData)
      .pipe(map((createdUser) => new User(createdUser)));
  }

  // Atualizar usuário
  updateUser(id: number, user: UpdateUserRequest): Observable<User> {
    const userData = {
      email: user.email,
      username: user.username,
      password: user.password,
    };

    return this.http
      .put<User>(`${this.baseUrl}/users/${id}`, userData)
      .pipe(map((updatedUser) => new User(updatedUser)));
  }

  // Deletar usuário
  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/users/${id}`);
  }

  // Buscar usuários com limite
  getLimitedUsers(limit: number): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.baseUrl}/users?limit=${limit}`)
      .pipe(map((users) => users.map((user) => new User(user))));
  }

  // Buscar usuários ordenados
  getSortedUsers(sort: 'asc' | 'desc'): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.baseUrl}/users?sort=${sort}`)
      .pipe(map((users) => users.map((user) => new User(user))));
  }
}
