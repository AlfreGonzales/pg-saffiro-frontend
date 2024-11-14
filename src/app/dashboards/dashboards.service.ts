import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appSettings } from '../settings/appSettings';

@Injectable({
  providedIn: 'root'
})
export class DashboardsService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appSettings.apiUrl}dashboards/`;

  constructor() { }

  infoRapida() {
    return this.http.get(`${this.baseUrl}info`);
  }

  tareasPorProyectos(idProyecto: number) {
    return this.http.get(`${this.baseUrl}info/${idProyecto}`);
  }
  
  avances() {
    return this.http.get(this.baseUrl);
  }
}
