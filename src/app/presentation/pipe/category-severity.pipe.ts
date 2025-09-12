import { Pipe, PipeTransform } from '@angular/core';
import { CategoryEnum } from '@app/domain/enum/category.enum';

@Pipe({
  name: 'categorySeverity',
  standalone: true,
})
export class CategorySeverityPipe implements PipeTransform {
  transform(category: string): string {
    switch (category as CategoryEnum) {
      case CategoryEnum.ELECTRONICS:
        return 'info';
      case CategoryEnum.JEWELERY:
        return 'warning';
      case CategoryEnum.MENS_CLOTHING:
        return 'success';
      case CategoryEnum.WOMENS_CLOTHING:
        return 'danger';
      default:
        return 'info';
    }
  }
}
