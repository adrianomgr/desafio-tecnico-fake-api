export class CreateUserRequest {
  username!: string;
  email!: string;
  password!: string;

  constructor(dados: CreateUserRequest) {
    this.username = dados.username;
    this.email = dados.email;
    this.password = dados.password;
  }
}
