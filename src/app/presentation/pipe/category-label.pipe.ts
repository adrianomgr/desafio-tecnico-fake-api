import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '@app/constants';
import { CategoryEnum } from '@app/domain/enum/category.enum';

@Pipe({
  name: 'categoryLabel',
  standalone: true,
})
export class CategoryLabelPipe implements PipeTransform {
  transform(category: string): string {
    return Constants.categoryLabels[category as CategoryEnum] || category;
  }
}
