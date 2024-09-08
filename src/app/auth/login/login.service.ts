import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Login } from './interfaces/login';
import { appSettings } from '../../settings/appSettings';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appSettings.apiUrl}auth/`;

  constructor() { }

  login(login: Login) {
    return this.http.post(this.baseUrl, login);
  }
}
