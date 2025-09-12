import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/domain/model/user';
import { AuthApiService } from '@app/infrastructure/api/auth.api.service';
import { UserApiService } from '@app/infrastructure/api/user.api.service';
import { ErroResponse } from '@app/infrastructure/contract/response/erro.response';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface FakeStoreLoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginFacadeService {
  constructor(
    private readonly authApiService: AuthApiService,
    private readonly userApiService: UserApiService,
    private readonly messageService: MessageService
  ) {}

  login(username: string, password: string): Observable<FakeStoreLoginResponse> {
    return this.authApiService.login(username, password).pipe(
      catchError((erro: HttpErrorResponse) => {
        return throwError(() => ErroResponse.converter(erro, this.messageService));
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.userApiService.getAllUsers().pipe(
      catchError((erro: HttpErrorResponse) => {
        return throwError(() => ErroResponse.converter(erro));
      })
    );
  }
}
