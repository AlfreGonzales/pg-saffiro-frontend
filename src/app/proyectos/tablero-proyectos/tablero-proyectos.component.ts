import { Component, OnInit, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { sharedImports } from '@shared/shared-imports';
import { Proyecto } from '@proyectos/interfaces/proyecto';
import { ProyectosService } from '@proyectos/proyectos.service';
import { EstadoProyecto } from '@proyectos/enums/estado-proyecto';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import Swal from 'sweetalert2';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tablero-proyectos',
  standalone: true,
  imports: [...sharedImports, CdkDrag, CdkDropList, CdkDropListGroup, ContextMenuModule],
  templateUrl: './tablero-proyectos.component.html',
  styleUrl: './tablero-proyectos.component.scss'
})
export class TableroProyectosComponent implements OnInit {
  estado = EstadoProyecto;

  proyectosPlanificados!: any[];

  proyectosEnCurso!: any[];

  proyectosAcabados!: any[];

  @ViewChild('cm') cm!: ContextMenu;

  proyectoSelecccionado!: Proyecto;

  items = [
    {
      label: 'Cancelar proyecto',
      icon: 'pi pi-times',
      command: async () => {
        const resultado = await Swal.fire({
          title: "Desea cancelar el proyecto?",
          text: "Esta acción es irreversible!",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirmar",
          cancelButtonText: "Cancelar"
        });
        if (resultado.isConfirmed) {
          const proyecto: any = {
            estado: this.estado.CANCELADO
          };
          this.proyectosService.update(this.proyectoSelecccionado.id, proyecto).subscribe({
            next: () => {
              this.proyectosPlanificados = this.proyectosPlanificados.filter(proyecto => proyecto.id !== this.proyectoSelecccionado.id);
              Swal.fire({
                title: "Correcto!",
                text: "Se ha cancelado el proyecto correctamente.",
                icon: "success"
              });
            },
            error: (error) => console.error('Error al cancelar el proyecto', error)
          });
        }
      }
    }
  ];

  constructor(
    private proyectosService: ProyectosService,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.obtenerLista();
  }

  obtenerLista() {
    this.proyectosService.findAll().subscribe({
      next: (data) => {
        this.obtenerListaEstados(data);
      },
      error: (error) => console.error('Error al listar los proyectos', error)
    });
  }

  obtenerListaEstados(listaProyectos: Proyecto[]) {
    this.proyectosPlanificados = listaProyectos.filter(
      (proyecto) => proyecto.estado === this.estado.PLANIFICADO
    );
    this.proyectosEnCurso = listaProyectos.filter(
      (proyecto) => proyecto.estado === this.estado.EN_CURSO
    );
    this.proyectosAcabados = listaProyectos.filter(
      (proyecto) => proyecto.estado === this.estado.ACABADO
    );
  }

  drop(event: CdkDragDrop<Proyecto[]>, columnaEstado: EstadoProyecto) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const proyecto: any = {
        estado: columnaEstado
      };
      this.proyectosService.update(event.item.data.id, proyecto).subscribe({
        error: (error) => console.error('Error al cambiar el estado del proyecto', error)
      });
    }
  }

  onContextMenu(event: any, proyecto: Proyecto) {
    this.proyectoSelecccionado = proyecto;
    this.cm.show(event);
  }

  irTableroTareas(idProyecto: number) {
    this.localStorageService.setIdProyecto(idProyecto);
    this.router.navigate(['tareas/tablero']);
  }
}
