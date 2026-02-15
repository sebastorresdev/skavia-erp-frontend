import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { User } from '../core/services/auth.service';

// PrimeNG
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { BadgeModule } from 'primeng/badge';

interface CompanyOption {
  label: string;
  value: string;
  icon?: string;
}

@Component({
  selector: 'app-mobile-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    DrawerModule,
    AvatarModule,
    RippleModule,
    DividerModule,
    SelectModule,
    BadgeModule
  ],
  template: `
    <p-drawer
      [(visible)]="visible"
      position="left"
      [showCloseIcon]="false"
      [style]="{ width: '320px' }"
      class="lg:hidden">

      <!-- Header -->
      <ng-template pTemplate="header">
        <div class="w-full space-y-4">
          <!-- Top Bar -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-linear-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-md">
                <i class="pi pi-box text-white text-xl"></i>
              </div>
              <h2 class="font-bold text-xl text-surface-800 dark:text-surface-100">
                {{ moduleName() }}
              </h2>
            </div>
            <button
              (click)="closeDrawer()"
              class="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <i class="pi pi-times text-xl text-surface-600 dark:text-surface-400"></i>
            </button>
          </div>

          <!-- User Info Card -->
          <div class="flex items-center gap-3 p-4 bg-linear-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
            <div class="relative">
              <p-avatar
                [label]="getUserInitials()"
                size="large"
                shape="circle"
                class="bg-linear-to-br from-primary-500 to-primary-600 text-white ring-2 ring-primary-200 dark:ring-primary-700">
              </p-avatar>
              <span class="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-primary-900"></span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">
                {{ getUserName() }}
              </p>
              <p class="text-xs text-surface-600 dark:text-surface-400">
                {{ getUserRole() }}
              </p>
            </div>
          </div>

          <!-- Company Selector -->
          @if (companies().length > 0) {
            <div class="space-y-2">
              <label class="text-xs font-semibold text-surface-700 dark:text-surface-300">
                Empresa
              </label>
              <p-select
                [(ngModel)]="selectedCompany"
                [options]="companies()"
                (onChange)="onCompanyChange($event.value)"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleccionar empresa"
                class="w-full">
                <ng-template pTemplate="selectedItem">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-building text-primary-600 dark:text-primary-400"></i>
                    <span class="font-semibold text-sm truncate">
                      {{ getCompanyLabel(selectedCompany()) }}
                    </span>
                  </div>
                </ng-template>
                <ng-template let-company pTemplate="item">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-building text-primary-600 dark:text-primary-400"></i>
                    <span>{{ company.label }}</span>
                  </div>
                </ng-template>
              </p-select>
            </div>
          }
        </div>
      </ng-template>

      <!-- Content: Navigation Menu -->
      <ng-template pTemplate="content">
        <div class="space-y-2">
          <!-- Home Button -->
          <a
            pRipple
            [routerLink]="['/skvia']"
            (click)="onNavigate()"
            routerLinkActive="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all cursor-pointer group">
            <i class="pi pi-home text-lg group-hover:scale-110 transition-transform"></i>
            <span class="flex-1 font-medium">Inicio</span>
          </a>

          <p-divider class="my-2"></p-divider>

          <!-- Navigation Items -->
          @for (item of menuItems(); track item.label; let i = $index) {
            <div class="space-y-1">
              @if (item.routerLink && !item.items) {
                <!-- Simple Link -->
                <a
                  pRipple
                  [routerLink]="item.routerLink"
                  (click)="onNavigate()"
                  routerLinkActive="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all cursor-pointer group">
                  @if (item.icon) {
                    <i [class]="item.icon + ' text-lg group-hover:scale-110 transition-transform'"></i>
                  }
                  <span class="flex-1 font-medium">{{ item.label }}</span>
                  @if (item.badge) {
                    <p-badge [value]="item.badge" severity="danger"></p-badge>
                  }
                </a>
              } @else if (item.items) {
                <!-- Menu with Submenu -->
                <button
                  pRipple
                  (click)="toggleSubmenu(i)"
                  [class.bg-surface-100]="activeSubmenu === i"
                  [class.dark:bg-surface-800]="activeSubmenu === i"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all group">
                  @if (item.icon) {
                    <i [class]="item.icon + ' text-lg group-hover:scale-110 transition-transform'"></i>
                  }
                  <span class="flex-1 text-left font-medium">{{ item.label }}</span>
                  <i class="pi text-xs transition-transform duration-200"
                     [class.pi-chevron-down]="activeSubmenu !== i"
                     [class.pi-chevron-up]="activeSubmenu === i"></i>
                </button>

                <!-- Submenu Items -->
                @if (activeSubmenu === i) {
                  <div class="ml-4 mt-1 space-y-1 border-l-2 border-primary-500 dark:border-primary-600 pl-4">
                    @for (subItem of item.items; track subItem.label) {
                      @if (subItem.separator) {
                        <div class="my-2 border-t border-surface-200 dark:border-surface-700"></div>
                      } @else {
                        <a
                          pRipple
                          [routerLink]="subItem.routerLink"
                          (click)="onNavigate()"
                          routerLinkActive="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold"
                          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all cursor-pointer text-sm">
                          @if (subItem.icon) {
                            <i [class]="subItem.icon + ' text-base'"></i>
                          }
                          <span>{{ subItem.label }}</span>
                        </a>
                      }
                    }
                  </div>
                }
              }
            </div>
          }
        </div>
      </ng-template>

      <!-- Footer: User Actions -->
      <ng-template pTemplate="footer">
        <div class="space-y-2 pt-4 border-t border-surface-200 dark:border-surface-700">
          @for (item of userMenuItems(); track item.label) {
            @if (item.separator) {
              <div class="my-3 border-t border-surface-200 dark:border-surface-700"></div>
            } @else {
              <button
                pRipple
                (click)="onMenuItemClick(item)"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all group"
                [class.text-red-600]="item.icon === 'pi pi-sign-out'"
                [class.dark:text-red-400]="item.icon === 'pi pi-sign-out'"
                [class.hover:bg-red-50]="item.icon === 'pi pi-sign-out'"
                [class.dark:hover:bg-red-900/20]="item.icon === 'pi pi-sign-out'">
                @if (item.icon) {
                  <i [class]="item.icon + ' text-lg group-hover:scale-110 transition-transform'"></i>
                }
                <span class="font-medium">{{ item.label }}</span>
              </button>
            }
          }
        </div>
      </ng-template>
    </p-drawer>
  `
})
export class MobileDrawer {
  // Inputs
  visible = model.required<boolean>();
  moduleName = input.required<string | undefined>();
  menuItems = input.required<MenuItem[]>();
  userMenuItems = input.required<MenuItem[]>();

