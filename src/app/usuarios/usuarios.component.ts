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

import { MessageService } from 'primeng/api';
import { Product, Usuario } from './models/usuario';
import { UsuariosService } from './usuarios.service';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Rol } from '../roles/models/rol';
import { RolesService } from '../roles/roles.service';

@Component({
  selector: 'app-usuarios',
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
    PasswordModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  listaUsuarios: Usuario[] = [];

  listaRoles: Rol[] = [];

  listaRolesDropdown: any[] = [];
  
  productDialog: boolean = false;

  editting: boolean = false;

  idUsuario: number = 0;

  deleteProductDialog: boolean = false;

  deleteProductsDialog: boolean = false;

  products: Product[] = [];

  product: Product = {};

  selectedProducts: Product[] = [];

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  alertaBorrar: SweetAlertOptions = {
    title: "Desea inactivar al usuario?",
    //text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar"
  }

  formUsuario = this.fb.group({
    ci: ['', [Validators.required, Validators.minLength(7)]],
    nombres: ['', [Validators.required, Validators.minLength(3)]],
    apellidos: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    id_rol: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private rolesService: RolesService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.obtenerLista();
    this.obtenerListaRoles();
  }

  obtenerLista() {
    this.usuariosService.findAll().subscribe({
      next: (data) => {
        this.listaUsuarios = data;
      },
      error: (error) => console.error('Error al listar los usuarios!', error),
    });

    this.cols = [
      { field: 'ci', header: 'Cédula de identidad' },
      { field: 'nombres', header: 'Nombres' },
      { field: 'apellidos', header: 'Apellidos' },
      { field: 'email', header: 'Email' },
      { field: 'id_rol', header: 'Rol' },
      { field: 'created_at', header: 'Fecha de registro' },
      { field: 'estado_logico', header: 'Estado' },
    ];

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' },
    ];
  }

  obtenerListaRoles() {
    this.rolesService.findAll().subscribe({
      next: (data) => {
        this.listaRoles = data;
        this.listaRolesDropdown = this.listaRoles.map((rol) => {
          return {
            name: rol.nombre,
            code: rol.id
          };
        });
      },
      error: (error) => console.error('Error al listar los roles!', error),
    });
  }

  crearUsuario(): void {
    if (this.formUsuario.invalid) {
      this.formUsuario.markAllAsTouched();
      return;
    }
    const id_rol: any = this.formUsuario.value.id_rol;
    if (!this.editting) {
      const usuario: any = {
        ci: this.formUsuario.value.ci,
        nombres: this.formUsuario.value.nombres,
        apellidos: this.formUsuario.value.apellidos,
        email: this.formUsuario.value.email,
        password: this.formUsuario.value.password,
        id_rol: id_rol.code
      };
      this.usuariosService.create(usuario).subscribe({
        next: (data) => {
          this.productDialog = false;
          this.obtenerLista();
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha sido completada.",
            icon: "success"
          });
        },
        error: (err) => console.error('Error al crear el usuario', err),
      });
    } else {
      const usuario: any = {
        ci: this.formUsuario.value.ci,
        nombres: this.formUsuario.value.nombres,
        apellidos: this.formUsuario.value.apellidos,
        email: this.formUsuario.value.email,
        id_rol: id_rol.code
      };
      this.usuariosService.update(this.idUsuario, usuario).subscribe({
        next: (data) => {
          this.productDialog = false;
          this.obtenerLista();
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha sido completada.",
            icon: "success"
          });
        },
        error: (err) => console.error('Error al editar el usuario', err),
      });
    }
  }

  inactivar(usuario: Usuario) {
    this.usuariosService.remove(usuario.id).subscribe({
      next: (data) => {
        this.obtenerLista();
      },
      error: (err) => console.error(err.message)
    });
    Swal.fire({
      title: "Inactivado!",
      text: "El usuario ha sido inactivado.",
      icon: "success"
    });
  }

  openNew() {
    this.formUsuario.get('email')?.enable();
    this.formUsuario.reset();
    this.editting = false;
    this.product = {};
    this.productDialog = true;
  }

  editUsuario(usuario: Usuario): void {
    this.idUsuario = usuario.id;
    this.formUsuario.get('email')?.disable();
    this.editting = true;
    this.formUsuario.patchValue({
      ci: usuario.ci,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      password: 'admin123abc',
      id_rol: this.listaRolesDropdown.find((rol) => rol.code === usuario.id_rol)
    });
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.deleteProductsDialog = true;
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.deleteProductDialog = true;
    this.product = { ...product };
  }

  confirmDeleteSelected() {
    this.deleteProductsDialog = false;
    this.products = this.products.filter(
      (val) => !this.selectedProducts.includes(val)
    );
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Products Deleted',
      life: 3000,
    });
    this.selectedProducts = [];
  }

  confirmDelete() {
    this.deleteProductDialog = false;
    this.products = this.products.filter((val) => val.id !== this.product.id);
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Deleted',
      life: 3000,
    });
    this.product = {};
  }

  hideDialog() {
    this.productDialog = false;
  }

  saveProduct() {
    if (this.product.name?.trim()) {
      if (this.product.id) {
        // @ts-ignore
        this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value
          : this.product.inventoryStatus;
        this.products[this.findIndexById(this.product.id)] = this.product;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      } else {
        this.product.id = this.createId();
        this.product.code = this.createId();
        this.product.image = 'product-placeholder.svg';
        // @ts-ignore
        this.product.inventoryStatus = this.product.inventoryStatus
          ? this.product.inventoryStatus.value
          : 'INSTOCK';
        this.products.push(this.product);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000,
        });
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
