import { Component } from '@angular/core';
import { PlaygroundComponent } from '@demo/meta/playground/playground.component';
import { FullPageComponent } from '@demo/meta/full-page/full-page.component';
import {
  BasicGridStackExampleComponent
} from '../_examples/basic-grid-stack-example/basic-grid-stack-example.component';

@Component({
  standalone: true,
  imports: [
    FullPageComponent,
    PlaygroundComponent,
    BasicGridStackExampleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
