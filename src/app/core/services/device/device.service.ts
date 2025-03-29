import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SaveDevice {
  sensorName: string;
  mac: string;
  model: string;
  switchOutput: boolean;
  city: number;
  department: number;
}

export interface ReportData {
  id: number;
  date: string;
  totalEnergyKwh: number;
  todaysEnergyKwh: number;
  averagePowerW: number;
  peakPowerW: number;
}
export interface SaveDevice {
  sensorName: string;
  mac: string;
  model: string;
  switchOutput: boolean;
  city: number;
  department: number;
}

export interface SwitchHistory {
  id: number;
  switchOutput: boolean;
  changedAt: string;
}

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
  switchOutput: boolean;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  state: boolean;  // Estado del switch (encendido/apagado)
  apower: number;  // Potencia consumida
  energyTotal: number; // Energía total consumida
  online?: boolean; // Estado de conexión
}


@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'https://device-manager-production.up.railway.app/api/devices';
  private historyDeviceUrl = 'https://device-manager-production.up.railway.app/api/switch-history/device';
  private reportsUrl = 'https://device-manager-production.up.railway.app/api/reports';

  constructor(private http: HttpClient) {}

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl);
  }

  getDeviceById(id: number): Observable<Device> {
    return this.http.get<Device>(`${this.apiUrl}/${id}`);
  }

  registerDevice(device:SaveDevice): Observable<Device> {
    return this.http.post<Device>(this.apiUrl, device);
  }

  getHistoryByDeviceId(id: number): Observable<SwitchHistory[]> {
    return this.http.get<SwitchHistory[]>(`${this.historyDeviceUrl}/${id}`);
  }

  getReportByRange(reportId: number, startDate: string, endDate: string): Observable<ReportData[]> {
    const url = `${this.reportsUrl}/${reportId}/range`;
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<ReportData[]>(url, { params });
  }
  
}