import { Type } from "@angular/core";

export interface Widget {
  id: string | number;
  name: string;
  content: Type<unknown>;
  cols: number;
  rows: number;
}
