import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../shared/services/local-storage.service';

export const authInfoInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('auth-info'))
    return next(req);

  const localStorageService = inject(LocalStorageService);

  const usuarioInfo = localStorageService.getUsuario();
  const token = usuarioInfo.access_token;

  const cloneReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(cloneReq);
};
