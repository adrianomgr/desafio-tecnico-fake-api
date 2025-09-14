import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '@app/constants';
import { CategoryEnum } from '@app/domain/enum/category.enum';

@Pipe({
  name: 'categorySeverity',
  standalone: true,
})
export class CategorySeverityPipe implements PipeTransform {
  transform(category: string): string {
    return Constants.categorySeverity[category as CategoryEnum] || 'info';
  }
}
