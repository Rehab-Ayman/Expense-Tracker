import { Component, signal } from '@angular/core';
import { Navbar } from '../project/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { ChatbotComponent } from '../project/chatbot/chatbot';

@Component({
  imports: [Navbar, RouterOutlet, ChatbotComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('expenseTracker');
}
