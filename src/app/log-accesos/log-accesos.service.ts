import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appSettings } from '../settings/appSettings';
import { LogAcceso } from '../auth/login/interfaces/log-acceso';

@Injectable({
  providedIn: 'root'
})
export class LogAccesosService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appSettings.apiUrl}auth/log-acceso`;

  constructor() { }

  getIpInfo() {
    return this.http.get('https://ipinfo.io/json?token=9b9eaf13a57728');
  }

  createLogAcceso(logAcceso: LogAcceso) {
    return this.http.post(`${this.baseUrl}`, logAcceso);
  }

  findAllLogAccesos() {
    return this.http.get<LogAcceso[]>(this.baseUrl);
  }
}
