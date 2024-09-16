import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { LogAccesosService } from '../../log-accesos/log-accesos.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, CheckboxModule, InputTextModule, FormsModule, PasswordModule, RouterModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private logAccesosService: LogAccesosService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  async iniciarSesion() {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }
    const login: any = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password
    };
    try {
      const data: any = await firstValueFrom(this.authService.login(login));
      this.localStorageService.setUsuario(data);
      await this.crearLogAcceso(data.id);
      this.router.navigate(['']);
    } catch (error: any) {
      Swal.fire({
        title: `Error ${error.status}!`,
        text: error.error.message,
        icon: "error"
      });
    }
  }

  async crearLogAcceso(idUsuario: number) {
    try {
      const ipInfo: any = await firstValueFrom(this.logAccesosService.getIpInfo());
      const logAcceso: any = {
        ip: ipInfo.ip,
        accion: 'Inicio de sesión',
        ciudad: ipInfo.city,
        pais: ipInfo.country,
        detalle: navigator.appVersion,
        id_usuario: idUsuario
      }
      await firstValueFrom(this.logAccesosService.createLogAcceso(logAcceso));
    } catch (error: any) {
      Swal.fire({
        title: `Error!`,
        text: error.message,
        icon: "error"
      });
    }
  }
}
