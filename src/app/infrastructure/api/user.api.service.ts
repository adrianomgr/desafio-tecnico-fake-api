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

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.baseUrl}/users`)
      .pipe(map((users) => users.map((user) => new User(user))));
  }

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

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }
}
