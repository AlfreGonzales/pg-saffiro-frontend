import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() { }

  setUsuario(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario() {
    return JSON.parse(localStorage.getItem('usuario')!);
  }

  removeUsuario() {
    localStorage.removeItem('usuario');
  }

  setIdProyecto(idProyecto: any) {
    localStorage.setItem('idProyecto', JSON.stringify(idProyecto));
  }

  getIdProyecto() {
    return JSON.parse(localStorage.getItem('idProyecto')!);
  }

  removeIdProyecto() {
    localStorage.removeItem('idProyecto');
  }
}
