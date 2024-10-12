import { Component, input } from '@angular/core';
import { Widget } from '@elementar/components/dashboard';

@Component({
  selector: 'app-sample-widget',
  standalone: true,
  imports: [],
  templateUrl: './sample-widget.component.html',
  styleUrl: './sample-widget.component.scss'
})
export class SampleWidgetComponent {
  widget = input.required<Widget>();
}
