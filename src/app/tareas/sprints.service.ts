import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appSettings } from '../settings/appSettings';
import { Sprint } from './interfaces/sprint';

@Injectable({
  providedIn: 'root'
})
export class SprintsService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appSettings.apiUrl}sprints/`;

  constructor() { }

  create(sprint: Sprint) {
    return this.http.post(this.baseUrl, sprint);
  }

  findAll(idProyecto: number) {
    return this.http.get<Sprint[]>(`${this.baseUrl}${idProyecto}`);
  }

  update(id: number, sprint: Sprint) {
    return this.http.patch(`${this.baseUrl}${id}`, sprint);
  }
}
