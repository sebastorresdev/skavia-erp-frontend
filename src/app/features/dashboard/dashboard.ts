import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../core/services/auth.service';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SystemModule } from '../../core/models/system-module';
import { MenuService } from '../../core/services/menu.service';
import { ModuleService } from '../../core/services/module.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    RippleModule,
    BadgeModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private menuService = inject(MenuService);
  private moduleService = inject(ModuleService);
  private router = inject(Router);

  currentUser: User | null = null;
  searchTerm: string = '';
  filteredSystemModules: SystemModule[] = [];

  ngOnInit() {
    console.log('DashboardComponent initialized');
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.filterModules();
    });
  }

  /**
   * Filtrar módulos según permisos del usuario y búsqueda
   */
  filterModules() {
    let modules = this.menuService.getAllModules();

    // Filtrar por permisos usando ModuleService
    modules = this.moduleService.getAccessibleModules(modules);

    // Filtrar por búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      modules = modules.filter(
        (module) =>
          module.name.toLowerCase().includes(term) ||
          module.description.toLowerCase().includes(term),
      );
    }

    this.filteredSystemModules = modules;
  }

  /**
   * Cuando cambia el término de búsqueda
   */
  onSearchChange() {
    this.filterModules();
  }

  /**
   * Navegar a un módulo
   */
  navigateToModule(module: SystemModule) {
    if (module.comingSoon) {
      // Mostrar mensaje de "próximamente"
      alert(`${module.name} estará disponible próximamente`);
      return;
    }
    console.log(`Navegando a módulo: ${module.name} (${module.route})`);
    this.router.navigate([module.route]);
  }

  /**
   * Obtener saludo según la hora
   */
  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
}
