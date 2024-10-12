import {
    AfterContentChecked, AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, ElementRef, EmbeddedViewRef, EventEmitter, Input,
    NgZone, OnChanges, OnDestroy, Output, QueryList, Renderer2, SimpleChanges, ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import { coerceNumberProperty, NumberInput } from './coercion/number-property';
import { GridItemComponent } from './grid-item/grid-item.component';
import { combineLatest, empty, merge, NEVER, Observable, Observer, of, Subscription } from 'rxjs';
import { exhaustMap, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { GetGridItemRowHeight, GridItemDragging, GridItemLayoutItemAreEqual, GridItemResizing } from './utils/grid.utils';
import { compact } from './utils/react-grid-layout.utils';
import {
    GRID_ITEM_GET_RENDER_DATA_TOKEN, GridBackgroundCfg, GridCfg, GridCompactType, GridItemRenderData, GridLayout, GridLayoutItem
} from './grid.definitions';
import { PointerUp, PointerClientX, PointerClientY } from './utils/pointer.utils';
import { Dictionary } from './types';
import { GridService } from './grid.service';
import { getMutableClientRect, ClientRect } from './utils/client-rect';
import { GetScrollTotalRelativeDifference$, ScrollIfNearElementClientRect$ } from './utils/scroll';
import { BooleanInput, coerceBooleanProperty } from './coercion/boolean-property';
import { GridItemPlaceholder } from './directives/placeholder';
import { getTransformTransitionDurationInMs } from './utils/transition-duration';

interface DragResizeEvent {
    layout: GridLayout;
    layoutItem: GridLayoutItem;
    gridItemRef: GridItemComponent;
}

export type DragStart = DragResizeEvent;
export type ResizeStart = DragResizeEvent;
export type DragEnd = DragResizeEvent;
export type ResizeEnd = DragResizeEvent;

export interface GridItemResizeEvent {
    width: number;
    height: number;
    gridItemRef: GridItemComponent;
}

type DragActionType = 'drag' | 'resize';

function getDragResizeEventData(gridItem: GridItemComponent, layout: GridLayout): DragResizeEvent {
    return {
        layout,
        layoutItem: layout.find((item) => item.id === gridItem.id)!,
        gridItemRef: gridItem
    };
}

function getColumnWidth(config: GridCfg, width: number): number {
    const {cols, gap} = config;
    const widthExcludingGap = width - Math.max((gap * (cols - 1)), 0);
    return (widthExcludingGap / cols);
}

function getRowHeightInPixels(config: GridCfg, height: number): number {
    const {rowHeight, layout, gap} = config;
    return rowHeight === 'fit' ? GetGridItemRowHeight(layout, height, gap) : rowHeight;
}

function layoutToRenderItems(config: GridCfg, width: number, height: number): Dictionary<GridItemRenderData<number>> {
    const {layout, gap} = config;
    const rowHeightInPixels = getRowHeightInPixels(config, height);
    const itemWidthPerColumn = getColumnWidth(config, width);
    const renderItems: Dictionary<GridItemRenderData<number>> = {};
    for (const item of layout) {
        renderItems[item.id] = {
            id: item.id,
            top: item.y * rowHeightInPixels + gap * item.y,
            left: item.x * itemWidthPerColumn + gap * item.x,
            width: item.w * itemWidthPerColumn + gap * Math.max(item.w - 1, 0),
            height: item.h * rowHeightInPixels + gap * Math.max(item.h - 1, 0),
        };
    }
    return renderItems;
}

function getGridHeight(layout: GridLayout, rowHeight: number, gap: number): number {
    return layout.reduce((acc, cur) => Math.max(acc, (cur.y + cur.h) * rowHeight + Math.max(cur.y + cur.h - 1, 0) * gap), 0);
}

// eslint-disable-next-line @katoid/prefix-exported-code
export function parseRenderItemToPixels(renderItem: GridItemRenderData<number>): GridItemRenderData<string> {
    return {
        id: renderItem.id,
        top: `${renderItem.top}px`,
        left: `${renderItem.left}px`,
        width: `${renderItem.width}px`,
        height: `${renderItem.height}px`
    };
}

// eslint-disable-next-line @katoid/prefix-exported-code
export function __gridItemGetRenderDataFactoryFunc(gridCmp: GridComponent) {
    return function(id: string) {
        return parseRenderItemToPixels(gridCmp.getItemRenderData(id));
    };
}

export function GridItemGetRenderDataFactoryFunc(gridCmp: GridComponent) {
    // Workaround explained: https://github.com/ng-packagr/ng-packagr/issues/696#issuecomment-387114613
    const resultFunc = __gridItemGetRenderDataFactoryFunc(gridCmp);
    return resultFunc;
}

const defaultBackgroundConfig: Required<Omit<GridBackgroundCfg, 'show'>> = {
    borderColor: '#ffa72678',
    gapColor: 'transparent',
    rowColor: 'transparent',
    columnColor: 'transparent',
    borderWidth: 1,
};

@Component({
  selector: 'emr-grid',
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: GRID_ITEM_GET_RENDER_DATA_TOKEN,
      useFactory: GridItemGetRenderDataFactoryFunc,
      deps: [GridComponent]
    }
  ],
})
export class GridComponent implements OnChanges, AfterContentInit, AfterContentChecked, OnDestroy {
    /** Query list of grid items that are being rendered. */
    @ContentChildren(GridItemComponent, {descendants: true}) _gridItems: QueryList<GridItemComponent>;

