import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class ChatbotComponent {
  private expenseService = inject(ExpenseService);

  isOpen = signal<boolean>(false);

  messages = signal<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Financial Assistant. How can I help you analyze your expenses today?',
    },
  ]);

  newMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  toggleSidebar(): void {
    this.isOpen.update((prev) => !prev);
  }

  send(): void {
    const text = this.newMessage().trim();
    if (!text || this.isLoading()) return;

    this.messages.update((msgs) => [...msgs, { sender: 'user', text }]);
    this.newMessage.set('');
    this.isLoading.set(true);

    this.expenseService.sendMessage(text).subscribe({
      next: (response) => {
        this.messages.update((msgs) => [...msgs, { sender: 'ai', text: response }]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.messages.update((msgs) => [
          ...msgs,
          {
            sender: 'ai',
            text: 'Sorry, an error occurred while connecting to AI. Please check your API key.',
          },
        ]);
        this.isLoading.set(false);
      },
    });
  }
}
