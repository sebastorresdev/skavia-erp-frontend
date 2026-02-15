// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, switchMap, take, BehaviorSubject, filter } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Subject para evitar múltiples renovaciones simultáneas
const refreshTokenInProgress = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Clonar la request y agregar el token si existe
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  else {
    console.log('No token found, request without Authorization header');
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);
      
      // Si el error es 401 (No autorizado) y NO es el endpoint de login/refresh, intentar renovar
      const isLoginRequest = req.url.includes('/users/login');
      const isRefreshRequest = req.url.includes('/users/refresh');
      
      if (error.status === 401 && !isLoginRequest && !isRefreshRequest) {
        // Si ya hay una renovación en progreso, esperar
        if (refreshTokenInProgress.value) {
          return refreshTokenInProgress.pipe(
            filter(inProgress => !inProgress),
            take(1),
            switchMap(() => {
              const newToken = authService.getToken();
              if (newToken) {
                const clonedReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next(clonedReq);
              }
              return throwError(() => error);
            })
          );
        }

        // Marcar que hay renovación en progreso
        refreshTokenInProgress.next(true);

        // Intentar renovar el token
        return authService.refreshAccessToken().pipe(
          switchMap((success) => {
            refreshTokenInProgress.next(false);
            
            if (success) {
              // Obtener el nuevo token y reintentar la petición
              const newToken = authService.getToken();
              if (newToken) {
                const clonedReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next(clonedReq);
              }
            }
            
            // Si la renovación falla, retornar el error original
            return throwError(() => error);
          }),
          catchError(() => {
            refreshTokenInProgress.next(false);
            return throwError(() => error);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
