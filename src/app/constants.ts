import { CategoryEnum } from './domain/enum/category.enum';

export class Constants {
  public static readonly categoryLabels = {
    [CategoryEnum.ELECTRONICS]: 'Eletrônicos',
    [CategoryEnum.JEWELERY]: 'Joias',
    [CategoryEnum.MENS_CLOTHING]: 'Roupas Masculinas',
    [CategoryEnum.WOMENS_CLOTHING]: 'Roupas Femininas',
  };

  public static readonly categorySeverity = {
    [CategoryEnum.ELECTRONICS]: 'info',
    [CategoryEnum.JEWELERY]: 'warn',
    [CategoryEnum.MENS_CLOTHING]: 'success',
    [CategoryEnum.WOMENS_CLOTHING]: 'danger',
  };
}
