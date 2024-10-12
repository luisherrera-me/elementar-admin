import { fromEvent, iif, merge, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NormalizePassiveListenerOptions } from './passive-listeners';

/** Options that can be used to bind a passive event listener. */
const passiveEventListenerOptions = NormalizePassiveListenerOptions({passive: true});

/** Options that can be used to bind an active event listener. */
const activeEventListenerOptions = NormalizePassiveListenerOptions({passive: false});

let isMobile: boolean | null = null;

export function IsMobileOrTablet(): boolean {

    if (isMobile != null) {
        return isMobile;
    }

    // Generic match pattern to identify mobile or tablet devices
    const isMobileDevice = /Android|webOS|BlackBerry|Windows Phone|iPad|iPhone|iPod/i.test(navigator.userAgent);

    // Since IOS 13 is not safe to just check for the generic solution. See: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    const isIOSMobileDevice = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    isMobile = isMobileDevice || isIOSMobileDevice;

    return isMobile;
}

export function IsMouseEvent(event: any): event is MouseEvent {
    return (event as MouseEvent).clientX != null;
}

export function IsTouchEvent(event: any): event is TouchEvent {
    return (event as TouchEvent).touches != null && (event as TouchEvent).touches.length != null;
}

export function PointerClientX(event: MouseEvent | TouchEvent): number {
    return IsMouseEvent(event) ? event.clientX : event.touches[0].clientX;
}

export function PointerClientY(event: MouseEvent | TouchEvent): number {
    return IsMouseEvent(event) ? event.clientY : event.touches[0].clientY;
}

export function PointerClient(event: MouseEvent | TouchEvent): { clientX: number, clientY: number } {
    return {
        clientX: IsMouseEvent(event) ? event.clientX : event.touches[0].clientX,
        clientY: IsMouseEvent(event) ? event.clientY : event.touches[0].clientY
    };
}

export function IsMouseEventOrMousePointerEvent(event: MouseEvent | TouchEvent | PointerEvent): boolean {
    return event.type === 'mousedown'
        || (event.type === 'pointerdown' && (event as PointerEvent).pointerType === 'mouse');
}

/** Returns true if browser supports pointer events */
export function SupportsPointerEvents(): boolean {
    return !!window.PointerEvent;
}

/**
 * Emits when a mousedown or touchstart emits. Avoids conflicts between both events.
 * @param element
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
function MouseOrTouchDown(element: any, touchNumber = 1): Observable<MouseEvent | TouchEvent> {
    return iif(
        () => IsMobileOrTablet(),
        fromEvent<TouchEvent>(element, 'touchstart', passiveEventListenerOptions as AddEventListenerOptions).pipe(
            filter((touchEvent) => touchEvent.touches.length === touchNumber)
        ),
        fromEvent<MouseEvent>(element, 'mousedown', activeEventListenerOptions as AddEventListenerOptions).pipe(
            filter((mouseEvent: MouseEvent) => {
                /**
                 * 0 : Left mouse button
                 * 1 : Wheel button or middle button (if present)
                 * 2 : Right mouse button
                 */
                return mouseEvent.button === 0; // Mouse down to be only fired if is left click
            })
        )
    );
}

/**
 * Emits when a 'mousemove' or a 'touchmove' event gets fired.
 * @param element, html element where to  listen the events.
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
function MouseOrTouchMove(element: HTMLElement, touchNumber = 1): Observable<MouseEvent | TouchEvent> {
    return iif(
        () => IsMobileOrTablet(),
        fromEvent<TouchEvent>(element, 'touchmove', activeEventListenerOptions as AddEventListenerOptions).pipe(
            filter((touchEvent) => touchEvent.touches.length === touchNumber),
        ),
        fromEvent<MouseEvent>(element, 'mousemove', activeEventListenerOptions as AddEventListenerOptions)
    );
}

export function TouchEnd(element: any, touchNumber = 1): Observable<TouchEvent> {
    return merge(
        fromEvent<TouchEvent>(element, 'touchend').pipe(
            filter((touchEvent) => touchEvent.touches.length === touchNumber - 1)
        ),
        fromEvent<TouchEvent>(element, 'touchcancel').pipe(
            filter((touchEvent) => touchEvent.touches.length === touchNumber - 1)
        )
    );
}

/**
 * Emits when a there is a 'mouseup' or the touch ends.
 * @param element
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
function MouserOrTouchEnd(element: HTMLElement, touchNumber = 1): Observable<MouseEvent | TouchEvent> {
    return iif(
        () => IsMobileOrTablet(),
        TouchEnd(element, touchNumber),
        fromEvent<MouseEvent>(element, 'mouseup'),
    );
}


/**
 * Emits when a 'pointerdown' event occurs (only for the primary pointer). Fallbacks to 'mousemove' or a 'touchmove' if pointer events are not supported.
 * @param element
 */
export function PointerDown(element: any): Observable<MouseEvent | TouchEvent | PointerEvent> {
    if (!SupportsPointerEvents()) {
        return MouseOrTouchDown(element);
    }

    return fromEvent<PointerEvent>(element, 'pointerdown', activeEventListenerOptions as AddEventListenerOptions).pipe(
        filter((pointerEvent) => pointerEvent.isPrimary)
    )
}

/**
 * Emits when a 'pointermove' event occurs (only for the primary pointer). Fallbacks to 'mousemove' or a 'touchmove' if pointer events are not supported.
 * @param element
 */
export function PointerMove(element: any): Observable<MouseEvent | TouchEvent | PointerEvent> {
    if (!SupportsPointerEvents()) {
        return MouseOrTouchMove(element);
    }
    return fromEvent<PointerEvent>(element, 'pointermove', activeEventListenerOptions as AddEventListenerOptions).pipe(
        filter((pointerEvent) => pointerEvent.isPrimary),
    );
}

/**
 * Emits when a 'pointerup' event occurs (only for the primary pointer). Fallbacks to 'mousemove' or a 'touchmove' if pointer events are not supported.
 * @param element
 */
export function PointerUp(element: any): Observable<MouseEvent | TouchEvent | PointerEvent> {
    if (!SupportsPointerEvents()) {
        return MouserOrTouchEnd(element);
    }
    return fromEvent<PointerEvent>(element, 'pointerup').pipe(filter(pointerEvent => pointerEvent.isPrimary));
}
