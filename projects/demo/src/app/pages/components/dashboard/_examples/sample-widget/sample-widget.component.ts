import { Component, input } from '@angular/core';
import { GridStackItem } from '@elementar/components/grid-stack';

@Component({
  selector: 'app-sample-widget',
  standalone: true,
  imports: [],
  templateUrl: './sample-widget.component.html',
  styleUrl: './sample-widget.component.scss'
})
export class SampleWidgetComponent {
  widget = input.required<GridStackItem>();
}
