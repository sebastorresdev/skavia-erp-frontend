// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está autenticado, retornar true
  if (authService.getCurrentUser()) {
    return true;
  }

  // Si hay token en localStorage, intentar cargar el usuario actual
  const token = authService.getToken();
  if (token) {
    return authService.loadCurrentUser().pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      }),
      // En caso de error, ir a login
      catchError(() => {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return [false];
      }),
    );
  }

  // No hay token ni usuario, ir a login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
