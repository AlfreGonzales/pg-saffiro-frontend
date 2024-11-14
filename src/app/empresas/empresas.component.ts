import { Component, OnInit } from '@angular/core';
import { PgTablaComponent } from '@shared/components/pg-tabla/pg-tabla.component';
import { sharedImports } from '@shared/shared-imports';
import { Empresa } from './interfaces/empresa';
import { FormBuilder, Validators } from '@angular/forms';
import { EmpresasService } from './empresas.service';
import { ChipsModule } from 'primeng/chips';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [...sharedImports, PgTablaComponent, ChipsModule],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss'
})
export class EmpresasComponent implements OnInit {
  listaEmpresas!: Empresa[];

  productDialog: boolean = false;

  editting: boolean = false;

  idEmpresa!: number;

  cols!: any;

  tableConfig: any = {};

  loading: boolean = false;

  formEmpresa = this.fb.group({
    nit: [''],
    nombre: ['', [Validators.required]],
    descripcion: [''],
    direccion: [''],
    contacto: ['' as any, [Validators.required]],
    representante: [''],
  });

  constructor(
    private fb: FormBuilder,
    private empresasService: EmpresasService
  ) {}

  ngOnInit(): void {
    this.obtenerLista();
  }

  obtenerLista() {
    this.empresasService.findAll().subscribe({
      next: (data) => {
        this.listaEmpresas = data;
        this.configurarTabla();
        this.loading = true;
      },
      error: (error) => console.error('Error al listar las empresas', error),
    });
  }

  configurarTabla() {
    this.cols = [
      { field: 'nit', header: 'NIT' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'contacto', header: 'Contacto', type: 'chip' },
      { field: 'representante', header: 'Representante' },
      { field: 'created_at', header: 'Fecha de registro', type: 'date' },
      { field: 'estado_logico', header: 'Estado', type: 'state' },
      { header: '', sort: false, type: 'actions',
        actions: [
          {
            type: 'edit', click: (item: any) => this.abrirModalEditar(item), visible: 'estado_logico'
          },
          {
            type: 'inactivate', click: (item: Empresa) => this.cambiarEstado(item), visible: 'estado_logico'
          },
          {
            type: 'activate', click: (item: Empresa) => this.cambiarEstado(item), visible: 'estado_logico'
          }
        ]
      }
    ];
    this.tableConfig = {
      title: 'Lista de empresas',
      cols: this.cols,
      data: this.listaEmpresas,
      globalFilterFields: ['nit', 'nombre', 'descripcion', 'direccion', 'contacto', 'representante']
    };
  }

  abrirModalCrear() {
    this.formEmpresa.reset();
    this.editting = false;
    this.productDialog = true;
  }

  abrirModalEditar(empresa: Empresa) {
    this.idEmpresa= empresa.id;
    this.editting = true;
    this.formEmpresa.patchValue({
      nit: empresa.nit,
      nombre: empresa.nombre,
      descripcion: empresa.descripcion,
      direccion: empresa.direccion,
      contacto: empresa.contacto.split(', '),
      representante: empresa.representante
    });
    this.productDialog = true;
  }

  crearEmpresa() {
    if (this.formEmpresa.invalid) {
      this.formEmpresa.markAllAsTouched();
      return;
    }
    const empresa: any = {
      nit: this.formEmpresa.value.nit,
      nombre: this.formEmpresa.value.nombre,
      descripcion: this.formEmpresa.value.descripcion,
      direccion: this.formEmpresa.value.direccion,
      contacto: this.formEmpresa.value.contacto.join(', '),
      representante: this.formEmpresa.value.representante,
    };
    if (!this.editting) {
      this.empresasService.create(empresa).subscribe({
        next: () => {
          this.productDialog = false;
          this.obtenerLista();
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha sido completada.",
            icon: "success"
          });
        },
        error: (error) => console.error('Error al crear la empresa', error),
      });
    } else {
      this.empresasService.update(this.idEmpresa, empresa).subscribe({
        next: () => {
          this.productDialog = false;
          this.obtenerLista();
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha sido completada.",
            icon: "success"
          });
        },
        error: (error) => console.error('Error al editar la empresa', error),
      });
    }
  }

  cambiarEstado(empresa: Empresa) {
    this.empresasService.inactivate(empresa.id).subscribe({
      next: () => {
        this.obtenerLista();
        Swal.fire({
          title: "Correcto!",
          text: "La operación se ha sido completada.",
          icon: "success"
        });
      },
      error: (error) => console.error(error)
    });
  }

  cerrarModal() {
    this.productDialog = false;
  }
}
