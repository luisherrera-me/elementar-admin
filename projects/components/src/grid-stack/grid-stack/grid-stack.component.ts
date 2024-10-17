import { Component, contentChildren, effect, input, TemplateRef } from '@angular/core';
import { GridStackItemDefDirective } from '../grid-stack-item-def.directive';
import { GridStackItem } from '../types';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'emr-grid-stack',
  exportAs: 'emrGridStack',
  standalone: true,
  imports: [
    NgTemplateOutlet,
  ],
  templateUrl: './grid-stack.component.html',
  styleUrl: './grid-stack.component.scss',
  host: {
    'class': 'emr-grid-stack'
  }
})
export class GridStackComponent {
  private _defs = contentChildren(GridStackItemDefDirective);
  items = input.required<GridStackItem[]>();

  protected _items: GridStackItem[] = [];
  protected _initialized = false;
  private _defsMap = new Map<string, TemplateRef<any>>();

  constructor() {
    effect(() => {
      this._items = this.items();
    });
  }

  ngAfterContentInit() {
    this._defs().forEach((def: GridStackItemDefDirective) => {
      this._defsMap.set(def.emrGridStackItemDef(), def.templateRef);
    });
    this._initialized = true;
  }

  getItemTemplate(type: string): TemplateRef<any> {
    if (!this._defsMap.has(type)) {
      throw new Error(`Invalid type "${type}" for grid stack item def`);
    }

    return this._defsMap.get(type) as TemplateRef<any>;
  }
}
