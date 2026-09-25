import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { signal } from '@angular/core';
import { Expense } from '../models/expense.model';
import { Observable, map } from 'rxjs';
import { environment } from '../environment/environment';
@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private _httpClient = inject(HttpClient);
  private apiURL = environment.apiURL;
  private groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  expenses = signal<Expense[]>([]);

  loadExpenses(): void {
    this._httpClient.get<Expense[]>(this.apiURL).subscribe({
      next: (data) => {
        this.expenses.set(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addExpense(expense: Expense): void {
    this._httpClient.post<Expense>(this.apiURL, expense).subscribe({
      next: (data) => {
        this.loadExpenses();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateExpense(id: string, expense: Expense): void {
    this._httpClient.put<Expense>(`${this.apiURL}/${id}`, expense).subscribe({
      next: (data) => {
        this.loadExpenses();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getExpenseById(id: string): Observable<Expense> {
    return this._httpClient.get<Expense>(`${this.apiURL}/${id}`);
  }

  deleteExpense(id: string): void {
    this._httpClient.delete(`${this.apiURL}/${id}`).subscribe({
      next: (data) => {
        this.loadExpenses();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  sendMessage(userMessage: string): Observable<string> {
    const currentExpenses = this.expenses();
    const expensesContext = JSON.stringify(currentExpenses);

    const systemPrompt = `
      You are an AI Financial Assistant for an Expense Tracker app.
      Role: Act as a helpful and polite personal accountant.
      Task: Answer user questions about their current expenses based ONLY on the provided context below.
      Context (Current Expenses): ${expensesContext}
      Format: Keep your answers clear, concise, and formatted nicely.
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiURL.trim()}`,
    });

    const body = {
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
    };

    return this._httpClient
      .post<any>(this.groqApiUrl, body, { headers })
      .pipe(map((response) => response.choices[0].message.content));
  }
}
