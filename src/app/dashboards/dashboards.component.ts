import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '@proyectos/proyectos.service';
import { sharedImports } from '@shared/shared-imports';
import { ChartModule } from 'primeng/chart';
import { DashboardsService } from './dashboards.service';
import { FormControl } from '@angular/forms';
import { ColoresEstadoTarea } from '@tareas/constantes/estado-tarea';
import { TreeTableModule } from 'primeng/treetable';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-dashboards',
  standalone: true,
  imports: [...sharedImports, ChartModule, TreeTableModule, ProgressBarModule],
  templateUrl: './dashboards.component.html',
  styleUrl: './dashboards.component.scss'
})
export class DashboardsComponent implements OnInit {
  infoRapida: any = {};

  listaProyectosDropdown!: any[];
  idProyecto = new FormControl(0);
  dataPie: any;

  avances!: any[];

  constructor(
    private proyectosService: ProyectosService,
    private dashboardsService: DashboardsService
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos() {
    this.dashboardsService.infoRapida().subscribe({
      next: data => {
        this.infoRapida = data;
      },
      error: (error) => console.error('Error al listar los avances', error)
    });

    this.proyectosService.findAll(0).subscribe({
      next: (data) => {
        this.listaProyectosDropdown = data.map(iProyecto => (
          {
            code: iProyecto.id,
            name: iProyecto.nombre
          }
        ));
        this.idProyecto.setValue(this.listaProyectosDropdown[0].code);
        this.onDropdownChange();
      },
      error: (error) => console.error('Error al listar los proyectos', error)
    });

    this.dashboardsService.avances().subscribe({
      next: (data: any) => {
        this.avances = data;
      },
      error: (error) => console.error('Error al listar los avances', error)
    });
  }

  onDropdownChange() {
    const documentStyle = getComputedStyle(document.documentElement);
    this.dashboardsService.tareasPorProyectos(this.idProyecto.value as any).subscribe({
      next: (data: any) => {
        this.dataPie = {
          labels: data.map((iTarea: any) => iTarea.estado),
          datasets: [
            {
              data: data.map((iTarea: any) => iTarea._count.id),
              backgroundColor: data.map((iTarea: any) => documentStyle.getPropertyValue(ColoresEstadoTarea.get(iTarea.estado)![1].slice(4, -1))),
              hoverOffset: 50
            }
          ]
        }
      },
      error: (error) => console.error('Error al listar la cantidad de tareas por proyectos', error)
    });
  }
}
