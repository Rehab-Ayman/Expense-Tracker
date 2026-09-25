import { Directive, inject, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appHighlightOverBudget]',
})
export class HighlightOverBudget implements OnChanges {
  private el = inject(ElementRef);

  @Input('appHighlightOverBudget') amount: number = 0;

  ngOnChanges(): void {
    if (this.amount > 100) {
      this.el.nativeElement.style.backgroundColor = '#ffd6d6';
    } else {
      this.el.nativeElement.style.backgroundColor = '';
    }
  }
}
