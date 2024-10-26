import { Component } from '@angular/core';
import { GridStackComponent, GridStackItem, GridStackItemDefDirective } from '@elementar/components/grid-stack';
import { SampleWidgetComponent } from '../sample-widget/sample-widget.component';

@Component({
  selector: 'app-basic-grid-stack-example',
  standalone: true,
  imports: [
    SampleWidgetComponent,
    GridStackComponent,
    GridStackItemDefDirective
  ],
  templateUrl: './basic-grid-stack-example.component.html',
  styleUrl: './basic-grid-stack-example.component.scss'
})
export class BasicGridStackExampleComponent {
  widgets: GridStackItem[] = [
    {
      id: 1,
      name: 'Sample Widget',
      type: 'sample',
      content: 'Sample Widget 1',
      w: 4,
      h: 2,
      x: 0,
      y: 0
    },
    {
      id: 2,
      name: 'Sample Widget',
      type: 'sample',
      content: 'Sample Widget 2',
      w: 4,
      h: 2,
      x: 4,
      y: 0
    },
    {
      id: 3,
      name: 'Sample Widget',
      type: 'sample',
      content: 'Sample Widget 3',
      x: 8,
      y: 0,
      w: 4,
      h: 2
    },
    {
      id: 4,
      name: 'Sample Widget',
      type: 'sample',
      content: 'Sample Widget 4',
      w: 8,
      h: 4,
      x: 0,
      y: 2
    },
    {
      id: 5,
      name: 'Sample Widget',
      type: 'sample',
      content: 'Sample Widget 5',
      w: 4,
      h: 4,
      y: 2,
      x: 8
    }
  ];
}
