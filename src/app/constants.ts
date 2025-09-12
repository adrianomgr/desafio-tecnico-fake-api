import { CategoryEnum } from './domain/enum/category.enum';

export class Constants {
  public static readonly categoryLabels = {
    [CategoryEnum.ELECTRONICS]: 'Eletrônicos',
    [CategoryEnum.JEWELERY]: 'Joias',
    [CategoryEnum.MENS_CLOTHING]: 'Roupas Masculinas',
    [CategoryEnum.WOMENS_CLOTHING]: 'Roupas Femininas',
  };
}
