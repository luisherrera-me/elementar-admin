import { Component } from '@angular/core';
import { PlaygroundComponent } from '@demo/meta/playground/playground.component';
import { BasicDashboardExampleComponent } from '../_examples/basic-dashboard-example/basic-dashboard-example.component';
import { FullPageComponent } from '@demo/meta/full-page/full-page.component';

@Component({
  standalone: true,
  imports: [
    FullPageComponent,
    PlaygroundComponent,
    BasicDashboardExampleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
