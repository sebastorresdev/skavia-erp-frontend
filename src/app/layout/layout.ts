import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Project components
import { Topbar } from './topbar';
import { MenuItem } from 'primeng/api';
import { MenuService } from '../core/services/menu.service';
import { SystemModule } from '../core/models/system-module';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Topbar, RouterOutlet],
  templateUrl: './layout.html',
})
export class Layout implements OnInit {
  // Signals
  public currentModule = signal<SystemModule | null>(null);

  // Services
  private menuService = inject(MenuService);
  private router = inject(Router);

  ngOnInit(): void {
    const currentUrl = this.router.url;
    this.updateMenu(currentUrl);

    // 2️⃣ Escuchar futuras navegaciones
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateMenu(event.urlAfterRedirects);
      });
  }

  private updateMenu(url: string): void {
    const module = this.menuService.getModuleForUrl(url);
    this.currentModule.set(module);
  }
}
