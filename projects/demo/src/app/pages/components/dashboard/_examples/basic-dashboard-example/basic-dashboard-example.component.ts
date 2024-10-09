import { Component } from '@angular/core';
import { DashboardComponent } from '@elementar/components/dashboard';

@Component({
  selector: 'app-basic-dashboard-example',
  standalone: true,
  imports: [
    DashboardComponent
  ],
  templateUrl: './basic-dashboard-example.component.html',
  styleUrl: './basic-dashboard-example.component.scss'
})
export class BasicDashboardExampleComponent {

}
