import { Component } from '@angular/core';
import { PageComponent } from '../../../../@meta/page/page.component';
import { PageContentDirective } from '../../../../@meta/page/page-content.directive';
import { PlaygroundComponent } from '../../../../@meta/playground/playground.component';
import {
  BasicActionRequiredExampleComponent
} from '../_examples/basic-action-required-example/basic-action-required-example.component';

@Component({
  selector: 'app-overview',
  imports: [
    PageComponent,
    PageContentDirective,
    PlaygroundComponent,
    BasicActionRequiredExampleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
