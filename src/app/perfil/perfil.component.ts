import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { sharedImports } from '@shared/shared-imports';
import { UsuariosService } from '@usuarios/usuarios.service';
import { PasswordModule } from 'primeng/password';
import { FieldsetModule } from 'primeng/fieldset';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [...sharedImports, PasswordModule, FieldsetModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  formUsuario = this.fb.group({
    ci: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
    nombres: ['', [Validators.required, Validators.minLength(3)]],
    apellidos: ['', [Validators.required, Validators.minLength(3)]],
    cargo: [{ value: '', disabled: true }],
    telefono: [''],
    email: [{ value: '', disabled: true }],
    rol: [{ value: '', disabled: true }]
  });

  formPassword = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    this.usuariosService.findOne(this.localStorageService.getUsuario().id).subscribe({
      next: (data: any) => {
        this.formUsuario.patchValue({
          ci: data.ci,
          nombres: data.nombres,
          apellidos: data.apellidos,
          cargo: data.cargo,
          telefono: data.telefono,
          email: data.email,
          rol: data.rol.nombre
        });
      },
      error: (error) => console.error('Error al listar el usuario', error)
    });
  }

  editProfile() {
    if (this.formUsuario.invalid) {
      this.formUsuario.markAllAsTouched();
      return;
    }
    const usuario: any = {
      ci: this.formUsuario.value.ci,
      nombres: this.formUsuario.value.nombres,
      apellidos: this.formUsuario.value.apellidos,
      telefono: this.formUsuario.value.telefono
    }
    this.usuariosService.update(this.localStorageService.getUsuario().id, usuario).subscribe({
      next: () => {
        this.obtenerUsuario();
        Swal.fire({
          title: "Correcto!",
          text: "La operación se ha sido completada.",
          icon: "success"
        });
      },
      error: (error) => console.error('Error al editar el usuario', error)
    });
  }

  changePassword() {
    if (this.formPassword.invalid) {
      this.formPassword.markAllAsTouched();
      return;
    }
    if(this.formPassword.value.newPassword !== this.formPassword.value.confirmPassword) {
      this.formPassword.get('confirmPassword')?.setErrors({ notEqual: true });
      return;
    }
    const changePassword: any = {
      password: this.formPassword.value.currentPassword,
      newPassword: this.formPassword.value.newPassword
    }
    this.usuariosService.update(this.localStorageService.getUsuario().id, changePassword).subscribe({
      next: () => {
        Swal.fire({
          title: "Correcto!",
          text: "La operación se ha sido completada.",
          icon: "success"
        });
        this.formPassword.reset();
      },
      error: (error) => console.error('Error al cambiar la contraseña del usuario', error)
    });
  }
}
