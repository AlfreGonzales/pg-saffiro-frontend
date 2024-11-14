import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appSettings } from '../settings/appSettings';
import { Proyecto } from './interfaces/proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appSettings.apiUrl}proyectos/`;

  constructor() { }

  create(proyecto: Proyecto) {
    return this.http.post(this.baseUrl, proyecto);
  }

  findAll(idUsuario: number) {
    return this.http.get<Proyecto[]>(`${this.baseUrl}todos/${idUsuario}`);
  }

  findOne(id: number) {
    return this.http.get<Proyecto>(`${this.baseUrl}unico/${id}`);
  }

  update(id: number, proyecto: Proyecto) {
    return this.http.patch(`${this.baseUrl}${id}`, proyecto);
  }
}
