import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[emrGridStackItemDef]',
  standalone: true
})
export class GridStackItemDefDirective {
  readonly templateRef = inject(TemplateRef);
  emrGridStackItemDef = input.required<string>();
}
