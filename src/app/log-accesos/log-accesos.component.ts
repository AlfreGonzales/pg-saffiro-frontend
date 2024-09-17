import { Component, LOCALE_ID, OnInit } from '@angular/core';

import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

import { CommonModule } from '@angular/common';
import { LogAcceso } from '../auth/login/interfaces/log-acceso';
import { LogAccesosService } from './log-accesos.service';

@Component({
  selector: 'app-log-accesos',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RippleModule, ToastModule, ToolbarModule, RatingModule, TagModule, InputTextModule],
  templateUrl: './log-accesos.component.html',
  styleUrl: './log-accesos.component.scss'
})
export class LogAccesosComponent implements OnInit {
  listaLogAccesos!: LogAcceso[];
  cols!: any[];

  constructor(private logAccesosService: LogAccesosService) { }

  ngOnInit(): void {
    this.obtenerLista();
  }

  obtenerLista() {
    this.logAccesosService.findAllLogAccesos().subscribe({
      next: (data) => {
        this.listaLogAccesos = data;
      },
      error: (error) => console.error('Error al listar los log de accesos', error),
    });

    this.cols = [
      { field: 'ip', header: 'Ip' },
      { field: 'usuario.nombres', header: 'Nombre de usuario' },
      { field: 'usuario.email', header: 'Email de usuario' },
      { field: 'accion', header: 'Acción' },
      { field: 'ciudad', header: 'Ciudad' },
      { field: 'pais', header: 'País' },
      { field: 'detalle', header: 'Detalle' },
      { field: 'created_at', header: 'Fecha de registro' }
    ];
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
