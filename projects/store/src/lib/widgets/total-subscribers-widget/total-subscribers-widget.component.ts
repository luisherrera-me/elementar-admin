import { Component, inject, input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Dashboard, DASHBOARD, Widget } from '@elementar/components/dashboard';

@Component({
  selector: 'emr-total-subscribers-widget',
  imports: [
    CommonModule,
    MatIcon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './total-subscribers-widget.component.html',
  styleUrl: './total-subscribers-widget.component.scss'
})
export class TotalSubscribersWidgetComponent implements OnInit, OnChanges {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input.required<Widget>();
  data: number = 0; // Para almacenar el valor actual del widget
  previousValue: number = 0; // El valor anterior de la energía (este es solo un ejemplo)
  currentValue: number = 0; // Para almacenar el valor actual del widget
  difference: number = 0; // La diferencia calculada

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.id);
      this.data = parseFloat((this.widget()['data']/ 1000).toFixed(2));
      this.currentValue = this.widget()['data']
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