    /** Emits when layout change */
    @Output() layoutUpdated: EventEmitter<GridLayout> = new EventEmitter<GridLayout>();

    /** Emits when drag starts */
    @Output() dragStarted: EventEmitter<DragStart> = new EventEmitter<DragStart>();

    /** Emits when resize starts */
    @Output() resizeStarted: EventEmitter<ResizeStart> = new EventEmitter<ResizeStart>();

    /** Emits when drag ends */
    @Output() dragEnded: EventEmitter<DragEnd> = new EventEmitter<DragEnd>();

    /** Emits when resize ends */
    @Output() resizeEnded: EventEmitter<ResizeEnd> = new EventEmitter<ResizeEnd>();

    /** Emits when a grid item is being resized and its bounds have changed */
    @Output() gridItemResize: EventEmitter<GridItemResizeEvent> = new EventEmitter<GridItemResizeEvent>();

    /**
     * Parent element that contains the scroll. If an string is provided it would search that element by id on the dom.
     * If no data provided or null autoscroll is not performed.
     */
    @Input() scrollableParent: HTMLElement | Document | string | null = null;

    /** Whether or not to update the internal layout when some dependent property change. */
    @Input()
    get compactOnPropsChange(): boolean { return this._compactOnPropsChange; }

    set compactOnPropsChange(value: boolean) {
        this._compactOnPropsChange = coerceBooleanProperty(value);
    }

    private _compactOnPropsChange: boolean = true;

    /** If true, grid items won't change position when being dragged over. Handy when using no compaction */
    @Input()
    get preventCollision(): boolean { return this._preventCollision; }

    set preventCollision(value: boolean) {
        this._preventCollision = coerceBooleanProperty(value);
    }

    private _preventCollision: boolean = false;

    /** Number of CSS pixels that would be scrolled on each 'tick' when auto scroll is performed. */
    @Input()
    get scrollSpeed(): number { return this._scrollSpeed; }

    set scrollSpeed(value: number) {
        this._scrollSpeed = coerceNumberProperty(value, 2);
    }

    private _scrollSpeed: number = 2;

    /** Type of compaction that will be applied to the layout (vertical, horizontal or free). Defaults to 'vertical' */
    @Input()
    get compactType(): GridCompactType {
        return this._compactType;
    }

    set compactType(val: GridCompactType) {
        this._compactType = val;
    }

    private _compactType: GridCompactType = 'vertical';

    /**
     * Row height as number or as 'fit'.
     * If rowHeight is a number value, it means that each row would have those css pixels in height.
     * if rowHeight is 'fit', it means that rows will fit in the height available. If 'fit' value is set, a 'height' should be also provided.
     */
    @Input()
    get rowHeight(): number | 'fit' { return this._rowHeight; }

