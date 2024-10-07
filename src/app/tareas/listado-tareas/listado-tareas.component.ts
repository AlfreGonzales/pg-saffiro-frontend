import { Component, OnInit } from '@angular/core';
import { sharedImports } from '@shared/shared-imports';
import { TareasService } from '../tareas.service';
import { ColoresEstadoTarea, EstadoTarea } from '../constantes/estado-tarea';
import { Table } from 'primeng/table';
import { TipoTarea } from '../constantes/tipo-tarea';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-listado-tareas',
  standalone: true,
  imports: [...sharedImports, ChipModule],
  templateUrl: './listado-tareas.component.html',
  styleUrl: './listado-tareas.component.scss'
})
export class ListadoTareasComponent implements OnInit {
  estado = EstadoTarea;

  coloresEstado: any = ColoresEstadoTarea;

  tipo: any = TipoTarea;

  listaTareas!: any[];

  cols!: any[];

  rowsPerPageOptions = [5, 10, 20];

  constructor(private tareasService: TareasService) { }

  ngOnInit(): void {
    this.obtenerLista();
  }

  obtenerLista() {
    this.tareasService.findAll().subscribe({
      next: (data) => {
        this.listaTareas = data;
      },
      error: (error) => console.error('Error al listar las tareas', error)
    });
    this.cols = [
      { field: 'tarea.id', header: 'Código' },
      { field: 'tarea.nombre', header: 'Nombre' },
      { field: 'tarea.tipo', header: 'Tipo de tarea' },
      { field: 'tarea.tiempo_estimado', header: 'Tiempo estimado' },
      { field: 'tarea.peso', header: 'Peso' },
      { field: 'tarea.bugs_permitidos', header: 'Bugs permitidos' },
      { field: 'tarea.prioridad', header: 'Prioridad' },
      { field: 'tarea.tarea.nombre', header: 'Depende de' },
      { field: 'usuario_dev.nombres', header: 'Desarrollador' },
      { field: 'usuario_qa.nombres', header: 'Analista de control y calidad' },
      { field: 'estado', header: 'Estado' },
      { field: 'tarea.created_at', header: 'Fecha de registro' }
    ];
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
