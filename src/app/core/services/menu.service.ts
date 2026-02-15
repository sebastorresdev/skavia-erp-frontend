import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MODULE_MENUS } from '../constants/menus.config';
import { SystemModule } from '../models/system-module';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  getModuleForUrl(url: string): SystemModule | null {
    const module = MODULE_MENUS.find(m => m.route && url.startsWith(m.route));
    return module ? module : null;
  }

  getAllModules(): SystemModule[] {
    return MODULE_MENUS;
  }
}
