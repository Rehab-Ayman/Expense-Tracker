import { Routes } from '@angular/router';
import { Home } from '../project/home/home';
import { ExpenseForm } from '../project/expenseForm/expense-form';
import { ExpenseList } from '../project/expenseList/expense-list';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'add', component: ExpenseForm },
  { path: 'edit/:id', component: ExpenseForm },
  { path: 'expenses', component: ExpenseList },
];
