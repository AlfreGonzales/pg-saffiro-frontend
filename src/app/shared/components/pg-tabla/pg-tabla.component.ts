import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SweetAlertOptions } from 'sweetalert2';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pg-tabla',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, TableModule, InputTextModule, TagModule, ChipModule, SweetAlert2Module],
  templateUrl: './pg-tabla.component.html',
  styleUrl: './pg-tabla.component.scss'
})
export class PgTablaComponent {
  @Input() data: any[] = [];
  @Input() cols: any[] = [];
  @Input() globalFilterFields: string[] = [];
  @Input() title: string = '';

  @Input() subTable: any = {};

  //NOTA: TEMP
  @Input() paginator: boolean = true;

  alertaBorrar: SweetAlertOptions = {
    title: "Desea completar la operación?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar"
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value.trim(), 'contains');
  }

  getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  emptySubTable() {
    return Object.keys(this.subTable).length === 0;
  }

  //TEMP
  generarPDF() {
    const data = document.getElementById('content');

    html2canvas(data!).then(canvas => {
        const imgWidth = 297;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF.jsPDF('l', 'mm', 'a4');
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('reporte-tabla.pdf');
    });
  }
}
