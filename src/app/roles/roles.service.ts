import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Rol } from './models/rol';
import { appSettings } from '../settings/appSettings';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appSettings.apiUrl}roles/`;

  constructor() { }

  create(rol: Rol) {
    return this.http.post(this.baseUrl, rol);
  }

  findAll() {
    return this.http.get<Rol[]>(this.baseUrl);
  }

  update(id: number, rol: Rol) {
    return this.http.patch(`${this.baseUrl}${id}`, rol);
  }

  remove(id: number) {
    return this.http.delete(`${this.baseUrl}${id}`);
  }
}
