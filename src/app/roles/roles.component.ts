import { Component, OnInit } from '@angular/core';

import { Table, TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipModule } from 'primeng/chip';

import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Rol } from './models/rol';
import { RolesService } from './roles.service';
import { Modulos } from '../shared/enums/modulos';

interface Modulo {
  campo: string;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    SweetAlert2Module,
    PasswordModule,
    MultiSelectModule,
    ChipModule
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  listaRoles: Rol[] = [];

  listamodulosMultiselect: any[] = Object.values(Modulos).map(iModulo => ({ name: iModulo }));
  
  productDialog: boolean = false;

  editting: boolean = false;

  idRol: number = 0;

  cols: any[] = [];


  rowsPerPageOptions = [5, 10, 20];

  alertaBorrar: SweetAlertOptions = {
    title: "Desea inactivar el rol?",
    //text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar"
  }

  formRol = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    modulos: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.obtenerLista();
  }

  obtenerLista() {
    this.rolesService.findAll().subscribe({
      next: (data) => {
        this.listaRoles = data;
      },
      error: (error) => console.error('Error al listar los roles', error),
    });

    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'modulos', header: 'Módulos' },
      { field: 'created_at', header: 'Fecha de registro' },
      { field: 'estado_logico', header: 'Estado' },
    ];
  }

  crearUsuario(): void {
    if (this.formRol.invalid) {
      this.formRol.markAllAsTouched();
      return;
    }
    const modulos: any = this.formRol.value.modulos;
    const resultado = modulos.map((modulo: any) => modulo.name).join(', ');
    if (!this.editting) {
      const rol: any = {
        nombre: this.formRol.value.nombre,
        modulos: resultado
      };
      this.rolesService.create(rol).subscribe({
        next: () => {
          this.productDialog = false;
          this.obtenerLista();
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha sido completada.",
            icon: "success"
          });
        },
        error: (error) => console.error('Error al crear el rol', error),
      });
    } else {
      const rol: any = {
        nombre: this.formRol.value.nombre,
        modulos: resultado
      };
      this.rolesService.update(this.idRol, rol).subscribe({
        next: () => {
          this.productDialog = false;
          this.obtenerLista();
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha sido completada.",
            icon: "success"
          });
        },
        error: (error) => console.error('Error al editar el rol', error),
      });
    }
  }

  inactivar(rol: Rol) {
    this.rolesService.remove(rol.id).subscribe({
      next: () => {
        this.obtenerLista();
      },
      error: (error) => console.error(error)
    });
    Swal.fire({
      title: "Inactivado!",
      text: "El rol ha sido inactivado.",
      icon: "success"
    });
  }

  openNew() {
    this.formRol.reset();
    this.editting = false;
    this.productDialog = true;
  }

  editRol(rol: Rol): void {
    this.idRol = rol.id;
    this.editting = true;
    const resultado: any = rol.modulos.split(', ').map(modulo => ({ name: modulo }));
    this.formRol.patchValue({
      nombre: rol.nombre,
      modulos: resultado
    });
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
