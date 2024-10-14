import { Component, OnInit } from '@angular/core';
import { PgTablaComponent } from '@shared/components/pg-tabla/pg-tabla.component';
import { sharedImports } from '@shared/shared-imports';
import { Equipo } from './interfaces/equipo';
import { FormBuilder, Validators } from '@angular/forms';
import { EquiposService } from './equipos.service';
import Swal from 'sweetalert2';
import { UsuariosService } from '@usuarios/usuarios.service';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [...sharedImports, PgTablaComponent],
  templateUrl: './equipos.component.html',
  styleUrl: './equipos.component.scss'
})
export class EquiposComponent implements OnInit {
  listaEquipos!: Equipo[];

  listaUsuariosMultiselect!: any[];

  productDialog: boolean = false;

  editting: boolean = false;

  idEquipo!: number;

  cols!: any;

  tableConfig: any = {};

  loading: boolean = false;

  formEquipo = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    usuarios: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private equiposService: EquiposService,
    private usuariosService: UsuariosService,
  ) {}

  ngOnInit(): void {
    this.obtenerLista();
    this.obtenerListaUsuarios();
  }

  obtenerLista() {
    this.equiposService.findAll().subscribe({
      next: (data) => {
        this.listaEquipos = data;
        this.configurarTabla();
        this.loading = true;
      },
      error: (error) => console.error('Error al listar los equipos', error),
    });
  }

  configurarTabla() {
    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'created_at', header: 'Fecha de registro', type: 'date' },
      { field: 'estado_logico', header: 'Estado', type: 'state' },
      { header: '', sort: false, type: 'actions', actions: [
        {
          type: 'edit', click: (item: any) => this.abrirModalEditar(item)
        },
        {
          type: 'inactivate', click: (item: Equipo) => this.inactivar(item)
        }
      ] }
    ];
    this.tableConfig = {
      title: 'Lista de equipos de desarrollo',
      cols: this.cols,
      data: this.listaEquipos,
      subTable: {
        cols: [
          { field: 'usuario.nombres', header: 'Nombres' }
        ],
        data: 'equipo_usuario'
      }
    };
  }

  obtenerListaUsuarios() {
    this.usuariosService.findAll().subscribe({
      next: (data) => {
        this.listaUsuariosMultiselect = data
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

  abrirModalCrear() {
    this.formEquipo.reset();
    this.editting = false;
    this.productDialog = true;
  }

  abrirModalEditar(equipo: any) {
    this.idEquipo= equipo.id;
    this.editting = true;
    const resultado: any = this.listaUsuariosMultiselect.filter(item => equipo.equipo_usuario.map((iEqUs: any) => iEqUs.id_usuario).includes(item.code));
    this.formEquipo.patchValue({
      nombre: equipo.nombre,
      descripcion: equipo.descripcion,
      usuarios: resultado
    });
    this.productDialog = true;
  }

  crearEquipo() {
    if (this.formEquipo.invalid) {
      this.formEquipo.markAllAsTouched();
      return;
    }
    const usuarios: any = this.formEquipo.value.usuarios;
    const resultado = usuarios.map((iUsuario: any) => iUsuario.code);
    if (!this.editting) {
      const equipo: any = {
        nombre: this.formEquipo.value.nombre,
        descripcion: this.formEquipo.value.descripcion,
        id_usuarios: resultado
      };
      this.equiposService.create(equipo).subscribe({
        next: () => {
          this.productDialog = false;
          this.obtenerLista();
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha sido completada.",
            icon: "success"
          });
        },
        error: (error) => console.error('Error al crear el equipo', error),
      });
    } else {
      const equipo: any = {
        nombre: this.formEquipo.value.nombre,
        descripcion: this.formEquipo.value.descripcion,
        id_usuarios: resultado
      };
      this.equiposService.update(this.idEquipo, equipo).subscribe({
        next: () => {
          this.productDialog = false;
          this.obtenerLista();
          Swal.fire({
            title: "Correcto!",
            text: "La operación se ha sido completada.",
            icon: "success"
          });
        },
        error: (error) => console.error('Error al editar el equipo', error),
      });
    }
  }

  inactivar(equipo: Equipo) {
    this.equiposService.inactivate(equipo.id).subscribe({
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
