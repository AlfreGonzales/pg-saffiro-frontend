import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { sharedImports } from '@shared/shared-imports';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { ColoresEstadoTarea, EstadoTarea } from '../constantes/estado-tarea';
import { Tarea } from '../interfaces/tarea';
import Swal from 'sweetalert2';
import { TareasService } from '../tareas.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '@usuarios/usuarios.service';
import { TipoTarea } from '../constantes/tipo-tarea';
import { EditorModule } from 'primeng/editor';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Router } from '@angular/router';
import { ProyectosService } from '@proyectos/proyectos.service';
import { SprintsService } from '../sprints.service';
import { MessagesModule } from 'primeng/messages';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-tablero-tareas',
  standalone: true,
  imports: [...sharedImports, CdkDrag, CdkDropList, CdkDropListGroup, ContextMenuModule, EditorModule, MessagesModule, CalendarModule],
  templateUrl: './tablero-tareas.component.html',
  styleUrl: './tablero-tareas.component.scss'
})
export class TableroTareasComponent implements OnInit {
  estado = EstadoTarea;

  coloresEstado: any = ColoresEstadoTarea;

  tipo = TipoTarea;

  tareasNuevas!: Tarea[];

  tareasAprobadas!: Tarea[];

  tareasEnCurso!: Tarea[];

  tareasCalidad!: Tarea[];

  tareasCertificacion!: Tarea[];

  tareasAcabadas!: Tarea[];

  @ViewChild('cm') cm!: ContextMenu;

  items!: any[];

  tareaDialog: boolean = false;

  editting: boolean = false;

  idSprintTarea!: number;

  idTarea!: number;

  tareaActual!: Tarea;

