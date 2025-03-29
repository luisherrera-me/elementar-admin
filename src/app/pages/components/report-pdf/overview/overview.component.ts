import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceService, ReportData } from '../../../../core/services/device/device.service';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';

import jsPDF from 'jspdf';

@Component({
  selector: 'app-overview',
  standalone: true,  // Si es un componente independiente
  imports: [CommonModule],  // Asegura que CommonModule esté importado
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  reportData: ReportData[] = [];  // Datos del reporte
  totalConsumption: string;  // Total consumido

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { startDate: string; endDate: string; ID: number },
    private deviceService: DeviceService
  ) {}

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.deviceService.getReportByRange(this.data.ID, this.data.startDate, this.data.endDate)
      .subscribe((data) => {
        this.reportData = data;
        this.totalConsumption = (data.reduce((sum, item) => sum + item.todaysEnergyKwh, 0) / 1000).toFixed(2);

      }, error => {
        console.error('Error al obtener el reporte:', error);
      });
  }

  exportPDF() {
    const data = document.getElementById('invoice');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('reporte_consumo.pdf');
      });
    }
  }
}


