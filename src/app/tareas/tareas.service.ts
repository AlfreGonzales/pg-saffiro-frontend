import { HttpClient } from '@angular/common/http';
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

  findAll(idProyecto: number, idSprint: number) {
    return this.http.get<Tarea[]>(`${this.baseUrl}${idProyecto}/${idSprint}`);
  }

  update(idSprintTarea: number, idTarea: number, tarea: any) {
    return this.http.patch(`${this.baseUrl}${idSprintTarea}/${idTarea}`, tarea);
  }

  updateCancel(idSprintTarea: number, idTarea: number) {
    return this.http.put(`${this.baseUrl}${idSprintTarea}/${idTarea}`, null);
  }

  predecir(tareas: any) {
    return this.http.post(`http://localhost:5000/predecir`, tareas);
  }
}
