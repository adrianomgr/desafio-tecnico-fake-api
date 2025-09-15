import { CategoryEnum } from '@app/domain/enum/category.enum';
import { CategorySeverityPipe } from './category-severity.pipe';

describe('CategorySeverityPipe', () => {
  let pipe: CategorySeverityPipe;

  beforeEach(() => {
    pipe = new CategorySeverityPipe();
  });

  it('deve ser criado', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve transformar categoria electronics para info', () => {
    const result = pipe.transform(CategoryEnum.ELECTRONICS);
    expect(result).toBe('info');
  });

  it('deve transformar categoria jewelery para warn', () => {
    const result = pipe.transform(CategoryEnum.JEWELERY);
    expect(result).toBe('warn');
  });

  it('deve transformar categoria mens clothing para success', () => {
    const result = pipe.transform(CategoryEnum.MENS_CLOTHING);
    expect(result).toBe('success');
  });

  it('deve transformar categoria womens clothing para danger', () => {
    const result = pipe.transform(CategoryEnum.WOMENS_CLOTHING);
    expect(result).toBe('danger');
  });

  it('deve retornar "info" como padrão se não encontrar mapeamento', () => {
    const unknownCategory = 'unknown-category';
    const result = pipe.transform(unknownCategory);
    expect(result).toBe('info');
  });

  it('deve retornar "info" para string vazia', () => {
    const result = pipe.transform('');
    expect(result).toBe('info');
  });
});
