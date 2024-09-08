import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from './models/usuario';
import { appSettings } from '../settings/appSettings';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appSettings.apiUrl}usuarios/`;

  constructor() {}

  create(usuario: Usuario) {
    return this.http.post(this.baseUrl, usuario);
  }

  findAll() {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  findOne(id: number) {
    return this.http.get(`${this.baseUrl}${id}`);
  }

  update(id: number, usuario: Usuario) {
    return this.http.patch(`${this.baseUrl}${id}`, usuario);
  }

  remove(id: number) {
    return this.http.delete(`${this.baseUrl}${id}`);
  }
}
