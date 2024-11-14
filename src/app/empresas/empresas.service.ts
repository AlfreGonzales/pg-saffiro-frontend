import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appSettings } from '../settings/appSettings';
import { Empresa } from './interfaces/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appSettings.apiUrl}empresas/`;

  constructor() { }

  create(empresa: Empresa) {
    return this.http.post(this.baseUrl, empresa);
  }

  findAll() {
    return this.http.get<Empresa[]>(this.baseUrl);
  }

  update(id: number, empresa: Empresa) {
    return this.http.patch(`${this.baseUrl}${id}`, empresa);
  }

  inactivate(id: number) {
    return this.http.delete(`${this.baseUrl}${id}`);
  }
}
