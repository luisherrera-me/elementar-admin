import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private socket!: WebSocket;
  private readonly url = 'wss://device-manager-production.up.railway.app/ws';

  private messageSubject = new Subject<any>(); // Subject para emitir mensajes en tiempo real
  messages$ = this.messageSubject.asObservable(); // Observable para que los componentes se suscriban

  constructor() {}

  // Establecer conexión WebSocket
  connect(): void {
    this.socket = new WebSocket(this.url);

    // Evento de conexión abierta
    this.socket.onopen = () => {
      console.log('Conexión establecida con WebSocket');
      this.socket.send(JSON.stringify({ subscribe: true })); // Suscribirse a los datos del servidor
    };

    // Evento de mensaje recibido
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Mensaje recibido:', message);
      
      // Emitir mensaje recibido sin almacenarlo
      this.messageSubject.next(message);
    };

    // Evento de error
    this.socket.onerror = (error) => {
      console.error('Error en la conexión WebSocket:', error);
    };

    // Evento de cierre de la conexión
    this.socket.onclose = (event) => {
      console.log('Conexión WebSocket cerrada', event);
    };
  }

  // Enviar mensaje al servidor
  sendMessage(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket no está abierto');
    }
  }

  // Cerrar la conexión WebSocket
  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
