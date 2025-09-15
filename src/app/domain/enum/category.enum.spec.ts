import { CategoryEnum } from './category.enum';

describe('CategoryEnum', () => {
  it('deve ter as categorias corretas definidas', () => {
    expect(CategoryEnum.ELECTRONICS).toBe('electronics');
    expect(CategoryEnum.JEWELERY).toBe('jewelery');
    expect(CategoryEnum.MENS_CLOTHING).toBe("men's clothing");
    expect(CategoryEnum.WOMENS_CLOTHING).toBe("women's clothing");
  });
});
