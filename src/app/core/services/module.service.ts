// src/app/core/services/module.service.ts
import { Injectable, inject } from '@angular/core';
import { SystemModule } from '../models/system-module';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private authService = inject(AuthService);

  /**
   * Obtiene los módulos filtrados según los permisos del usuario actual
   */
  getAccessibleModules(modules: SystemModule[]): SystemModule[] {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return [];
    }

    return modules.filter((module) => this.hasAccessToModule(module, currentUser.permisos, currentUser.roles));
  }

  /**
   * Verifica si el usuario tiene acceso a un módulo
   */
  private hasAccessToModule(
    module: SystemModule,
    userPermissions: string[],
    userRoles: string[]
  ): boolean {
    // Si el módulo no tiene restricciones, todos tienen acceso
    if (!module.requiredPermissions && !module.requiredRoles) {
      return true;
    }

    // Verificar roles requeridos
    if (module.requiredRoles && module.requiredRoles.length > 0) {
      const hasRequiredRole = module.requiredRoles.some((role) => userRoles.includes(role));
      if (!hasRequiredRole) {
        return false;
      }
    }

    // Verificar permisos requeridos
    if (module.requiredPermissions && module.requiredPermissions.length > 0) {
      const hasRequiredPermission = module.requiredPermissions.some((requiredPerm) =>
        userPermissions.some((userPerm) => userPerm.startsWith(requiredPerm))
      );
      if (!hasRequiredPermission) {
        return false;
      }
    }

    return true;
  }

  /**
   * Verifica si el usuario tiene acceso a un módulo específico
   */
  canAccessModule(moduleId: string, modules: SystemModule[]): boolean {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) {
      return false;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    return this.hasAccessToModule(module, currentUser.permisos, currentUser.roles);
  }
}
