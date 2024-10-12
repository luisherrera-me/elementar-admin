import { Directive, InjectionToken, Input, TemplateRef } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `GridItemPlaceholder`. It serves as
 * alternative token to the actual `GridItemPlaceholder` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const GRID_ITEM_PLACEHOLDER = new InjectionToken<GridItemPlaceholder>('GridItemPlaceholder');

/** Directive that can be used to create a custom placeholder for a GridItem instance. */
@Directive({
    standalone: true,
    selector: 'ng-template[emrGridItemPlaceholder]',
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
      class: 'emr-grid-item-placeholder-content'
    },
    providers: [
      {
        provide: GRID_ITEM_PLACEHOLDER,
        useExisting: GridItemPlaceholder
      }
    ],
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class GridItemPlaceholder<T = any> {
    /** Context data to be added to the placeholder template instance. */
    @Input() data: T;
    constructor(public templateRef: TemplateRef<T>) {}
}
