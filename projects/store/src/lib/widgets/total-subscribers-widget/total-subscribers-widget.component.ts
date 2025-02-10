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

  previousValue: number = 0; // El valor anterior de la energía (este es solo un ejemplo)
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
    // Verifica si el valor del widget ha cambiado
    if (changes['widget']) {
      // Obtener el nuevo valor del widget
      const newValue = this.widget()['data'];

      // Calcular la diferencia entre el valor actual y el valor anterior
      this.difference = newValue - this.previousValue;

      // Actualizar el valor anterior para la próxima comparación
      this.previousValue = newValue;

      // Actualizar el valor actual con el nuevo valor
      this.currentValue = newValue;
    }
  }
}
