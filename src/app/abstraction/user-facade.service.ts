import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '@app/domain/model/user';
import { UserCreate } from '@app/domain/model/user-create';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';
import { CreateUserRequest } from '@app/infrastructure/contract/request/create-user.request';
import { UpdateUserRequest } from '@app/infrastructure/contract/request/update-user.request';
import { ErroResponse } from '@app/infrastructure/contract/response/erro.response';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserApiService } from '../infrastructure/api/user.api.service';
import { UserResponse } from '../infrastructure/contract/response/user.response';

@Injectable({
  providedIn: 'root',
})
export class UserFacadeService {
  private readonly userService = inject(UserApiService);
  private readonly authApiService = inject(AuthApiService);

  getAllUsers(): Observable<User[]> {
    return this.userService.getAllUsers().pipe(
      map(UserResponse.converterLista),
      catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
    );
  }

  createUser(user: UserCreate): Observable<User> {
    const createUserRequest = new CreateUserRequest(user);

    return this.userService.createUser(createUserRequest).pipe(
      map((response: UserResponse) => UserResponse.converter(response)),
      catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
    );
  }

  updateUser(id: number, user: UpdateUserRequest): Observable<User> {
    return this.userService.updateUser(id, user).pipe(
      tap(() => {
        if (user.id === this.authApiService.idcurrentUser()) {
          this.authApiService.getProfile.reload();
        }
      }),
      catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.userService
      .deleteUser(id)
      .pipe(
        catchError((erro: HttpErrorResponse) => throwError(() => ErroResponse.converter(erro)))
      );
  }
}
