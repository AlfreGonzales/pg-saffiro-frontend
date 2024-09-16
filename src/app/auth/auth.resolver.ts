import { ResolveFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { catchError, of, tap } from 'rxjs';

export const authResolver: ResolveFn<boolean> = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const localStorageService = inject(LocalStorageService);

  return authService.authInfo().pipe(
    tap((data: any) => {
        const usuarioInfo = localStorageService.getUsuario();
        localStorageService.setUsuario({ ...usuarioInfo, id: data.id, permisos: data.permisos });
    }),
    catchError((error) => {
      if (error.status === 401) {
        router.navigate(['auth/login']);
        console.error('Acceso no autorizado por el resolver', error.message);
      } else {
        console.error('Error al obtener la información del autenticación', error.message);
      }
      return of(false);
    })
  );
};
