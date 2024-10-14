import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appSettings } from '../settings/appSettings';
import { Equipo } from './interfaces/equipo';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appSettings.apiUrl}equipos/`;

  constructor() { }

  create(equipo: Equipo) {
    return this.http.post(this.baseUrl, equipo);
  }

  findAll() {
    return this.http.get<Equipo[]>(this.baseUrl);
  }

  update(id: number, equipo: Equipo) {
    return this.http.patch(`${this.baseUrl}${id}`, equipo);
  }

  inactivate(id: number) {
    return this.http.delete(`${this.baseUrl}${id}`);
  }
}
