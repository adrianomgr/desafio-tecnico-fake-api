import { User } from '@app/domain/model/user';

export class UserResponse {
  id!: number;
  username!: string;
  email!: string;
  password!: string;

  static converterLista(dados: UserResponse[]): User[] {
    return dados.map((item) => UserResponse.converter(item));
  }

  static converter(dados: UserResponse): User {
    return new User({
      id: dados.id,
      username: dados.username,
      email: dados.email,
      password: dados.password,
    });
  }
}
