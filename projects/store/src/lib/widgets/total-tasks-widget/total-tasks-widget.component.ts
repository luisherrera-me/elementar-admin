import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MchartLineComponent, MchartTooltipBodyComponent, MchartTooltipComponent, MchartTooltipTitleComponent } from '@elementar/components/micro-chart';
import { Dashboard, DASHBOARD, Widget } from '@elementar/components/dashboard';

@Component({
  selector: 'emr-total-tasks-widget',
  templateUrl: './total-tasks-widget.component.html',
  styleUrls: ['./total-tasks-widget.component.scss'],
  imports: [
    CommonModule,
    MchartTooltipBodyComponent,
    MchartTooltipComponent,
    MchartTooltipTitleComponent,
    MchartLineComponent
  ]
})
export class TotalTasksWidgetComponent implements OnInit {
  data: number[] = [0,0,0,0,0,0];
  labels: string[] = ["0","0","0","0","0","0"];

  previousValue: number = 0;
  currentValue: number = 0;
  difference: number = 0;
  
  showChart: boolean = true; // 🔥 Controla la visibilidad del gráfico

  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  @Input() widget!: Widget;

  ngOnInit() {
    if (this._dashboard && this.widget) {
      this._dashboard.markWidgetAsLoaded(this.widget.id);
      this.currentValue = this.widget['data'];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['widget']) {
      const newValue = this.widget['data'];
      this.difference = newValue - this.previousValue;
      this.previousValue = newValue;
      this.currentValue = newValue;

      this.updateChartData(newValue);
    }
  }

  private updateChartData(newValue: number): void {
    const currentMinute = new Date().toLocaleTimeString('es-ES', { minute: '2-digit', second: '2-digit' });

    this.data = [...this.data, newValue].slice(-10);
    this.labels = [...this.labels, currentMinute].slice(-10);

    // 🔥 Forzar reinicio del componente gráfico
    this.showChart = false;
    setTimeout(() => {
      this.showChart = true;
    }, 0);
  }
}
