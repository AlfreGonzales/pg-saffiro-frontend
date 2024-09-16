import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Login } from './login/interfaces/login';
import { appSettings } from '../settings/appSettings';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appSettings.apiUrl}auth/`;

  constructor() { }

  login(login: Login) {
    return this.http.post(`${this.baseUrl}login`, login);
  }

  authInfo() {
    return this.http.get(`${this.baseUrl}auth-info`);
  }

  validarToken(token: string) {
    return this.http.get(`${this.baseUrl}validar-token/${token}`);
  }
}
