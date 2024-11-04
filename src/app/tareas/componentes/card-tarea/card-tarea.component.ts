import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { FloorPipe } from '../../floor.pipe';
import { TipoTarea } from '../../constantes/tipo-tarea';
import { ColoresEstadoTarea, EstadoTarea } from '../../constantes/estado-tarea';

@Component({
  selector: 'app-card-tarea',
  standalone: true,
  imports: [CommonModule, CdkDrag, TagModule, FloorPipe],
  templateUrl: './card-tarea.component.html',
  styleUrl: './card-tarea.component.scss'
})
export class CardTareaComponent {
  @Input() tarea: any = {};
  @Input() estado!: EstadoTarea;

  @Output() contextMenu = new EventEmitter<MouseEvent>();

  tipo = TipoTarea;
  coloresEstado: any = ColoresEstadoTarea;

  onContextMenu(event: MouseEvent) {
    this.contextMenu.emit(event);
  }
}