    set rowHeight(val: number | 'fit') {
        this._rowHeight = val === 'fit' ? val : Math.max(1, Math.round(coerceNumberProperty(val)));
    }

    private _rowHeight: number | 'fit' = 100;

    /** Number of columns  */
    @Input()
    get cols(): number { return this._cols; }

    set cols(val: number) {
        this._cols = Math.max(1, Math.round(coerceNumberProperty(val)));
    }

    private _cols: number = 6;

    /** Layout of the grid. Array of all the grid items with its 'id' and position on the grid. */
    @Input()
    get layout(): GridLayout { return this._layout; }

    set layout(layout: GridLayout) {
        /**
         * Enhancement:
         * Only set layout if it's reference has changed and use a boolean to track whenever recalculate the layout on ngOnChanges.
         *
         * Why:
         * The normal use of this lib is having the variable layout in the outer component or in a store, assigning it whenever it changes and
         * binded in the component with it's input [layout]. In this scenario, we would always calculate one unnecessary change on the layout when
         * it is re-binded on the input.
         */
        this._layout = layout;
    }

    private _layout: GridLayout;

    /** Grid gap in css pixels */
    @Input()
    get gap(): number {
        return this._gap;
    }

    set gap(val: number) {
        this._gap = Math.max(coerceNumberProperty(val), 0);
    }

    private _gap: number = 0;


    /**
     * If height is a number, fixes the height of the grid to it, recommended when rowHeight = 'fit' is used.
     * If height is null, height will be automatically set according to its inner grid items.
     * Defaults to null.
     * */
    @Input()
    get height(): number | null {
        return this._height;
    }

    set height(val: number | null) {
        this._height = typeof val === 'number' ? Math.max(val, 0) : null;
    }

    private _height: number | null = null;


    @Input()
    get backgroundConfig(): GridBackgroundCfg | null {
        return this._backgroundConfig;
    }

    set backgroundConfig(val: GridBackgroundCfg | null) {
        this._backgroundConfig = val;

        // If there is background configuration, add main grid background class. Grid background class comes with opacity 0.
        // It is done this way for adding opacity animation and to don't add any styles when grid background is null.
        const classList = (this.elementRef.nativeElement as HTMLDivElement).classList;
        this._backgroundConfig !== null ? classList.add('emr-grid-background') : classList.remove('emr-grid-background');

        // Set background visibility
        this.setGridBackgroundVisible(this._backgroundConfig?.show === 'always');
    }

    private _backgroundConfig: GridBackgroundCfg | null = null;

    private gridCurrentHeight: number;

    get config(): GridCfg {
        return {
            cols: this.cols,
            rowHeight: this.rowHeight,
            height: this.height,
            layout: this.layout,
            preventCollision: this.preventCollision,
            gap: this.gap,
        };
    }

    /** Reference to the view of the placeholder element. */
    private placeholderRef: EmbeddedViewRef<any> | null;

    /** Element that is rendered as placeholder when a grid item is being dragged */
    private placeholder: HTMLElement | null;

    private _gridItemsRenderData: Dictionary<GridItemRenderData<number>>;
    private subscriptions: Subscription[] = [];

    constructor(private gridService: GridService,
                private elementRef: ElementRef,
                private viewContainerRef: ViewContainerRef,
                private renderer: Renderer2,
                private ngZone: NgZone) {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.rowHeight === 'fit' && this.height == null) {
            console.warn(`GridComponent: The @Input() height should not be null when using rowHeight 'fit'`);
        }

        let needsCompactLayout = false;
        let needsRecalculateRenderData = false;

        // TODO: Does fist change need to be compacted by default?
        // Compact layout whenever some dependent prop changes.
        if (changes['compactType'] || changes['cols'] || changes['layout']) {
            needsCompactLayout = true;
        }

        // Check if wee need to recalculate rendering data.
        if (needsCompactLayout || changes['rowHeight'] || changes['height'] || changes['gap'] || changes['backgroundConfig']) {
            needsRecalculateRenderData = true;
        }

