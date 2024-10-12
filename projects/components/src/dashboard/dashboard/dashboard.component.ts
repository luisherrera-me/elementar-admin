import { AfterContentInit, Component, computed, contentChildren, effect, input, TemplateRef } from '@angular/core';
import { Widget } from '../types';
import { DashboardWidgetDefDirective } from '@elementar/components/dashboard';
import { NgTemplateOutlet } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  DragRef,
  moveItemInArray,
  Point
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'emr-dashboard',
  exportAs: 'emrDashboard',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    CdkDrag,
    CdkDropList,
    CdkDragPlaceholder
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  host: {
    'class': 'emr-dashboard'
  }
})
export class DashboardComponent implements AfterContentInit{
  private _defs = contentChildren(DashboardWidgetDefDirective);
  widgets = input.required<Widget[]>();

  protected _widgets: Widget[] = [];
  protected _initialized = false;
  private _defsMap = new Map<string, TemplateRef<any>>();

  // dragConstrainPosition = (userPointerPosition: Point, dragRef: DragRef, dimensions: DOMRect, pickupPositionInElement: Point) => {
  //   console.log(dragRef);
  //
  //   return pickupPositionInElement;
  // }

  constructor() {
    effect(() => {
      this._widgets = this.widgets();
    });
  }

  ngAfterContentInit() {
    this._defs().forEach((def: DashboardWidgetDefDirective) => {
      this._defsMap.set(def.emrDashboardWidgetDef(), def.templateRef);
    });
    this._initialized = true;
  }

  getWidgetTemplate(type: string): TemplateRef<any> {
    if (!this._defsMap.has(type)) {
      throw new Error(`Invalid type "${type}" for widget def`);
    }

    return this._defsMap.get(type) as TemplateRef<any>;
  }

  getWidgetArea(widget: Widget): string {
    return 'span ' + (widget.rows ?? 1) + ' / span ' + (widget.cols ?? 1);
  }

  onDropListSorted(event: any) {
    console.log(event);
    // event.preventDefault();
    return false;
  }

  onDrop(event: CdkDragDrop<Widget[]>) {
    // console.log(event);

    // moveItemInArray(this._widgets, event.previousIndex, event.currentIndex);
  }

  onDragStarted(event: any) {
    // console.log(event);
  }
}