  // User info
  currentUser = input<User | null>(null);

  // Companies
  companies = input<CompanyOption[]>([]);
  selectedCompany = model<string>('');

  // Local state
  activeSubmenu: number | null = null;

  // Outputs
  closed = output<void>();
  companyChanged = output<string>();

  /**
   * Obtener iniciales del usuario
   */
  getUserInitials(): string {
    const user = this.currentUser();
    if (!user || !user.username) return 'U';

    const parts = user.username.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  }

  /**
   * Obtener rol del usuario
   */
  getUserRole(): string {
    const user = this.currentUser();
    if (!user || !user.roles || user.roles.length === 0) {
      return 'Usuario';
    }
    return user.roles[0];
  }

  /**
   * Obtener nombre del usuario
   */
  getUserName(): string {
    const user = this.currentUser();
    return user?.username || 'Usuario';
  }

  /**
   * Obtener label de company por código
   */
  getCompanyLabel(code: string): string {
    const company = this.companies().find(c => c.value === code);
    return company?.label || code;
  }

  /**
   * Toggle submenu
   */
  toggleSubmenu(index: number): void {
    this.activeSubmenu = this.activeSubmenu === index ? null : index;
  }

  /**
   * Cambio de company
   */
  onCompanyChange(companyCode: string): void {
    this.companyChanged.emit(companyCode);
  }

  /**
   * Click en menu item
   */
  onMenuItemClick(item: MenuItem): void {
    if (item.command) {
      item.command({ originalEvent: new MouseEvent('click'), item });
    }
    this.closeDrawer();
  }

  /**
   * Navegación
   */
  onNavigate(): void {
    this.closeDrawer();
  }

  /**
   * Cerrar drawer
   */
  closeDrawer(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}
