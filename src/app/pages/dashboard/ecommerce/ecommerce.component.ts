import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { OverviewComponent } from '../../components/report-pdf/overview/overview.component';
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
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from '../../../core/services/device/device.service';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-ecommerce',
  imports: [
    FormsModule,
    MatButtonModule,
    GoogleMapsModule,
    MatCard,
    MatIcon,
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
export class EcommerceComponent {
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
      type: 'todos-widget',
      skeleton: null,
      component: () =>
        import('@elementar/store/widgets/sensor-status-history-widget/todos-widget.component')
        .then(c => c.TodosWidgetComponent)
    }
  ];

  id!: number;
  center = {lat: 0, lng: 0};
  zoom = 17;
  markerPosition = {lat: 0, lng: 0};
  device: any = {}
  startDate!: Date;
  endDate!: Date;
  
  widgets: Widget[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = Number(params['id']) || 0;
  
      if (this.id) {
        console
        this.deviceService.getDeviceById(this.id).subscribe((data) => {
          this.device = data || {};
  
          if (this.device.latitude && this.device.longitude) {
            this.center = { lat: this.device.latitude, lng: this.device.longitude };
            this.markerPosition = { lat: this.device.latitude, lng: this.device.longitude };
          }
          this.updateWidgets();
        });
      } else {
        this.router.navigate(['/pages/dashboard/ecommerce']);
      }
    });
  }

  private updateWidgets(): void {
    this.widgets = [
      {
        id: 7,
        data: this.device.aenergyTotal,
        type: 'exchange-widget',
        columns: 3,
        skeleton: {
          minHeight: '300px'
        }
      },
      {
        id: 8,
        data: 0,
        type: 'customer-satisfaction-widget',
        columns: 4,
        skeleton: {
          minHeight: '300px'
        }
      },
      {
        id: 10,
        type: 'todos-widget',
        columns: 4,
        data: this.id,
        skeleton: { minHeight: '200px' }
      },
      {
        id: 4,
        data: 0,
        type: 'purchases-by-channels-widget',
        columns: 6
      },
      {
        id: 5,
        data: 0,
        type: 'visitor-insights-widget',
        columns: 6
      }
    ];;

  }

  generateReport() {
    if (!this.startDate || !this.endDate) {
      console.warn('⚠️ Debes seleccionar un rango de fechas.');
      return;
    }
  
    const formattedStartDate = this.startDate.toISOString().split('T')[0];
    const formattedEndDate = this.endDate.toISOString().split('T')[0];
  
    this.dialog.open(OverviewComponent, {
      width: '1000px',
      data: { startDate: formattedStartDate, endDate: formattedEndDate, ID: this.id }
    });
  }
}
