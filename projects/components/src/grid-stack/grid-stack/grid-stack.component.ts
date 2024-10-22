import {
  AfterContentInit,
  AfterViewChecked,
  Component,
  contentChildren,
  effect,
  ElementRef,
  inject,
  input, PLATFORM_ID,
  Renderer2,
  TemplateRef
} from '@angular/core';
import { GridStackItemDefDirective } from '../grid-stack-item-def.directive';
import { GridStackItem } from '../types';
import { isPlatformServer, NgTemplateOutlet } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'emr-grid-stack',
  exportAs: 'emrGridStack',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    CdkDrag
  ],
  templateUrl: './grid-stack.component.html',
  styleUrl: './grid-stack.component.scss',
  host: {
    'class': 'emr-grid-stack',
    '[class.dragging]': '_isDraggingActive',
  }
})
export class GridStackComponent implements AfterViewChecked, AfterContentInit {
  private _elementRef = inject(ElementRef);
  private _renderer = inject(Renderer2);
  private _platformId = inject(PLATFORM_ID);
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
  private _rootElementWidth = 0;
  private _rootElementHeight = 0;
  private _placeholderX = 0;
  private _placeholderY = 0;
  private _placeholderCurrentX = 0;
  private _placeholderCurrentY = 0;

  constructor() {
    effect(() => {
      this._items = this.items();
      this._calculateRootElementHeight();
    });
  }

  ngAfterViewChecked() {
    if (isPlatformServer(this._platformId)) {
      return;
    }

    const width = this._elementRef.nativeElement.getBoundingClientRect().width;

    if (width !== this._rootElementWidth) {
      this._rootElementWidth = width;
    }
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
    const dragElement = event.source.element.nativeElement;
    const dimensions = dragElement.getBoundingClientRect();
    this._renderer.setStyle(dragElement, 'max-width', dimensions.width + 'px');
    this._renderer.setStyle(dragElement, 'top', dimensions.y + 'px');
    this._renderer.setStyle(dragElement, 'left', dimensions.x + 'px');
    this._isDraggingActive = true;
    this._placeholder = {
      w: item.w,
      h: item.h,
      x: item.x,
      y: item.y,
    };
    this._placeholderX = this._placeholder.x;
    this._placeholderY = this._placeholder.y;
  }

  onDragEnded(event: any, item: GridStackItem, dragRef: CdkDrag): void {
    const dragElement = event.source.element.nativeElement;
    this._isDraggingActive = false;
    this._placeholder = {
      w: 0,
      h: 0,
      x: 0,
      y: 0,
    };
    this._renderer.removeStyle(dragElement, 'max-width');
    this._renderer.removeStyle(dragElement, 'top');
    this._renderer.removeStyle(dragElement, 'left');
    dragRef.reset();
  }

  onDragMoved(event: any, dragItem: GridStackItem, dragRef: CdkDrag): void {
    const yStep = 100;
    const yStepsCount = this._rootElementHeight / yStep;
    const xStepsCount = 12;
    const xStep = this._rootElementWidth / xStepsCount;
    let x = this._placeholderX + Math.ceil(event.distance.x / xStep);

    if (x <= 0) {
      x = 0;
    } else if (x >= (xStepsCount - this._placeholder.w)) {
      x = xStepsCount - this._placeholder.w;
    }

    const placeholderRectXStart = x;
    const placeholderRectXEnd = x + dragItem.w;

    this.items().forEach((item) => {
      const itemRectXStart = item.x;
      const itemRectXEnd = item.x + item.w;

      console.log(dragItem.x, x);

      if (itemRectXStart === (placeholderRectXStart + 1) && itemRectXEnd === (placeholderRectXEnd + 1)) {
        this._placeholder.x = item.x;
        item.x = dragItem.x;
        dragItem.x = this._placeholder.x;
      }
    });

    let y = this._placeholderY + Math.ceil(event.distance.y / yStep);

    if (y <= 0) {
      y = 0;
    } else if (y >= (yStepsCount - this._placeholder.h)) {
      y = yStepsCount - this._placeholder.h;
    }

    this._placeholderCurrentY = y;
    // this._placeholder.y = y;
  }

  private _calculateRootElementHeight(): void {
    let y = 0;
    let h = 0;
    this.items().forEach((item: GridStackItem) => {
      if (item.y > y) {
        y = item.y;
      }

      if (item.h > h) {
        h = item.h;
      }
    });
    this._rootElementHeight = (y + h) * 100;
    this._renderer.setStyle(this._elementRef.nativeElement, 'height', this._rootElementHeight + 'px');
  }
}
