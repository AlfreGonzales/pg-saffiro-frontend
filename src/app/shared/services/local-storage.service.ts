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
}
