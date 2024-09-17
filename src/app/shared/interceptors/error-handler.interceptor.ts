import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError((error: HttpErrorResponse) => {
    Swal.fire({
      title: `${error.statusText}`,
      text: error.error.message,
      icon: "error"
    });
    return throwError(() => error);
  }));
};