        // Only compact layout if lib user has provided it. Lib users that want to save/store always the same layout  as it is represented (compacted)
        // can use CompactGrid utility and pre-compact the layout. This is the recommended behaviour for always having a the same layout on this component
        // and the ones that uses it.
        if (needsCompactLayout && this.compactOnPropsChange) {
            this.compactLayout();
        }

        if (needsRecalculateRenderData) {
            this.calculateRenderData();
        }
    }

    ngAfterContentInit() {
        this.initSubscriptions();
    }

    ngAfterContentChecked() {
        this.render();
    }

    resize() {
        this.calculateRenderData();
        this.render();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    compactLayout() {
        this.layout = compact(this.layout, this.compactType, this.cols);
    }

    getItemsRenderData(): Dictionary<GridItemRenderData<number>> {
        return {...this._gridItemsRenderData};
    }

    getItemRenderData(itemId: string): GridItemRenderData<number> {
        return this._gridItemsRenderData[itemId];
    }

    calculateRenderData() {
        const clientRect = (this.elementRef.nativeElement as HTMLElement).getBoundingClientRect();
        this.gridCurrentHeight = this.height ?? (this.rowHeight === 'fit' ? clientRect.height : getGridHeight(this.layout, this.rowHeight, this.gap));
        this._gridItemsRenderData = layoutToRenderItems(this.config, clientRect.width, this.gridCurrentHeight);

        // Set Background CSS variables
        this.setBackgroundCssVariables(getRowHeightInPixels(this.config, this.gridCurrentHeight));
    }

    render() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${this.gridCurrentHeight}px`);
        this.updateGridItemsStyles();
    }

    private setBackgroundCssVariables(rowHeight: number) {
        const style = (this.elementRef.nativeElement as HTMLDivElement).style;

        if (this._backgroundConfig) {
            // structure
            style.setProperty('--gap', this.gap + 'px');
            style.setProperty('--row-height', rowHeight + 'px');
            style.setProperty('--columns', `${this.cols}`);
            style.setProperty('--border-width', (this._backgroundConfig.borderWidth ?? defaultBackgroundConfig.borderWidth) + 'px');

            // colors
            style.setProperty('--border-color', this._backgroundConfig.borderColor ?? defaultBackgroundConfig.borderColor);
            style.setProperty('--gap-color', this._backgroundConfig.gapColor ?? defaultBackgroundConfig.gapColor);
            style.setProperty('--row-color', this._backgroundConfig.rowColor ?? defaultBackgroundConfig.rowColor);
            style.setProperty('--column-color', this._backgroundConfig.columnColor ?? defaultBackgroundConfig.columnColor);
        } else {
            style.removeProperty('--gap');
            style.removeProperty('--row-height');
            style.removeProperty('--columns');
            style.removeProperty('--border-width');
            style.removeProperty('--border-color');
            style.removeProperty('--gap-color');
            style.removeProperty('--row-color');
            style.removeProperty('--column-color');
        }
    }

    private updateGridItemsStyles() {
      console.log(this._gridItems);

        this._gridItems.forEach(item => {
            const gridItemRenderData: GridItemRenderData<number> | undefined = this._gridItemsRenderData[item.id];
            if (gridItemRenderData == null) {
                console.error(`Couldn\'t find the specified grid item for the id: ${item.id}`);
            } else {
                item.setStyles(parseRenderItemToPixels(gridItemRenderData));
            }
        });
    }


    private setGridBackgroundVisible(visible: boolean) {
        const classList = (this.elementRef.nativeElement as HTMLDivElement).classList;
        visible ? classList.add('emr-grid-background-visible') : classList.remove('emr-grid-background-visible');
    }

    private initSubscriptions() {
        this.subscriptions = [
            this._gridItems.changes.pipe(
                startWith(this._gridItems),
                switchMap((gridItems: QueryList<GridItemComponent>) => {
                    return merge(
                        ...gridItems.map((gridItem) => gridItem.dragStart$.pipe(map((event) => ({event, gridItem, type: 'drag' as DragActionType})))),
                        ...gridItems.map((gridItem) => gridItem.resizeStart$.pipe(map((event) => ({
                            event,
                            gridItem,
                            type: 'resize' as DragActionType
                        })))),
                    ).pipe(exhaustMap(({event, gridItem, type}) => {
                        // Emit drag or resize start events. Ensure that is start event is inside the zone.
                        this.ngZone.run(() => (type === 'drag' ? this.dragStarted : this.resizeStarted).emit(getDragResizeEventData(gridItem, this.layout)));

                        this.setGridBackgroundVisible(this._backgroundConfig?.show === 'whenDragging' || this._backgroundConfig?.show === 'always');

                        // Perform drag sequence
                        return this.performDragSequence$(gridItem, event, type).pipe(
                            map((layout) => ({layout, gridItem, type})));

                    }));
                })
            ).subscribe(({layout, gridItem, type}) => {
                this.layout = layout;
                // Calculate new rendering data given the new layout.
                this.calculateRenderData();
                // Emit drag or resize end events.
                (type === 'drag' ? this.dragEnded : this.resizeEnded).emit(getDragResizeEventData(gridItem, layout));
                // Notify that the layout has been updated.
                this.layoutUpdated.emit(layout);

                this.setGridBackgroundVisible(this._backgroundConfig?.show === 'always');
            })

        ];
    }

    /**
     * Perform a general grid drag action, from start to end. A general grid drag action basically includes creating the placeholder element and adding
     * some class animations. calcNewStateFunc needs to be provided in order to calculate the new state of the layout.
     * @param gridItem that is been dragged
     * @param pointerDownEvent event (mousedown or touchdown) where the user initiated the drag
     * @param calcNewStateFunc function that return the new layout state and the drag element position
     */
    private performDragSequence$(gridItem: GridItemComponent, pointerDownEvent: MouseEvent | TouchEvent, type: DragActionType): Observable<GridLayout> {
        return new Observable<GridLayout>((observer: Observer<GridLayout>) => {
            // Retrieve grid (parent) and gridItem (draggedElem) client rects.
            const gridElemClientRect: ClientRect = getMutableClientRect(this.elementRef.nativeElement as HTMLElement);
            const dragElemClientRect: ClientRect = getMutableClientRect(gridItem.elementRef.nativeElement as HTMLElement);

            const scrollableParent = typeof this.scrollableParent === 'string' ? document.getElementById(this.scrollableParent) : this.scrollableParent;

            this.renderer.addClass(gridItem.elementRef.nativeElement, 'no-transitions');
            this.renderer.addClass(gridItem.elementRef.nativeElement, 'emr-grid-item-dragging');

            const placeholderClientRect: ClientRect = {
                ...dragElemClientRect,
                left: dragElemClientRect.left - gridElemClientRect.left,
                top: dragElemClientRect.top - gridElemClientRect.top
            }
            this.createPlaceholderElement(placeholderClientRect, gridItem.placeholder);

            let newLayout: GridLayoutItem[];

            // TODO (enhancement): consider move this 'side effect' observable inside the main drag loop.
            //  - Pros are that we would not repeat subscriptions and takeUntil would shut down observables at the same time.
            //  - Cons are that moving this functionality as a side effect inside the main drag loop would be confusing.
            const scrollSubscription = this.ngZone.runOutsideAngular(() =>
                (!scrollableParent ? NEVER : this.gridService.mouseOrTouchMove$(document).pipe(
                    map((event) => ({
                        pointerX: PointerClientX(event),
                        pointerY: PointerClientY(event)
                    })),
                    ScrollIfNearElementClientRect$(scrollableParent, {scrollStep: this.scrollSpeed})
                )).pipe(
                    takeUntil(PointerUp(document))
                ).subscribe());

          /**
             * Main subscription, it listens for 'pointer move' and 'scroll' events and recalculates the layout on each emission
             */
            const subscription = this.ngZone.runOutsideAngular(() =>
                merge(
                    combineLatest([
                        this.gridService.mouseOrTouchMove$(document),
                        ...(!scrollableParent ? [of({top: 0, left: 0})] : [
                            GetScrollTotalRelativeDifference$(scrollableParent).pipe(
                                startWith({top: 0, left: 0}) // Force first emission to allow CombineLatest to emit even no scroll event has occurred
                            )
                        ])
                    ])
                ).pipe(
                    takeUntil(PointerUp(document)),
                  // @ts-ignore
                ).subscribe(([pointerDragEvent, scrollDifference]: [MouseEvent | TouchEvent | PointerEvent, { top: number, left: number }]) => {
                        pointerDragEvent.preventDefault();

                        /**
                         * Set the new layout to be the layout in which the calcNewStateFunc would be executed.
                         * NOTE: using the mutated layout is the way to go by 'react-grid-layout' utils. If we don't use the previous layout,
                         * some utilities from 'react-grid-layout' would not work as expected.
                         */
                        const currentLayout: GridLayout = newLayout || this.layout;

                        // Get the correct newStateFunc depending on if we are dragging or resizing
                        const calcNewStateFunc = type === 'drag' ? GridItemDragging : GridItemResizing;

                        const {layout, draggedItemPos} = calcNewStateFunc(gridItem, {
                            layout: currentLayout,
                            rowHeight: this.rowHeight,
                            height: this.height,
                            cols: this.cols,
                            preventCollision: this.preventCollision,
                            gap: this.gap,
                        }, this.compactType, {
                            pointerDownEvent,
                            pointerDragEvent,
                            gridElemClientRect,
                            dragElemClientRect,
                            scrollDifference
                        });
                        newLayout = layout;

                        this.gridCurrentHeight = this.height ?? (this.rowHeight === 'fit' ? gridElemClientRect.height : getGridHeight(newLayout, this.rowHeight, this.gap))

                        this._gridItemsRenderData = layoutToRenderItems({
                            cols: this.cols,
                            rowHeight: this.rowHeight,
                            height: this.height,
                            layout: newLayout,
                            preventCollision: this.preventCollision,
                            gap: this.gap,
                        }, gridElemClientRect.width, gridElemClientRect.height);

                        const newGridItemRenderData = {...this._gridItemsRenderData[gridItem.id]}
                        const placeholderStyles = parseRenderItemToPixels(newGridItemRenderData);

                        // Put the real final position to the placeholder element
                        this.placeholder!.style.width = placeholderStyles.width;
                        this.placeholder!.style.height = placeholderStyles.height;
                        this.placeholder!.style.transform = `translateX(${placeholderStyles.left}) translateY(${placeholderStyles.top})`;

                        // modify the position of the dragged item to be the once we want (for example the mouse position or whatever)
                        this._gridItemsRenderData[gridItem.id] = {
                            ...draggedItemPos,
                            id: this._gridItemsRenderData[gridItem.id].id
                        };

                        this.setBackgroundCssVariables(this.rowHeight === 'fit' ? GetGridItemRowHeight(newLayout, gridElemClientRect.height, this.gap) : this.rowHeight);

                        this.render();

                        // If we are performing a resize, and bounds have changed, emit event.
                        // NOTE: Only emit on resize for now. Use case for normal drag is not justified for now. Emitting on resize is, since we may want to re-render the grid item or the placeholder in order to fit the new bounds.
                        if (type === 'resize') {
                            const prevGridItem = currentLayout.find(item => item.id === gridItem.id)!;
                            const newGridItem = newLayout.find(item => item.id === gridItem.id)!;
                            // Check if item resized has changed, if so, emit resize change event
                            if (!GridItemLayoutItemAreEqual(prevGridItem, newGridItem)) {
                                this.gridItemResize.emit({
                                    width: newGridItemRenderData.width,
                                    height: newGridItemRenderData.height,
                                    gridItemRef: getDragResizeEventData(gridItem, newLayout).gridItemRef
                                });
                            }
                        }
                    },
                    (error) => observer.error(error),
                    () => {
                        this.ngZone.run(() => {
                            // Remove drag classes
                            this.renderer.removeClass(gridItem.elementRef.nativeElement, 'no-transitions');
                            this.renderer.removeClass(gridItem.elementRef.nativeElement, 'emr-grid-item-dragging');

                            this.addGridItemAnimatingClass(gridItem).subscribe();
                            // Consider destroying the placeholder after the animation has finished.
                            this.destroyPlaceholder();

                            if (newLayout) {
                                // TODO: newLayout should already be pruned. If not, it should have type Layout, not GridLayout as it is now.
                                // Prune react-grid-layout compact extra properties.
                                observer.next(newLayout.map(item => ({
                                    id: item.id,
                                    x: item.x,
                                    y: item.y,
                                    w: item.w,
                                    h: item.h,
                                    minW: item.minW,
                                    minH: item.minH,
                                    maxW: item.maxW,
                                    maxH: item.maxH,
                                })) as GridLayout);
                            } else {
                                // TODO: Need we really to emit if there is no layout change but drag started and ended?
                                observer.next(this.layout);
                            }

                            observer.complete();
                        });

                    }));


            return () => {
                scrollSubscription.unsubscribe();
                subscription.unsubscribe();
            };
        });
    }


    /**
     * It adds the `emr-grid-item-animating` class and removes it when the animated transition is complete.
     * This function is meant to be executed when the drag has ended.
     * @param gridItem that has been dragged
     */
    private addGridItemAnimatingClass(gridItem: GridItemComponent): Observable<undefined> {

        return new Observable(observer => {

            const duration = getTransformTransitionDurationInMs(gridItem.elementRef.nativeElement);

            if (duration === 0) {
                observer.next();
                observer.complete();
                return;
            }

            this.renderer.addClass(gridItem.elementRef.nativeElement, 'emr-grid-item-animating');
            const handler = ((event: TransitionEvent) => {
                if (!event || (event.target === gridItem.elementRef.nativeElement && event.propertyName === 'transform')) {
                    this.renderer.removeClass(gridItem.elementRef.nativeElement, 'emr-grid-item-animating');
                    removeEventListener();
                    clearTimeout(timeout);
                    observer.next();
                    observer.complete();
                }
            }) as EventListener;

            // If a transition is short enough, the browser might not fire the `transitionend` event.
            // Since we know how long it's supposed to take, add a timeout with a 50% buffer that'll
            // fire if the transition hasn't completed when it was supposed to.
            const timeout = setTimeout(handler, duration * 1.5);
            const removeEventListener = this.renderer.listen(gridItem.elementRef.nativeElement, 'transitionend', handler);
        })
    }

    /** Creates placeholder element */
    private createPlaceholderElement(clientRect: ClientRect, gridItemPlaceholder?: GridItemPlaceholder) {
        this.placeholder = this.renderer.createElement('div');
        this.placeholder!.style.width = `${clientRect.width}px`;
        this.placeholder!.style.height = `${clientRect.height}px`;
        this.placeholder!.style.transform = `translateX(${clientRect.left}px) translateY(${clientRect.top}px)`;
        this.placeholder!.classList.add('emr-grid-item-placeholder');
        this.renderer.appendChild(this.elementRef.nativeElement, this.placeholder);

        // Create and append custom placeholder if provided.
        // Important: Append it after creating & appending the container placeholder. This way we ensure parent bounds are set when creating the embeddedView.
        if (gridItemPlaceholder) {
            this.placeholderRef = this.viewContainerRef.createEmbeddedView(
                gridItemPlaceholder.templateRef,
                gridItemPlaceholder.data
            );
            this.placeholderRef.rootNodes.forEach(node => this.placeholder!.appendChild(node));
            this.placeholderRef.detectChanges();
        } else {
            this.placeholder!.classList.add('emr-grid-item-placeholder-default');
        }
    }

    /** Destroys the placeholder element and its ViewRef. */
    private destroyPlaceholder() {
        this.placeholder?.remove();
        this.placeholderRef?.destroy();
        this.placeholder = this.placeholderRef = null!;
    }

    static ngAcceptInputType_cols: NumberInput;
    static ngAcceptInputType_rowHeight: NumberInput;
    static ngAcceptInputType_scrollSpeed: NumberInput;
    static ngAcceptInputType_compactOnPropsChange: BooleanInput;
    static ngAcceptInputType_preventCollision: BooleanInput;
}

