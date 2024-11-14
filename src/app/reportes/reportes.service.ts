import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appSettings } from '../settings/appSettings';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appSettings.apiUrl}reportes/`;

  constructor() { }

  generarReporte(objReporte: any) {
    return this.http.post(this.baseUrl, objReporte);
  }
}
