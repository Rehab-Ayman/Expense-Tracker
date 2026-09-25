import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense';
import { RouterLink } from '@angular/router';
import { HighlightOverBudget } from '../directives/highlight-over-budget';
import { CategoryPipe } from '../pipes/category-pipe';

@Component({
  imports: [CommonModule, RouterLink, CategoryPipe, HighlightOverBudget],
  selector: 'app-expense-list',
  styleUrl: './expense-list.css',
  templateUrl: './expense-list.html',
})
export class ExpenseList implements OnInit {
  expenseService = inject(ExpenseService);

  categoryFilter = signal<string>('All');
  sortBy = signal<string>('date');
  runningTotal = computed(() => {
    return this.filteredExpenses().reduce((sum, item) => sum + item.amount, 0);
  });

  filteredExpenses = computed(() => {
    let list = this.expenseService.expenses();

    if (this.categoryFilter() !== 'All') {
      list = list.filter((e) => e.category === this.categoryFilter());
    }

    list = [...list].sort((a, b) => {
      if (this.sortBy() === 'amount') {
        return b.amount - a.amount;
      }
      return a.date < b.date ? 1 : -1;
    });

    return list;
  });

  ngOnInit(): void {
    this.expenseService.loadExpenses();
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryFilter.set(value);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortBy.set(value);
  }

  onDelete(id: string): void {
    const answer = confirm('Are you sure you want to delete this expense?');
    if (answer) {
      this.expenseService.deleteExpense(id);
    }
  }
}
