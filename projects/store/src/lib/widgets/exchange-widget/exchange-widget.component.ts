import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatRipple } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dashboard, DASHBOARD, Widget } from '@elementar/components/dashboard';

@Component({
    selector: 'emr-exchange-widget',
    imports: [
        MatIcon,
        MatDivider,
        MatRipple,
        MatButton,
        ReactiveFormsModule
    ],
    templateUrl: './exchange-widget.component.html',
    styleUrl: './exchange-widget.component.scss'
})
export class ExchangeWidgetComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _destroyRef = inject(DestroyRef);
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  currentValue: number = 0; // Para almacenar el valor actual del widget
  valor: string; // La diferencia calculada
  widget = input.required<Widget>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.id);
      
      this.currentValue = parseFloat((this.widget()['data']/ 1000).toFixed(2));
      this.valor = (this.currentValue * 737.6).toFixed(2);
      this.valor = parseFloat(this.valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });


    }
  }
  conversionFromRate: number = 737.6;
  conversionToRate: number = 0.7532;
  currentConversionRate = 737.6;
  currencyFrom = 'kWh';
  currencyTo = '$COP';

  form: FormGroup = this._fb.group({
    from: [],
    to: []
  });

  

  toggleCurrencies() {
    const prevCurrencyFrom = this.currencyFrom;
    this.currencyFrom = this.currencyTo;
    this.currencyTo = prevCurrencyFrom;

    const prevConversionToRate = this.conversionToRate;
    this.conversionToRate = this.conversionFromRate;
    this.conversionFromRate = prevConversionToRate;
    this.currentConversionRate = this.conversionFromRate;

    this.form.get('from')?.setValue(this.form.value['from']);
  }
}
