import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseCategory } from '../../models/expense.model';

@Pipe({
  name: 'categoryIcon',
})
export class CategoryPipe implements PipeTransform {
  private icons: Record<ExpenseCategory, string> = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Bills: '💡',
    Entertainment: '🎬',
    Other: '📦',
  };

  transform(value: ExpenseCategory): string {
    return `${this.icons[value]} ${value}`;
  }
}
