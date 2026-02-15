import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  isDarkTheme: boolean = false;

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
    this.isDarkTheme = !this.isDarkTheme;
  }
}
