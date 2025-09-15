import { CategoryEnum } from '@app/domain/enum/category.enum';
import { CategoryLabelPipe } from './category-label.pipe';

describe('CategoryLabelPipe', () => {
  let pipe: CategoryLabelPipe;

  beforeEach(() => {
    pipe = new CategoryLabelPipe();
  });

  it('deve ser criado', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve transformar categoria electronics para Eletrônicos', () => {
    const result = pipe.transform(CategoryEnum.ELECTRONICS);
    expect(result).toBe('Eletrônicos');
  });

  it('deve transformar categoria jewelery para Joias', () => {
    const result = pipe.transform(CategoryEnum.JEWELERY);
    expect(result).toBe('Joias');
  });

  it('deve transformar categoria mens clothing para Roupas Masculinas', () => {
    const result = pipe.transform(CategoryEnum.MENS_CLOTHING);
    expect(result).toBe('Roupas Masculinas');
  });

  it('deve transformar categoria womens clothing para Roupas Femininas', () => {
    const result = pipe.transform(CategoryEnum.WOMENS_CLOTHING);
    expect(result).toBe('Roupas Femininas');
  });

  it('deve retornar a categoria original se não encontrar mapeamento', () => {
    const unknownCategory = 'unknown-category';
    const result = pipe.transform(unknownCategory);
    expect(result).toBe(unknownCategory);
  });

  it('deve lidar com string vazia', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });
});
