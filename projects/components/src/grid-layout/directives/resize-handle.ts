import { Directive, ElementRef, InjectionToken, } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `GridResizeHandle`. It serves as
 * alternative token to the actual `GridResizeHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const GRID_RESIZE_HANDLE = new InjectionToken<GridResizeHandle>('GridResizeHandle');

/** Handle that can be used to drag a GridItem instance. */
@Directive({
    standalone: true,
    selector: '[emrGridResizeHandle]',
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: 'emr-grid-resize-handle'
    },
    providers: [{provide: GRID_RESIZE_HANDLE, useExisting: GridResizeHandle}],
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class GridResizeHandle {
  constructor(
    public element: ElementRef<HTMLElement>) {
  }
}
