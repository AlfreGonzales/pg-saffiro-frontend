import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProyectosService } from '@proyectos/proyectos.service';
import { sharedImports } from '@shared/shared-imports';
import { SprintsService } from '@tareas/sprints.service';
import { UsuariosService } from '@usuarios/usuarios.service';
import { CalendarModule } from 'primeng/calendar';
import { ReportesService } from './reportes.service';
import { PgTablaComponent } from '@shared/components/pg-tabla/pg-tabla.component';
import { TipoTarea } from '@tareas/constantes/tipo-tarea';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [...sharedImports, CalendarModule, PgTablaComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent implements OnInit{
  listaUsuariosDropdown!: any[];
  listaProyectosDropdown!: any[];
  listaSprintsDropdown!: any[];
  listaReporte!: any[];
  cols!: any;
  tableConfig: any = {};
  loading: boolean = false;

  formFiltros = this.fb.group({
    idUsuario: [null],
    idProyecto: [null],
    idSprint: [null],
    fecha_inicio_fin: ['', [Validators.required]],
  });

  tipoTarea = TipoTarea;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private proyectosService: ProyectosService,
    private sprintsService: SprintsService,
    private reportesService: ReportesService
  ) {}

  ngOnInit(): void {
    this.obtenerFiltros();
  }

  obtenerFiltros() {
    this.usuariosService.findAll().subscribe({
      next: (data) => {
        this.listaUsuariosDropdown = data.map(iUsaurio => (
          {
            code: iUsaurio.id,
            name: `${iUsaurio.ci} - ${iUsaurio.nombres} ${iUsaurio.apellidos}`
          }
        ));
      },
      error: (error) => console.error('Error al listar los usuarios', error)
    });

    this.proyectosService.findAll().subscribe({
      next: (data) => {
        this.listaProyectosDropdown = data.map(iProyecto => (
          {
            code: iProyecto.id,
            name: iProyecto.nombre
          }
        ));
      },
      error: (error) => console.error('Error al listar los proyectos', error)
    });
  }

  onDropdownChange() {
    let valorIdProyecto: any = this.formFiltros.value.idProyecto;
    if (!valorIdProyecto) {
      valorIdProyecto = 0;
      this.formFiltros.patchValue({
        idSprint: null
      });
    }
    this.sprintsService.findAll(valorIdProyecto as any).subscribe({
      next: (data) => {
        this.listaSprintsDropdown = data.map(iSprint => (
          {
            code: iSprint.id,
            name: iSprint.nombre
          }
        ));
      },
      error: (error) => console.error('Error al listar los sprints', error)
    });
  }

  generarReporte() {
    if (this.formFiltros.invalid) {
      this.formFiltros.markAllAsTouched();
      return;
    }
    const fechaInicioFin: any = this.formFiltros.value.fecha_inicio_fin;
    if (!fechaInicioFin[1]) {
      this.formFiltros.patchValue({
        fecha_inicio_fin: ''
      });
      return;
    }
    const [fechaInicio, fechaFin] = fechaInicioFin;
    const objReporte: any = {
      idUsuario: this.formFiltros.value.idUsuario,
      idProyecto: this.formFiltros.value.idProyecto,
      idSprint: this.formFiltros.value.idSprint,
      fechaInicio,
      fechaFin
    };

    this.reportesService.generarReporte(objReporte).subscribe({
      next: (data: any) => {
        this.listaReporte = data;
        this.configurarTabla();
        this.loading = true;
      },
      error: (error) => console.error('Error al generar el reporte', error)
    });
  }

  configurarTabla() {
    this.cols = [
      { field: 'tarea.nombre', header: 'Tarea' },
      { field: 'tarea.tipo', header: 'Tipo', type: 'personalizado', accion: (data: any) => this.tipoTarea.get(data) },
      { field: 'tarea.prioridad', header: 'Prioridad' },
      { field: 'usuario_dev.nombres', header: 'Desarrollador' },
      { field: 'usuario_qa.nombres', header: 'QA' },
      { field: 'estado', header: 'Estado' },
      { field: 'tarea.created_at', header: 'Fecha de registro', type: 'date' },
      { field: 'tarea.proyecto.nombre', header: 'Proyecto' },
      { field: 'tarea.proyecto.estado', header: 'Estado de proyecto' },
      { field: 'sprint.nombre', header: 'Sprint' },
      { field: 'tarea.proyecto.equipo.nombre', header: 'Equipo' },
      { field: 'tarea.proyecto.empresa.nombre', header: 'Empresa' }
    ];
    this.tableConfig = {
      title: 'Reporte generado',
      cols: this.cols,
      data: this.listaReporte,
      globalFilterFields: ['tarea.nombre', 'tarea.proyecto.nombre', 'sprint.nombre', 'tarea.proyecto.equipo.nombre', 'tarea.proyecto.empresa.nombre'],
      paginator: false
    };
  }
}
