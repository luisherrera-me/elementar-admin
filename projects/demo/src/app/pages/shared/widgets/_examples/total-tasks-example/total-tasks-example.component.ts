import { Component } from '@angular/core';
import { TotalTasksWidgetComponent } from '@elementar/shared/widgets';

@Component({
  selector: 'app-total-tasks-example',
  standalone: true,
  imports: [
    TotalTasksWidgetComponent
  ],
  templateUrl: './total-tasks-example.component.html',
  styleUrl: './total-tasks-example.component.scss'
})
export class TotalTasksExampleComponent {

}
