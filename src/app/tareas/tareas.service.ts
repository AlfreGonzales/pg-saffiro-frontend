import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appSettings } from '../settings/appSettings';
import { Tarea } from './interfaces/tarea';

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appSettings.apiUrl}tareas/`;

  constructor() { }

  create(tareaCompleta: any) {
    return this.http.post(this.baseUrl, tareaCompleta);
  }

  findAll(idProyecto: number) {
    const params = new HttpParams().set('idProyecto', idProyecto);
    return this.http.get<Tarea[]>(this.baseUrl, { params });
  }

  update(idSprintTarea: number, idTarea: number, tarea: any) {
    return this.http.patch(`${this.baseUrl}${idSprintTarea}/${idTarea}`, tarea);
  }
}
