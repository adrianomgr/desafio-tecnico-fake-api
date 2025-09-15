import { FormControl, FormGroup } from '@angular/forms';
import { passwordMatchValidator } from './password-match.validator';

describe('PasswordMatchValidator', () => {
  it('deve retornar null quando as senhas coincidem', () => {
    const formGroup = new FormGroup({
      password: new FormControl('123456'),
      confirmPassword: new FormControl('123456'),
    });

    const validator = passwordMatchValidator();
    const result = validator(formGroup);

    expect(result).toBeNull();
  });

  it('deve retornar erro quando as senhas não coincidem', () => {
    const formGroup = new FormGroup({
      password: new FormControl('123456'),
      confirmPassword: new FormControl('654321'),
    });

    const validator = passwordMatchValidator();
    const result = validator(formGroup);

    expect(result).toEqual({ passwordMismatch: true });
  });

  it('deve retornar null quando os campos estão vazios', () => {
    const formGroup = new FormGroup({
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
    });

    const validator = passwordMatchValidator();
    const result = validator(formGroup);

    expect(result).toBeNull();
  });

  it('deve retornar null quando um dos campos está vazio', () => {
    const formGroup = new FormGroup({
      password: new FormControl('123456'),
      confirmPassword: new FormControl(''),
    });

    const validator = passwordMatchValidator();
    const result = validator(formGroup);

    expect(result).toBeNull();
  });

  it('deve retornar null quando os campos não existem', () => {
    const formGroup = new FormGroup({});

    const validator = passwordMatchValidator();
    const result = validator(formGroup);

    expect(result).toBeNull();
  });

  it('deve funcionar com nomes de campos customizados', () => {
    const formGroup = new FormGroup({
      senha: new FormControl('123456'),
      confirmarSenha: new FormControl('654321'),
    });

    const validator = passwordMatchValidator('senha', 'confirmarSenha');
    const result = validator(formGroup);

    expect(result).toEqual({ passwordMismatch: true });
  });

  it('deve marcar erro no campo de confirmação quando senhas não coincidem', () => {
    const confirmPasswordControl = new FormControl('654321');
    const formGroup = new FormGroup({
      password: new FormControl('123456'),
      confirmPassword: confirmPasswordControl,
    });

    const validator = passwordMatchValidator();
    validator(formGroup);

    expect(confirmPasswordControl.errors).toEqual({ passwordMismatch: true });
  });

  it('deve limpar erro do campo de confirmação quando senhas coincidem', () => {
    const confirmPasswordControl = new FormControl('123456');
    confirmPasswordControl.setErrors({ passwordMismatch: true });

    const formGroup = new FormGroup({
      password: new FormControl('123456'),
      confirmPassword: confirmPasswordControl,
    });

    const validator = passwordMatchValidator();
    validator(formGroup);

    expect(confirmPasswordControl.errors).toBeNull();
  });
});
