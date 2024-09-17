import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AuthService } from '../auth.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

export const loginGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const localStorageService = inject(LocalStorageService);
  const usuarioInfo = localStorageService.getUsuario();

  if(!usuarioInfo) {
    await router.navigate(['auth/login']);
    return false;
  }

  try {
    await firstValueFrom(authService.validarToken(usuarioInfo.access_token));
  } catch (error: any) {
    if (error.status === 401) {
      router.navigate(['auth/login']);
      console.error('Acceso no autorizado por el guard', error);
    } else {
      console.error('Error al verificar el token', error);
    }
    return false;
  }

  return true;
};
