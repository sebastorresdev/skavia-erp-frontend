// src/app/auth/pages/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    DividerModule,
    MessageModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './login.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  twoFactorCode: string = '';
  rememberMe: boolean = true; // useCookies
  loading: boolean = false;
  errorMessage: string = '';
  show2FA: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    console.group('🔑 LOGIN PROCESS');
    console.log('Email:', this.email);
    console.log('Use Cookies:', this.rememberMe);
    console.log('Starting login...');

    this.loading = true;
    this.errorMessage = '';

    // Crear objeto con credenciales según Identity API
    const credentials = {
      email: this.email,
      password: this.password,
      twoFactorCode: this.twoFactorCode || undefined,
      twoFactorRecoveryCode: undefined,
    };

    this.authService.login(credentials).subscribe({
      next: (isAuth) => {

        if (!isAuth) {
          console.error('❌ Not authenticated after login!');
          this.errorMessage = 'Error de autenticación';
          this.loading = false;
          console.groupEnd();
          return;
        }

        const user = this.authService.getCurrentUser();

        console.log('✅ Navigating to /skvia');
        this.router.navigate(['/skvia']).then((success) => {
          if (!success) {
            console.error('❌ Navigation failed!');
            console.log('Check auth.guard logs above');
          }
        });

        this.loading = false;
        console.groupEnd();
      },

      error: (err) => {
        console.error('❌ Login error:', err);
        this.errorMessage = 'Credenciales incorrectas';
        this.loading = false;
        console.groupEnd();
      },
    });
  }
}
