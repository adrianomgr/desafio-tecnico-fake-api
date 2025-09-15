import { UserInitialsPipe } from './user-initials.pipe';

describe('UserInitialsPipe', () => {
  let pipe: UserInitialsPipe;

  beforeEach(() => {
    pipe = new UserInitialsPipe();
  });

  it('deve ser criado', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve extrair iniciais de um nome simples', () => {
    const result = pipe.transform('João');
    expect(result).toBe('J');
  });

  it('deve extrair iniciais de nome completo', () => {
    const result = pipe.transform('João Silva Santos');
    expect(result).toBe('JS');
  });

  it('deve extrair duas primeiras iniciais de nome com múltiplas palavras', () => {
    const result = pipe.transform('Maria José da Silva Santos');
    expect(result).toBe('MJ');
  });

  it('deve retornar "U" para nome vazio', () => {
    const result = pipe.transform('');
    expect(result).toBe('U');
  });

  it('deve lidar com espaços extras', () => {
    const result = pipe.transform('  João   Silva  ');
    expect(result).toBe('JS');
  });

  it('deve retornar "U" para nome null', () => {
    const result = pipe.transform(null!);
    expect(result).toBe('U');
  });

  it('deve retornar "U" para nome undefined', () => {
    const result = pipe.transform(undefined!);
    expect(result).toBe('U');
  });

  it('deve converter para maiúsculas', () => {
    const result = pipe.transform('joão silva');
    expect(result).toBe('JS');
  });
});
