import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ExpenseService } from '../../services/expense';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-expenseForm',
  styleUrl: './expense-form.css',
  templateUrl: './expense-form.html',
})
export class ExpenseForm implements OnInit {
  private fb = inject(FormBuilder);
  private expenseService = inject(ExpenseService);
  private route = inject(ActivatedRoute);
  private currentId: string | null = null;
  expenseForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(1)]],
    category: ['', Validators.required],
    date: ['', [Validators.required, noFutureDateValidator]],
    note: [''],
  });
  ngOnInit(): void {
    const expenseId = this.route.snapshot.paramMap.get('id');
    if (expenseId) {
      this.currentId = expenseId;
      this.expenseService.getExpenseById(this.currentId).subscribe((expense) => {
        this.expenseForm.patchValue(expense);
      });
    }
  }
  onSubmit(): void {
    if (this.expenseForm.invalid) {
      return;
    }
    const expenseData = this.expenseForm.value;
    if (this.currentId) {
      this.expenseService.updateExpense(this.currentId, expenseData);
    } else {
      this.expenseService.addExpense(expenseData);
    }
    this.expenseForm.reset();
  }
}

function noFutureDateValidator(control: AbstractControl): ValidationErrors | null {
  const inputDate = new Date(control.value);
  const today = new Date();
  if (inputDate > today) {
    return { futureDate: true };
  }
  return null;
}
