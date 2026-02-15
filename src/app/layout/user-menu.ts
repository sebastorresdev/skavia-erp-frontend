import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, RippleModule],
  template: `
    <!-- Dropdown Menu -->
    @if (isOpen()) {
      <div class="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-surface-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-surface-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">

        <!-- User Info Header -->
        @if (showUserInfo()) {
          <div class="px-4 py-3 border-b border-gray-200 dark:border-surface-700">
            <p class="text-sm font-bold text-gray-900 dark:text-white truncate">
              {{ userName() }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ userRole() }}
            </p>
          </div>
        }

        <!-- Menu Items -->
        <div class="py-2">
          @for (menuItem of menuItems(); track menuItem.label) {
            @if (menuItem.separator) {
              <div class="my-2 border-t border-gray-200 dark:border-surface-700 mx-2"></div>
            } @else {
              <button
                pRipple
                (click)="onMenuItemClick(menuItem)"
                [class.text-red-600]="menuItem.icon === 'pi pi-sign-out'"
                [class.dark:text-red-400]="menuItem.icon === 'pi pi-sign-out'"
                [class.hover:bg-red-50]="menuItem.icon === 'pi pi-sign-out'"
                [class.dark:hover:bg-red-900/20]="menuItem.icon === 'pi pi-sign-out'"
                class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-700 transition-colors group">
                @if (menuItem.icon) {
                  <i [class]="menuItem.icon + ' text-lg group-hover:scale-110 transition-transform'"></i>
                }
                <span class="font-medium text-sm">{{ menuItem.label }}</span>
              </button>
            }
          }
        </div>

        <!-- Footer (opcional) -->
        <div class="px-4 py-3 border-t border-gray-200 dark:border-surface-700">
          <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
            Versión 1.0.0
          </p>
        </div>
      </div>
    }
  `,
})
export class UserMenu {
  userName = input<string>('Usuario');
  userRole = input<string>('Rol');
  menuItems = input.required<MenuItem[]>();
  isOpen = input<boolean>(false);
  showUserInfo = input<boolean>(true);

  menuItemSelected = output<MenuItem>();

  onMenuItemClick(item: MenuItem): void {
    if (item.command) {
      item.command({ originalEvent: new MouseEvent('click'), item });
    }
    this.menuItemSelected.emit(item);
  }
}
