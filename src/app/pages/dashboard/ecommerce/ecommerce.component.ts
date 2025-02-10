import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatCardModule } from '@angular/material/card';

import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate
} from '@angular/material/datepicker';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import {
  DashboardCardsSkeletonComponent,
  DashboardChartWidgetSkeletonComponent,
  DashboardStatsWidgetSkeletonComponent
} from '@elementar/store/skeleton';
import { DashboardComponent, Widget, WidgetConfig } from '@elementar/components/dashboard';
import { DeviceService } from '../../../core/services/device/device.service';
@Component({
  selector: 'app-ecommerce',
  imports: [
    MatCardModule,
    MatButton,
    GoogleMapsModule,
    MatIcon,
    CommonModule,
    MatDateRangeInput,
    MatEndDate,
    MatStartDate,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatFormField,
    MatSuffix,
    DashboardComponent
  ],
  templateUrl: './ecommerce.component.html',
  styleUrl: './ecommerce.component.scss'
})
export class EcommerceComponent implements OnInit {
  configs: WidgetConfig[] = [
    {
      type: 'total-revenue-widget',
      skeleton: DashboardStatsWidgetSkeletonComponent,
      component: () =>
        import('@elementar/store/widgets/total-revenue-widget/total-revenue-widget.component').then(c => c.TotalRevenueWidgetComponent)
    },
    {
      type: 'site-visitors-widget',
      skeleton: DashboardStatsWidgetSkeletonComponent,
      component: () =>
        import('@elementar/store/widgets/site-visitors-widget/site-visitors-widget.component').then(c => c.SiteVisitorsWidgetComponent)
    },
    {
      type: 'visit-duration-widget',
      skeleton: DashboardStatsWidgetSkeletonComponent,
      component: () =>
        import('@elementar/store/widgets/visit-duration-widget/visit-duration-widget.component').then(c => c.VisitDurationWidgetComponent)
    },
    {
      type: 'purchases-by-channels-widget',
      skeleton: DashboardChartWidgetSkeletonComponent,
      component: () =>
        import('@elementar/store/widgets/purchases-by-channels-widget/purchases-by-channels-widget.component')
          .then(c => c.PurchasesByChannelsWidgetComponent)
    },
    {
      type: 'visitor-insights-widget',
      skeleton: DashboardChartWidgetSkeletonComponent,
      component: () =>
        import('@elementar/store/widgets/visitor-insights-widget/visitor-insights-widget.component')
          .then(c => c.VisitorInsightsWidgetComponent)
    },
    {
      type: 'today-sales-widget',
      skeleton: DashboardCardsSkeletonComponent,
      component: () =>
        import('@elementar/store/widgets/today-sales-widget/today-sales-widget.component')
          .then(c => c.TodaySalesWidgetComponent)
    },
    {
      type: 'exchange-widget',
      component: () =>
        import('@elementar/store/widgets/exchange-widget/exchange-widget.component')
          .then(c => c.ExchangeWidgetComponent)
    },
    {
      type: 'customer-satisfaction-widget',
      component: () =>
        import('@elementar/store/widgets/customer-satisfaction-widget/customer-satisfaction-widget.component')
          .then(c => c.CustomerSatisfactionWidgetComponent)
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

  id!: number;
  center = { lat: 0, lng: 0 }; 
  zoom = 17;
  markerPosition = { lat: 0, lng: 0 };
  device: any = {}; // Asegurar que device siempre tenga una estructura válida
  
  widgets: Widget[] = []; // Define widgets como propiedad de la clase

  constructor(
    private route: ActivatedRoute,
    private deviceService: DeviceService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id')) || 0;

    if (this.id) {
      this.deviceService.getDeviceById(this.id).subscribe((data) => {
        this.device = data || {}; 

        // Asigna coordenadas si existen
        if (this.device.latitude && this.device.longitude) {
          this.center = { lat: this.device.latitude, lng: this.device.longitude };
          this.markerPosition = { lat: this.device.latitude, lng: this.device.longitude };
        }

        // **Asignar datos a los widgets**
        this.widgets = [
          {
            id: 1,
            type: 'total-revenue-widget',
            columns: 3,
            data: this.device.apower ?? 0,  // Asegurar que siempre haya un valor
          },
          {
            id: 2,
            type: 'site-visitors-widget',
            columns: 3,
            data: this.device.energyTotal ?? 0, // Asegurar que siempre haya un valor
          },
          {
            id: 3,
            type: 'visit-duration-widget',
            columns: 2,
            data: 12.90,
          },
          {
            id: 4,
            type: 'purchases-by-channels-widget',
            columns: 6,
            data: 12.90,
          },
          {
            id: 5,
            type: 'visitor-insights-widget',
            columns: 6,
            data: 12.90,
          },
          {
            id: 6,
            type: 'today-sales-widget',
            columns: 12,
            data: 12.90,
          },
          {
            id: 7,
            type: 'exchange-widget',
            columns: 3,
            data: 12.90,
            skeleton: {
              minHeight: '300px'
            }
          },
          {
            id: 8,
            type: 'customer-satisfaction-widget',
            columns: 4,
            data: 12.90,
            skeleton: {
              minHeight: '300px'
            }
          },
          {
            id: 9,
            type: 'tasks-in-progress-widget',
            columns: 6,
            data: 12.90,
            skeleton: { minHeight: '400px' }
          },

        ];
      });
    }
  }
}
