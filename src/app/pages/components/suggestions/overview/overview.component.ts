import { Component } from '@angular/core';
import { PlaygroundComponent } from '../../../../@meta/playground/playground.component';
import {
  BasicSuggestionsExampleComponent
} from '../_examples/basic-suggestions-example/basic-suggestions-example.component';
import { PageComponent } from '../../../../@meta/page/page.component';
import { PageContentDirective } from '../../../../@meta/page/page-content.directive';

@Component({
  selector: 'app-overview',
  imports: [
    PlaygroundComponent,
    BasicSuggestionsExampleComponent,
    PageComponent,
    PageContentDirective
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
