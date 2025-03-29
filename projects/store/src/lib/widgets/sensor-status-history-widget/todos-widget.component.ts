
import { MatCard } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatRipple } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { DeviceService } from '../../../../../../src/app/core/services/device/device.service';
import { NgClass } from '@angular/common';
import { Dashboard, DASHBOARD, Widget } from '@elementar/components/dashboard';


export interface SwitchHistory {
  id: number;
  switchOutput: boolean;
  changedAt: string;
}

@Component({
  selector: 'emr-todos-widget',
  imports: [
    CommonModule,
    NgClass,
    MatIcon,
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatRow,
    MatTable,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef
  ],
  templateUrl: './todos-widget.component.html',
  styleUrl: './todos-widget.component.scss'
})


export class TodosWidgetComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _destroyRef = inject(DestroyRef);
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  currentValue: number = 0; // Para almacenar el valor actual del widget
  valor: number = 0; // La diferencia calculada
  widget = input.required<Widget>();

  constructor(private apiService: DeviceService) {}
  displayedColumns: string[] = ['id', 'switchOutput', 'changedAt'];
  historyDataSource = new MatTableDataSource<SwitchHistory>([]);
  selection = new SelectionModel<SwitchHistory>(true, []);

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.id);
      console.log(this.widget()['data'] + 'data');
      this.loadSwitchHistory(this.widget()['data']);
    }
  }

  loadSwitchHistory(deviceId: number) {
    this.apiService.getHistoryByDeviceId(deviceId).subscribe(
      (history: SwitchHistory[]) => {
        this.historyDataSource.data = history;
      },
      (error) => {
        console.error('Error loading switch history:', error);
      }
    );
  }
}
