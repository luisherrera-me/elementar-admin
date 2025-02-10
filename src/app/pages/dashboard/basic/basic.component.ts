import { Component, ChangeDetectorRef } from '@angular/core';
import { DashboardComponent, Widget, WidgetConfig } from '@elementar/components/dashboard';
import { DeviceService } from '../../../core/services/device/device.service';
import { SensorService } from '../../../core/socket/sensor/sensor.service';
import { Subscription } from 'rxjs';

@Component({
  imports: [
    DashboardComponent
  ],
  templateUrl: './basic.component.html',
  styleUrl: './basic.component.scss'
})
export class BasicComponent {

  // Variables para almacenar la información de los dispositivos
  devicesOn: number = 0;
  devicesOff: number = 0;
  totalPower: number = 0;
  totalEnergy: number = 0;

  constructor(
    private apiService: DeviceService,
    private sensorService: SensorService,
    private cdr: ChangeDetectorRef // Se inyecta ChangeDetectorRef para forzar actualización
  ) {}

  configs: WidgetConfig[] = [
    {
      type: 'total-subscribers-widget',
      skeleton: null,
      component: () =>
        import('@elementar/store/widgets/total-subscribers-widget/total-subscribers-widget.component')
        .then(c => c.TotalSubscribersWidgetComponent)
    },
    {
      type: 'avg-open-rate-widget',
      skeleton: null,
      component: () =>
        import('@elementar/store/widgets/avg-open-rate-widget/avg-open-rate-widget.component')
        .then(c => c.AvgOpenRateWidgetComponent)
    },
    {
      type: 'avg-click-rate-widget',
      skeleton: null,
      component: () =>
        import('@elementar/store/widgets/avg-click-rate-widget/avg-click-rate-widget.component')
        .then(c => c.AvgClickRateWidgetComponent)
    },
    {
      type: 'unique-visitors-widget',
      skeleton: null,
      component: () =>
        import('@elementar/store/widgets/unique-visitors-widget/unique-visitors-widget.component')
        .then(c => c.UniqueVisitorsWidgetComponent)
    },
    {
      type: 'total-tasks-widget',
      skeleton: null,
      component: () =>
        import('@elementar/store/widgets/total-tasks-widget/total-tasks-widget.component')
        .then(c => c.TotalTasksWidgetComponent)
    },
    {
      type: 'total-projects-widget',
      skeleton: null,
      component: () =>
        import('@elementar/store/widgets/total-projects-widget/total-projects-widget.component')
        .then(c => c.TotalProjectsWidgetComponent)
    },
    {
      type: 'events-widget',
      skeleton: null,
      component: () =>
        import('@elementar/store/widgets/events-widget/events-widget.component')
        .then(c => c.EventsWidgetComponent)
    },
    {
      type: 'team-widget',
      skeleton: null,
      component: () =>
        import('@elementar/store/widgets/team-widget/team-widget.component')
        .then(c => c.TeamWidgetComponent)
    },
    {
      type: 'tasks-in-progress-widget',
      component: () =>
        import('@elementar/store/widgets/tasks-in-progress-widget/tasks-in-progress-widget.component')
        .then(c => c.TasksInProgressWidgetComponent)
    },
    {
      type: 'todos-widget',
      skeleton: null,
      component: () =>
        import('@elementar/store/widgets/todos-widget/todos-widget.component')
        .then(c => c.TodosWidgetComponent)
    }
  ];
  
  widgets: Widget[] = [];

  private sensorSubscription!: Subscription;

  ngOnInit(): void {
    this.sensorService.connect();

    this.sensorSubscription = this.sensorService.messages$.subscribe((message) => {
      if (message?.switches) {
        this.updateDeviceStats(message.switches);
        console.log('Datos recibidos:', message.switches);
      }
    });

    // Inicializamos los widgets con datos por defecto
    this.updateWidgets();
  }

  ngOnDestroy(): void {
    if (this.sensorSubscription) {
      this.sensorSubscription.unsubscribe();
    }
    this.sensorService.close();
  }

  private updateDeviceStats(switches: any[]): void {
    this.devicesOn = switches.filter(sw => sw.state).length;
    this.devicesOff = switches.length - this.devicesOn;
    this.totalPower = switches.reduce((sum, sw) => sum + (sw.state ? sw.apower : 0), 0);
    this.totalEnergy = switches.reduce((sum, sw) => sum + sw.aenergyTotal, 0);

    console.log('Actualizando datos:', {
      devicesOn: this.devicesOn,
      devicesOff: this.devicesOff,
      totalPower: this.totalPower,
      totalEnergy: this.totalEnergy
    });

    this.updateWidgets();
  }

  private updateWidgets(): void {
    this.widgets = [
      {
        id: 1,
        type: 'total-subscribers-widget',
        columns: 3,
        data: this.totalEnergy,
      },
      {
        id: 2,
        type: 'avg-open-rate-widget',
        columns: 3,
        data: this.totalPower,
      },
      {
        id: 3,
        type: 'avg-click-rate-widget',
        columns: 3,
        data: this.devicesOn,
      },
      {
        id: 4,
        type: 'unique-visitors-widget',
        columns: 3,
        data: this.devicesOff
      },
      {
        id: 5,
        type: 'total-tasks-widget',
        columns: 3,
        data: this.totalPower,
        skeleton: { minHeight: '260px' }
      },
      {
        id: 6,
        type: 'total-projects-widget',
        columns: 3,
        data: this.totalPower,
        skeleton: { minHeight: '260px' }
      },
      {
        id: 7,
        type: 'events-widget',
        columns: 3,
        data: 12.90,
        skeleton: { minHeight: '260px' }
      },
      {
        id: 8,
        type: 'team-widget',
        columns: 3,
        data: 12.90,
        skeleton: { minHeight: '260px' }
      },
      {
        id: 9,
        type: 'tasks-in-progress-widget',
        columns: 6,
        data: 12.90,
        skeleton: { minHeight: '400px' }
      },
      {
        id: 10,
        type: 'todos-widget',
        columns: 6,
        data: 12.90,
        skeleton: { minHeight: '400px' }
      }
    ];

    this.cdr.detectChanges(); // Forzar actualización de la vista
  }
}
