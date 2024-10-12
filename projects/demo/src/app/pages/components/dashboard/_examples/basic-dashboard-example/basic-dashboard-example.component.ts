import { Component } from '@angular/core';
import { DashboardComponent, DashboardWidgetDefDirective, Widget } from '@elementar/components/dashboard';
import { SampleWidgetComponent } from '../sample-widget/sample-widget.component';

@Component({
  selector: 'app-basic-dashboard-example',
  standalone: true,
  imports: [
    DashboardComponent,
    SampleWidgetComponent,
    DashboardWidgetDefDirective
  ],
  templateUrl: './basic-dashboard-example.component.html',
  styleUrl: './basic-dashboard-example.component.scss'
})
export class BasicDashboardExampleComponent {
  widgets: Widget[] = [
    {
      id: 1,
      name: 'Sample Widget',
      type: 'sample',
      cols: 4,
      rows: 3
    },
    {
      id: 2,
      name: 'Sample Widget',
      type: 'sample',
      cols: 4,
      rows: 3
    },
    {
      id: 3,
      name: 'Sample Widget',
      type: 'sample',
      cols: 4,
      rows: 3
    },
    {
      id: 1,
      name: 'Sample Widget',
      type: 'sample',
      cols: 8,
      rows: 6
    },
    {
      id: 2,
      name: 'Sample Widget',
      type: 'sample',
      cols: 4,
      rows: 3
    },
    {
      id: 2,
      name: 'Sample Widget',
      type: 'sample',
      cols: 4,
      rows: 3
    }
  ];
}
