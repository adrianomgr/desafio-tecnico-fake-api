import { Login } from '@app/domain/model/login';

export class LoginResponse {
  token!: string;

  static converter(dados: LoginResponse): Login {
    return new Login({
      token: dados.token,
    });
  }
}
