export class UpdateUserRequest {
  id: number;
  username?: string;
  email?: string;
  password?: string;

  constructor(dados: UpdateUserRequest) {
    this.id = dados.id;
    this.username = dados.username;
    this.email = dados.email;
    this.password = dados.password;
  }
}
