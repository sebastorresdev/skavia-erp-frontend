import { Component, input, inject, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

// Services
import { LayoutService } from '../core/services/layout.service';
import { AuthService, User } from '../core/services/auth.service';
import { SucursalStateService } from '../features/ordenes-trabajo/services/sucursal-state.service';

// Components
import { UserMenu } from './user-menu';
import { MobileDrawer } from './mobile-drawer';
import { ClickOutsideDirective } from './click-outside.directive';

// PrimeNG
import { MenubarModule } from 'primeng/menubar';
import { Tooltip } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { SelectModule } from 'primeng/select';
import { SystemModule } from '../core/models/system-module';

interface CompanyOption {
  label: string;
  value: string;
  icon?: string;
}

interface SucursalOption {
  label: string;
  value: string;
  nombre: string;
  codigo: string;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MenubarModule,
    UserMenu,
    MobileDrawer,
    ClickOutsideDirective,
    Tooltip,
    ButtonModule,
    BadgeModule,
    AvatarModule,
    SelectModule
  ],
  templateUrl: './topbar.html'
})
export class Topbar implements OnInit {
  currentModule = input<SystemModule | null>(null);

  // Services
  public layoutService = inject(LayoutService);
  public authService = inject(AuthService);
  private sucursalState = inject(SucursalStateService);
  private router = inject(Router);

  // State
  public showMobileDrawer = signal(false);
  public showUserMenu = signal(false);
  public currentUser = signal<User | null>(null);
  public notificationCount = signal(3);

  // Company selection
  public selectedCompany = signal<string>('');
  public companies = signal<CompanyOption[]>([]);

  // ===============================
  // SUCURSALES - NUEVO
  // ===============================

  // Sucursales del usuario autenticado
  public sucursales = computed(() => {
    const user = this.currentUser();
    if (!user || !user.sucursales) return [];

    return user.sucursales.map(s => ({
      label: s.nombre,
      value: s.codigo,
      nombre: s.nombre,
      codigo: s.codigo
    }));
  });

  // Sucursal seleccionada
  public selectedSucursal = signal<string>('');

  // Computed
  public userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return 'U';
    return this.getInitials(user.username);
  });

  public userName = computed(() => {
    return this.currentUser()?.username || 'Usuario';
  });

  public userRole = computed(() => {
    const user = this.currentUser();
    if (!user || !user.roles || user.roles.length === 0) {
      return 'Usuario';
    }
    return user.roles[0];
  });

  public userMenuItems = computed<MenuItem[]>(() => [
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      command: () => this.goToProfile()
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      command: () => this.goToSettings()
    },
    {
      separator: true
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ]);

  constructor() {
    // Inicializar sucursal seleccionada cuando se carguen las sucursales
    effect(() => {
      const sucursales = this.sucursales();
      if (sucursales.length > 0 && !this.selectedSucursal()) {
        const primeraSucursal = sucursales[0].codigo;
        this.selectedSucursal.set(primeraSucursal);
        // Actualizar el estado global
        this.sucursalState.setSucursal(primeraSucursal);
        console.log('🏢 Primera sucursal seleccionada automáticamente:', primeraSucursal);
      }
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  private getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  /**
   * Obtener label de la company seleccionada
   */
  getSelectedCompanyLabel(): string {
    const selected = this.companies().find(c => c.value === this.selectedCompany());
    return selected?.label || this.selectedCompany();
  }

  /**
   * Obtener label de la sucursal seleccionada - NUEVO
   */
  getSelectedSucursalLabel(): string {
    const selected = this.sucursales().find(s => s.codigo === this.selectedSucursal());
    return selected?.nombre || 'Seleccionar sucursal';
  }

  /**
   * Verificar si estamos en el módulo de Órdenes de Trabajo - NUEVO
   */
  isOrdenesTrabajoModule(): boolean {
    const moduleName = this.currentModule()?.name;
    return moduleName === 'Órdenes de Trabajo' ||
           moduleName === 'ordenes-trabajo' ||
           moduleName === 'Ordenes de Trabajo';
  }

  /**
   * Cuando cambia la sucursal seleccionada - NUEVO
   */
  onSucursalChange(codigoSucursal: string): void {
    this.selectedSucursal.set(codigoSucursal);
    this.sucursalState.setSucursal(codigoSucursal);
    console.log('✅ Sucursal seleccionada:', codigoSucursal);
  }

  /**
   * Click en menu item
   */
  onMenuItemClick(item: MenuItem): void {
    if (item.command) {
      item.command({ originalEvent: new MouseEvent('click'), item });
    }
  }

  goToHome(): void {
    this.router.navigate(['/skavia']);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  closeUserMenu(): void {
    this.showUserMenu.set(false);
  }

  toggleMobileDrawer(): void {
    this.showMobileDrawer.update(v => !v);
  }

  closeMobileDrawer(): void {
    this.showMobileDrawer.set(false);
  }

  onCompanyChange(companyCode: string): void {
    console.log('Company seleccionada:', companyCode);
  }

  goToProfile(): void {
    this.router.navigate(['/skavia/profile']);
    this.closeUserMenu();
  }

  goToSettings(): void {
    this.router.navigate(['/skavia/settings']);
    this.closeUserMenu();
  }

  viewNotifications(): void {
    console.log('Ver notificaciones');
  }

  logout(): void {
    this.authService.logout();
    this.closeUserMenu();
  }
}
