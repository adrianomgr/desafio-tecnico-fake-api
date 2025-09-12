export class User {
  id: number;
  username: string;
  email: string;
  password: string;

  constructor(dados: User) {
    this.id = dados.id;
    this.username = dados.username;
    this.email = dados.email;
    this.password = dados.password;
  }
}
