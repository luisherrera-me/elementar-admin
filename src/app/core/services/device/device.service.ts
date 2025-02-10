import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SaveDevice {
  sensorName: string;
  mac: string;
  model: string;
  switchOutput: boolean;
  city: number;
  department: number;
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
  private apiUrl = 'http://192.168.1.57:8082/api/devices';

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


}