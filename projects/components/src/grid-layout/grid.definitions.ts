import { InjectionToken } from '@angular/core';
import { CompactType } from './utils/react-grid-layout.utils';
import { ClientRect } from './utils/client-rect';

export interface GridLayoutItem {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
}

export type GridCompactType = CompactType;


export interface GridBackgroundCfg {
    show: 'never' | 'always' | 'whenDragging';
    borderColor?: string;
    gapColor?: string;
    rowColor?: string;
    columnColor?: string;
    borderWidth?: number;
}

export interface GridCfg {
    cols: number;
    rowHeight: number | 'fit'; // row height in pixels
    height?: number | null;
    layout: GridLayoutItem[];
    preventCollision: boolean;
    gap: number;
}

export type GridLayout = GridLayoutItem[];

// TODO: Remove this interface. If can't remove, move and rename this interface in the core module or similar.
export interface GridItemRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface GridItemRenderData<T = number | string> {
    id: string;
    top: T;
    left: T;
    width: T;
    height: T;
}

/**
 * We inject a token because of the 'circular dependency issue warning'. In case we don't had this issue with the circular dependency, we could just
 * import GridComponent on GridItem and execute the needed function to get the rendering data.
 */
export type GridItemRenderDataTokenType = (id: string) => GridItemRenderData<string>;
export const GRID_ITEM_GET_RENDER_DATA_TOKEN: InjectionToken<GridItemRenderDataTokenType> = new InjectionToken('GRID_ITEM_GET_RENDER_DATA_TOKEN');

export interface DraggingData {
    pointerDownEvent: MouseEvent | TouchEvent;
    pointerDragEvent: MouseEvent | TouchEvent;
    gridElemClientRect: ClientRect;
    dragElemClientRect: ClientRect;
    scrollDifference: { top: number, left: number };
}
