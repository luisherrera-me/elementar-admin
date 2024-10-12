import { Directive, ElementRef, InjectionToken } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `GridDragHandle`. It serves as
 * alternative token to the actual `GridDragHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const GRID_DRAG_HANDLE = new InjectionToken<GridDragHandle>('GridDragHandle');

/** Handle that can be used to drag a GridItem instance. */
@Directive({
    standalone: true,
    selector: '[emrGridDragHandle]',
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: 'emr-grid-drag-handle'
    },
    providers: [{provide: GRID_DRAG_HANDLE, useExisting: GridDragHandle}],
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class GridDragHandle {
    constructor(
        public element: ElementRef<HTMLElement>) {
    }
}
