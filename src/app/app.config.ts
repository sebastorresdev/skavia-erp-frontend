import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
// PRIMENG CONFIGURATION
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([authInterceptor]) // Agregar el interceptor
    ),
    provideRouter(routes),
    // Inicializar autenticación después de que todos los servicios estén listos
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => authService.initializeAuthentication(),
      deps: [AuthService],
      multi: true,
    },
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
      translation: {
        accept: 'Aceptar',
        reject: 'Rechazar',
        upload: 'Subir',
        cancel: 'Cancelar',
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        monthNames: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
        today: 'Hoy',
        clear: 'Limpiar',
        // y muchos más...
      },
    }),
  ],
};
