import { Component, inject, input, OnInit, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD, Widget } from '@elementar/components/dashboard';

@Component({
    selector: 'emr-avg-open-rate-widget',
    imports: [
      CommonModule,
      MatIcon,
      MatRipple,
      MatTooltip
    ],
    templateUrl: './avg-open-rate-widget.component.html',
    styleUrl: './avg-open-rate-widget.component.scss'
})
export class AvgOpenRateWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input.required<Widget>();
  
  previousValue: number = 0; // El valor anterior de la energía
  currentValue: number = 0; // Para almacenar el valor actual del widget
  difference: number = 0; // La diferencia calculada
  
  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.id);
      
      // Obtener el valor inicial de los datos del widget
      this.currentValue = this.widget()['data'];
      this.previousValue = this.currentValue;
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['widget']) {
      const newValue = this.widget()['data'];
      this.difference = newValue - this.previousValue;
      this.previousValue = newValue;
      this.currentValue = newValue;
    }
  }
}
