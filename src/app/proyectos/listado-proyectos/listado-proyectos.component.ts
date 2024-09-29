import { Component, OnInit } from '@angular/core';
import { sharedImports } from '@shared/shared-imports';
import { Proyecto } from '@proyectos/interfaces/proyecto';
import { ProyectosService } from '@proyectos/proyectos.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Table } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { EstadoProyecto } from '@proyectos/enums/estado-proyecto';

@Component({
  selector: 'app-listado-proyectos',
  standalone: true,
  imports: [...sharedImports, CalendarModule],
  templateUrl: './listado-proyectos.component.html',
  styleUrl: './listado-proyectos.component.scss'
})
export class ListadoProyectosComponent implements OnInit {
  estado = EstadoProyecto;

  listaProyectos!: Proyecto[];
  
  productDialog: boolean = false;

  editting: boolean = false;

  idProyecto!: number;

  cols!: any[];

  rowsPerPageOptions = [5, 10, 20];

  formProyecto = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required]],
    costo_estimado: ['', [Validators.required]],
    fecha_inicio_fin: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private proyectosService: ProyectosService
  ) {}

  ngOnInit(): void {
    this.obtenerLista();
  }

  obtenerLista() {
    this.proyectosService.findAll().subscribe({
      next: (data) => {
        this.listaProyectos = data;
      },
      error: (error) => console.error('Error al listar los proyectos', error),
    });

    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'costo_estimado', header: 'Costo estimado' },
      { field: 'fecha_inicio', header: 'Fecha de inicio' },
      { field: 'fecha_fin', header: 'Fecha de finalización' },
      { field: 'estado', header: 'Estado' },
      { field: 'created_at', header: 'Fecha de registro' }
    ];
  }

  abrirModalCrear() {
    this.formProyecto.reset();
    this.editting = false;
    this.productDialog = true;
  }

  abrirModalEditar(proyecto: Proyecto) {
    this.idProyecto = proyecto.id;
    this.editting = true;
    const fechaInicioFin: any = [new Date(proyecto.fecha_inicio), new Date(proyecto.fecha_fin)];
    this.formProyecto.patchValue({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      costo_estimado: proyecto.costo_estimado.toString(),
      fecha_inicio_fin: fechaInicioFin
    });
    this.productDialog = true;
  }

  crearProyecto() {
    if (this.formProyecto.invalid) {
      this.formProyecto.markAllAsTouched();
      return;
    }
    const fechaInicioFin: any = this.formProyecto.value.fecha_inicio_fin;
    if (!fechaInicioFin[1]) {
      this.formProyecto.patchValue({
        fecha_inicio_fin: ''
      });
      return;
    }
    const [fechaInicio, fechaFin] = this.formProyecto.value.fecha_inicio_fin ?? [];
    if (!this.editting) {
      const proyecto: any = {
        nombre: this.formProyecto.value.nombre,
        descripcion: this.formProyecto.value.descripcion,
        costo_estimado: Number(this.formProyecto.value.costo_estimado),
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      };
      this.proyectosService.create(proyecto).subscribe({
        next: () => {
          this.productDialog = false;
          this.obtenerLista();
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha sido completada.",
            icon: "success"
          });
        },
        error: (error) => console.error('Error al crear el proyecto', error),
      });
    } else {
      const proyecto: any = {
        nombre: this.formProyecto.value.nombre,
        descripcion: this.formProyecto.value.descripcion,
        costo_estimado: Number(this.formProyecto.value.costo_estimado),
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      };
      this.proyectosService.update(this.idProyecto, proyecto).subscribe({
        next: () => {
          this.productDialog = false;
          this.obtenerLista();
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha sido completada.",
            icon: "success"
          });
        },
        error: (error) => console.error('Error al editar el proyecto', error),
      });
    }
  }

  cerrarModal() {
    this.productDialog = false;
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