  formTarea = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    tipo: ['', [Validators.required]],
    tiempo_estimado: [''],
    peso: [''],
    bugs_permitidos: [''],
    id_tarea: [''],
    id_usuario_dev: [''],
    id_usuario_qa: ['']
  });

  listaTiposDropdown: any[] = [...TipoTarea].map(([code, name]) => ({ code, name }));

  listaTareasDropdown!: any[];

  listaUsuariosDropdown!: any[];

  idProyecto!: number;

  proyecto: any = {};

  listaSprintsDropdown: any[] = [];

  message: any[] = [];

  sprintDialog: boolean = false;

  formSprint = this.fb.group({
    nombre: ['', [Validators.required]],
    fecha_inicio_fin: ['', [Validators.required]],
    objetivo: [''],
    id_usuario: ['']
  });

  idSprint = new FormControl(0);

  constructor(
    private tareasService: TareasService,
    private usuariosService: UsuariosService,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private proyectosService: ProyectosService,
    private sprintsService: SprintsService
  ) {
    this.idProyecto = this.localStorageService.getIdProyecto();
  }

  ngOnInit(): void {
    this.obtenerLista();
    this.obtenerProyecto();
    this.obtenerListaSprints();
    this.obtenerListaUsuarios();
  }

  obtenerLista() {
    this.tareasService.findAll(this.idProyecto).subscribe({
      next: (data) => {
        this.obtenerListaEstados(data);
        this.obtenerListaTareas(data);
      },
      error: (error) => console.error('Error al listar las tareas', error)
    });
  }

  obtenerListaEstados(listaTareas: Tarea[]) {
    this.tareasNuevas = listaTareas.filter(
      (tarea) => tarea.estado === this.estado.NUEVA
    );
    this.tareasAprobadas = listaTareas.filter(
      (tarea) => tarea.estado === this.estado.APROBADA
    );
    this.tareasEnCurso = listaTareas.filter(
      (tarea) => tarea.estado === this.estado.EN_CURSO
    );
    this.tareasCalidad = listaTareas.filter(
      (tarea) => tarea.estado === this.estado.CALIDAD
    );
    this.tareasCertificacion = listaTareas.filter(
      (tarea) => tarea.estado === this.estado.CERTIFICACION
    );
    this.tareasAcabadas = listaTareas.filter(
      (tarea) => tarea.estado === this.estado.ACABADA
    );
  }

  obtenerListaTareas(listaTareas: Tarea[]) {
    this.listaTareasDropdown = listaTareas
    .filter((tarea) => tarea.estado !== this.estado.POSTERGADA && tarea.estado !== this.estado.CANCELADA)
    .map((tarea) => {
      return {
        code: tarea.tarea.id,
        name: tarea.tarea.nombre
      };
    });
  }

  obtenerProyecto() {
    this.proyectosService.findOne(this.idProyecto).subscribe({
      next: (data) => {
        this.proyecto = data;
      },
      error: (error) => console.error('Error al listar proyecto', error)
    });
  }

  obtenerListaSprints() {
    this.message = [{ severity: 'warn', summary: 'Sin sprints!', detail: 'Este proyecto no tiene ningún sprint, crea uno para empezar a añadir tareas.' }];

    this.sprintsService.findAll(this.idProyecto).subscribe({
      next: (data) => {
        this.listaSprintsDropdown = data
        .map(iSprint => ({ code: iSprint.id, name: iSprint.nombre}));
        this.idSprint.setValue(data[0]?.id);
      },
      error: (error) => console.error('Error al listar los sprints', error)
    });
  }

  obtenerListaUsuarios() {
    this.usuariosService.findAll().subscribe({
      next: (data) => {
        this.listaUsuariosDropdown = data
        .filter((usuario) => usuario.estado_logico)
        .map((usuario) => {
          return {
            code: usuario.id,
            name: `${usuario.ci} - ${usuario.nombres} ${usuario.apellidos}`
          };
        });
      },
      error: (error) => console.error('Error al listar los usuarios', error)
    });
  }

  drop(event: CdkDragDrop<Tarea[]>, columnaEstado: EstadoTarea) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const tarea: any = {
        updateSprintTareaDto: {
          estado: columnaEstado
        }
      };
      this.tareasService.update(event.item.data.id, 0, tarea).subscribe({
        error: (error) => console.error('Error al cambiar el estado de la tarea', error)
      });
    }
  }

  onContextMenu(event: any, tarea: Tarea) {
    this.obtenerItemsMenu(tarea);
    this.cm.show(event);
  }

  obtenerItemsMenu(tarea: Tarea) {
    this.items = [
      {
        label: 'Editar tarea',
        icon: 'pi pi-pencil',
        command: async () => {
          this.abrirModalEditar(tarea);
        }
      },
      {
        label: 'Postergar tarea',
        icon: 'pi pi-question',
        command: async () => {
          this.cambiaEstado(this.estado.POSTERGADA, tarea);
        },
        visible: this.tareasNuevas.includes(tarea)
      },
      {
        label: 'Cancelar tarea',
        icon: 'pi pi-times',
        command: async () => {
          this.cambiaEstado(this.estado.CANCELADA, tarea);
        },
        visible: this.tareasNuevas.includes(tarea)
      }
    ];
  }

  async cambiaEstado(estado: EstadoTarea, tarea: Tarea) {
    const resultado = await Swal.fire({
      title: "Desea confirmar la operación?",
      text: "Esta acción es irreversible!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    });
    if (resultado.isConfirmed) {
      const tareaDto: any = {
        updateSprintTareaDto: {
          estado: estado
        }
      };
      this.tareasService.update(tarea.id, 0, tareaDto).subscribe({
        next: () => {
          this.tareasNuevas = this.tareasNuevas.filter(item => item.id !== tarea.id);
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha realizado correctamente.",
            icon: "success"
          });
        },
        error: (error) => console.error('Error al postergar/cancelar la tarea', error)
      });
    }
  }

  abrirModalCrear() {
    this.formTarea.reset();
    this.editting = false;
    this.tareaDialog = true;
  }

  abrirModalEditar(tarea: Tarea) {
    this.tareaActual = tarea;
    this.idSprintTarea = tarea.id;
    this.idTarea = tarea.id_tarea;
    this.editting = true;
    this.tareaDialog = true;
  }

  inicializaModal() {
    if (this.editting) {
      this.formTarea.patchValue({
        nombre: this.tareaActual.tarea.nombre,
        descripcion: this.tareaActual.tarea.descripcion,
        tipo: this.listaTiposDropdown.find((tipo) => tipo.code === this.tareaActual.tarea.tipo),
        tiempo_estimado: this.tareaActual.tarea.tiempo_estimado as any,
        peso: this.tareaActual.tarea.peso as any,
        bugs_permitidos: this.tareaActual.tarea.bugs_permitidos as any,
        id_tarea: this.listaTareasDropdown.find(item => item.code === this.tareaActual.tarea.id_tarea),
        id_usuario_dev: this.listaUsuariosDropdown.find((usuario) => usuario.code === this.tareaActual.id_usuario_dev),
        id_usuario_qa: this.listaUsuariosDropdown.find((usuario) => usuario.code === this.tareaActual.id_usuario_qa)
      });
    }
    else
      this.formTarea.reset();
  }

  crearTarea() {
    if (this.formTarea.invalid) {
      this.formTarea.markAllAsTouched();
      return;
    }
    const tipo: any = this.formTarea.value.tipo;
    const tareaDep: any = this.formTarea.value.id_tarea;
    const usuarioDev: any = this.formTarea.value.id_usuario_dev;
    const usuarioQA: any = this.formTarea.value.id_usuario_qa;
    if (!this.editting) {
      const tarea: any = {
        createTareaDto: {
          nombre: this.formTarea.value.nombre,
          descripcion: this.formTarea.value.descripcion,
          tipo: tipo.code,
          tiempo_estimado: this.formTarea.value.tiempo_estimado,
          peso: this.formTarea.value.peso,
          bugs_permitidos: this.formTarea.value.bugs_permitidos,
          id_tarea: tareaDep?.code || null,
          id_proyecto: this.idProyecto
        },
        createSprintTareaDto: {
          id_usuario_dev: usuarioDev?.code || null,
          id_usuario_qa: usuarioQA?.code || null
        }
      };
      this.tareasService.create(tarea).subscribe({
        next: () => {
          this.tareaDialog = false;
          this.obtenerLista();
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha sido completada.",
            icon: "success"
          });
        },
        error: (error) => console.error('Error al crear la tarea', error),
      });
    } else {
      const tarea: any = {
        updateTareaDto: {
          nombre: this.formTarea.value.nombre,
          descripcion: this.formTarea.value.descripcion,
          tipo: tipo.code,
          tiempo_estimado: this.formTarea.value.tiempo_estimado,
          peso: this.formTarea.value.peso,
          bugs_permitidos: this.formTarea.value.bugs_permitidos,
          id_tarea: tareaDep?.code || null
        },
        updateSprintTareaDto: {
          id_usuario_dev: usuarioDev?.code || null,
          id_usuario_qa: usuarioQA?.code || null
        }
      };
      this.tareasService.update(this.idSprintTarea, this.idTarea,  tarea).subscribe({
        next: () => {
          this.tareaDialog = false;
          this.obtenerLista();
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha sido completada.",
            icon: "success"
          });
        },
        error: (error) => console.error('Error al editar la tarea', error),
      });
    }
  }

  cerrarModal() {
    this.tareaDialog = false;
  }

  abrirModalCrearSprint() {
    this.formSprint.reset();
    this.sprintDialog = true;
  }

  onDropdownChange() {
    console.log('sprint', this.idSprint.value);
  }

  crearSprint() {
    if (this.formSprint.invalid) {
      this.formSprint.markAllAsTouched();
      return;
    }
    const fechaInicioFin: any = this.formSprint.value.fecha_inicio_fin;
    if (!fechaInicioFin[1]) {
      this.formSprint.patchValue({
        fecha_inicio_fin: ''
      });
      return;
    }
    const [fechaInicio, fechaFin] = this.formSprint.value.fecha_inicio_fin ?? [];
    const sprint: any = {
      nombre: this.formSprint.value.nombre,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      objetivo: this.formSprint.value.objetivo,
      id_usuario: this.formSprint.value.id_usuario,
      id_proyecto: this.idProyecto
    }
    this.sprintsService.create(sprint).subscribe({
      next: () => {
        this.sprintDialog = false;
        this.obtenerListaSprints();
        Swal.fire({
          title: "Correcto!",
          text: "La operación se ha sido completada.",
          icon: "success"
        });
      },
      error: (error) => console.error('Error al crear el sprint', error)
    });
  }

  cerrarModalSprint() {
    this.sprintDialog = false;
  }
}
