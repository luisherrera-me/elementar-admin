import { Component } from '@angular/core';
import { SampleWidgetComponent } from '../sample-widget/sample-widget.component';
import { GridStackComponent, GridStackItem, GridStackItemDefDirective } from '@elementar/components/grid-stack';

@Component({
  selector: 'app-basic-dashboard-example',
  standalone: true,
  imports: [
    SampleWidgetComponent,
    GridStackComponent,
    GridStackItemDefDirective
  ],
  templateUrl: './basic-dashboard-example.component.html',
  styleUrl: './basic-dashboard-example.component.scss'
})
export class BasicDashboardExampleComponent {
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
      id: 1,
      name: 'Sample Widget',
      type: 'sample',
      content: 'Sample Widget 4',
      w: 8,
      h: 4,
      x: 0,
      y: 2
    },
    {
      id: 2,
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
