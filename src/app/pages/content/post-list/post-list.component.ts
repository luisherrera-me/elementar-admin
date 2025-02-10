import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import {
  DataView,
  DataViewActionBarComponent, DataViewActionBarDirective, DataViewAPI,
  DataViewCellRenderer,
  DataViewColumnDef,
  DataViewComponent, DataViewEmptyDataDirective, DataViewEmptyFilterResultsDirective,
  DataViewRowSelectionEvent
} from '@elementar/components/data-view';
import { VDividerComponent } from '@elementar/components/divider';
import { SegmentedButtonComponent, SegmentedComponent } from '@elementar/components/segmented';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  BlockStateActionsComponent,
  BlockStateComponent,
  BlockStateContentComponent, BlockStateIconComponent,
  BlockStateImageComponent
} from '@elementar/components/block-state';
import {
  PanelBodyComponent,
  PanelComponent,
  PanelFooterComponent,
  PanelHeaderComponent
} from '@elementar/components/panel';
import { SensorService } from '../../../core/socket/sensor/sensor.service';
import { DeviceService } from '../../../core/services/device/device.service';
import { Subscription } from 'rxjs';
import { RegisterDeviceDialogComponent } from '../../components/register-device/register-device-dialog/register-device-dialog.component';
import { MatDialog } from '@angular/material/dialog';
export interface Device {
  id: number;
  sensorName: string;
  ip: string;
  mac: string;
  city: number;
  department: number;
  model: string;
  firmware: string;
  wifi_ssid: string;
  wifi_rssi:number;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  state?: boolean;  // Estado del switch (encendido/apagado)
  apower?: number;  // Potencia consumida
  aenergyTotal: number; // Energía total consumida
  online?: boolean; // Estado de conexión
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Post {
  id: string;
  title: string;
  author: User;
  status: string;
  createdAt: Date;
  publishedAt?: Date;
}

@Component({
  imports: [
    MatChipsModule,
    CommonModule,
    DataViewComponent,
    MatPaginator,
    FormsModule,
    MatButton,
    MatIcon,
    VDividerComponent,
    // MatIconButton,
    SegmentedButtonComponent,
    SegmentedComponent,
    DataViewActionBarComponent,
    DataViewActionBarDirective,
    // MatMenu,
    // MatMenuItem,
    // MatMenuTrigger,
    BlockStateComponent,
    DataViewEmptyDataDirective,
    BlockStateContentComponent,
    DataViewEmptyFilterResultsDirective,
    BlockStateIconComponent,
    PanelHeaderComponent,
    PanelComponent,
    PanelFooterComponent,
    PanelBodyComponent,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit {
  private _httpClient = inject(HttpClient);

  isDeviceOn: boolean = false;
  selectedDevice: Device;

  devicesOn: number = 0;
  devicesOff: number = 0;
  totalPower: number = 0;
  totalEnergy: number = 0;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private apiService: DeviceService,
    private sensorService: SensorService
  ) {}

  status = 'all';
  columnDefs = [
    { name: 'ID', dataField: 'id', visible: false },
    { name: 'Nombre', dataField: 'sensorName', visible: true },
    { name: 'IP', dataField: 'ip', visible: true },
    { name: 'MAC', dataField: 'mac', visible: false },
    { name: 'Modelo', dataField: 'model', visible: true },
    { name: 'Firmware', dataField: 'firmware', visible: false },
    { name: 'Estado', dataField: 'state', dataRenderer: 'status', visible: true }, // Nueva columna de estado
    { name: 'Online', dataField: 'online', dataRenderer: 'onlineStatus', visible: true }, // Nueva columna de conexión
    { name: 'Potencia (W)', dataField: 'apower', visible: true },
    { name: 'Energía Total (kWh)', dataField: 'aenergyTotal', visible: true },
    { name: 'Última actualización', dataField: 'updatedAt', dataRenderer: 'date', visible: true }
  ];

  private sensorSubscription!: Subscription;
  data: Device[] = [];
  selectedRows: Device[] = [];
  search = '';
  cellRenderers: DataViewCellRenderer[] = [
    {
      dataRenderer: 'author',
      component: () => import('../_renderers/dv-author-renderer/dv-author-renderer.component').then(c => c.DvAuthorRendererComponent)
    },
    {
      dataRenderer: 'date',
      component: () => import('../_renderers/dv-date-renderer/dv-date-renderer.component').then(c => c.DvDateRendererComponent)
    }
  ];


  ngOnInit() {
    this.sensorService.connect();
    this.apiService.getDevices().subscribe(
      (devices) => {
        this.data = devices.map(device => ({
          ...device,
          online: false,
          state: false,
          apower: 0,
          aenergyTotal: 0
        }));
      },
      (error) => {
        console.error('Error fetching devices:', error);
      }
    );
    this.sensorSubscription = this.sensorService.messages$.subscribe((message) => {
      if (message?.switches) {
        this.updateDeviceStats(message.switches);
      }
    });
  }

  private updateDeviceStats(switches: any[]): void {
    const switchMap = new Map<string, any>();
    switches.forEach(sw => switchMap.set(sw.id, sw));
    this.data = this.data.map(device => {
      const switchData = switchMap.get(device.mac);
      if (switchData) {
        return {
          ...device,
          online: true,
          state: switchData.state,
          apower: switchData.apower,
          aenergyTotal: switchData.aenergyTotal
        };
      } else {
        return {
          ...device,
          online: false,
          state: false,
          apower: 0,
          aenergyTotal: device.aenergyTotal
        };
      }
    });
  }

  rowSelectionChanged(event: DataViewRowSelectionEvent<Device>): void {
    this.selectedRows = event.checked ? [...this.selectedRows, event.row] : this.selectedRows.filter(d => d.id !== event.row.id);
  }

  selectionChanged(rows: Device[]): void {
    console.log('Filas seleccionadas:', rows);
    this.selectedRows = rows;
  }


  allRowsSelectionChanged(isAllSelected: boolean): void {
    console.log(isAllSelected);
  }

  onPowerClick(): void {
    if (this.selectedRows.length > 0) {
      console.log('Información del dispositivo seleccionado:', this.selectedRows[0]);
    } else {
      console.log('No se ha seleccionado ningún dispositivo');
    }
  }

  onSelectDevice(device: Device): void {
    this.selectedDevice = device;
  
    console.log('Dispositivo seleccionado:', this.selectedDevice);
  }

  toggleSwitchState(device: Device): void {
    if (!device.mac) {
      console.error('El dispositivo no tiene una MAC válida');
      return;
    }
    const newState = !device.state;
    const message = {
      switchId: device.mac,
      state: newState
    };
    this.sensorService.sendMessage(message);
  
    // Actualizar estado localmente
    device.state = newState;
  }

  openRegisterDialog(): void {
    console.log("menu de dialogo")
    const dialogRef = this.dialog.open(RegisterDeviceDialogComponent, {
      width: '500px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Nuevo dispositivo registrado:', result);
        // Aquí puedes hacer algo con los datos, como enviarlos a un servicio
        this.fetchDevices();

      }
    });
  }

  fetchDevices(): void {
    this.apiService.getDevices().subscribe(
      (devices) => {
        this.data = devices.map(device => ({
          ...device,
          online: false,
          state: false,
          apower: 0,
          aenergyTotal: 0
        }));
      },
      (error) => {
        console.error('Error fetching devices:', error);
      }
    );
  }


  verDetalle(device: Device): void {
    console.log(device)
    if (!device) {
      console.error('El dispositivo no tiene una MAC válida');
      return;
    }
    const newState = !device;
    this.router.navigate(['/pages/dashboard/ecommerce', device]);
  }

}
