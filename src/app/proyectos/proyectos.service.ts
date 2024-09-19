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

  findAll() {
    return this.http.get<Proyecto[]>(this.baseUrl);
  }

  update(id: number, proyecto: Proyecto) {
    return this.http.patch(`${this.baseUrl}${id}`, proyecto);
  }

  /* remove(id: number) {
    return this.http.delete(`${this.baseUrl}${id}`);
  } */
}
