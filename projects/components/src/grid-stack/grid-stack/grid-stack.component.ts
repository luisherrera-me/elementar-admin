import { Component, contentChildren, effect, input, TemplateRef } from '@angular/core';
import { GridStackItemDefDirective } from '../grid-stack-item-def.directive';
import { GridStackItem } from '../types';
import { NgTemplateOutlet } from '@angular/common';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
  selector: 'emr-grid-stack',
  exportAs: 'emrGridStack',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    CdkDrag,
    CdkDragPlaceholder,
  ],
  templateUrl: './grid-stack.component.html',
  styleUrl: './grid-stack.component.scss',
  host: {
    'class': 'emr-grid-stack',
    '[class.is-dragging-active]': '_isDraggingActive',
  }
})
export class GridStackComponent {
  private _defs = contentChildren(GridStackItemDefDirective);
  items = input.required<GridStackItem[]>();

  protected _items: GridStackItem[] = [];
  protected _initialized = false;
  private _defsMap = new Map<string, TemplateRef<any>>();
  protected _placeholder = {
    w: 0,
    h: 0,
    x: 0,
    y: 0
  };
  protected _isDraggingActive = false;

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

  onDragStarted(event: any, item: GridStackItem): void {
    console.log(event, item);
    this._isDraggingActive = true;
    this._placeholder = {
      w: item.w,
      h: item.h,
      x: item.x,
      y: item.y,
    };
  }

  onDragEnded(event: any, item: GridStackItem, dragRef: CdkDrag): void {
    this._isDraggingActive = false;
    this._placeholder = {
      w: 0,
      h: 0,
      x: 0,
      y: 0,
    };
    dragRef.reset();
  }
}
