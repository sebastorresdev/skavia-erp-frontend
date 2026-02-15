// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of, map, switchMap } from 'rxjs';

import { environment } from '../../../../environments/environment';

// INTERFACES

// Respuesta del login
export interface LoginResponse {
  tokenType?: string;
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
}

export interface CurrentUserResponse {
  email: string;
  isEmailConfirmed: boolean;
}

export interface sucursal {
  codigo: string;
  nombre: string;
}

export interface User {
  userId: string;
  username: string;
  urlFotoPerfil: string | null;
  roles: string[];
  permisos: string[];
  sucursales: sucursal[];
}

// Solicitud de login
export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
  twoFactorRecoveryCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private _router = inject(Router);

  private readonly _baseUrl = environment.baseUrl + '/users';
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  // Estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // No hacer nada aquí para evitar dependencias circulares
  }

  /**
   * Inicializa autenticación al arrancar la app
   */
  initializeAuthentication(): void {
    const token = this.getToken();

    if (!token) {
      this.isAuthenticatedSubject.next(false);
      return;
    }

    this.loadCurrentUser().subscribe();
  }

  loadCurrentUser(): Observable<User | null> {
    if (this.isAuthenticatedSubject.value && this.currentUserSubject.value) {
      return of(this.currentUserSubject.value);
    }

    return this._http.get<User>(`${this._baseUrl}/me`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((error) => {
        // No hacer logout automático aquí, dejar que el interceptor lo maneje
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);
        console.error('❌ Error al cargar usuario:', error);
        return of(null);
      }),
    );
  }

  login(credentials: LoginRequest): Observable<boolean> {
    return this._http.post<LoginResponse>(`${this._baseUrl}/login`, credentials).pipe(
      tap((response) => {
        // 🔑 GUARDAR TOKENS ANTES DE NADA
        this.saveTokens(response);
      }),
      switchMap(() => this.loadCurrentUser()),
      tap((user) => {
        console.log('✅ Usuario autenticado:', user);
      }),
      map((user) => !!user),
      catchError(() => {
        this.logout();
        return of(false);
      }),
    );
  }

  /**
   * Renovar el access token usando el refresh token
   */
  refreshAccessToken(): Observable<boolean> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return of(false);
    }

    return this._http.post<LoginResponse>(`${this._baseUrl}/refresh`, { refreshToken }).pipe(
      tap((response) => {
        this.saveTokens(response);
        console.log('✅ Token renovado exitosamente');
      }),
      map(() => true),
      catchError((error) => {
        console.error('❌ Error al renovar token:', error);
        this.logout();
        return of(false);
      }),
    );
  }

  /**
   * Logout del usuario
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this._router.navigate(['/login']);
    console.log('✅ Logout exitoso');
  }

  /**
   * Guardar access y refresh tokens
   */
  private saveTokens(response: LoginResponse): void {
    if (response.accessToken) {
      localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    }
  }

  /**
   * Obtener access token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtener refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Métodos de acceso y verificación
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.roles.includes(role) ?? false;
  }

  hasPermission(permission: string): boolean {
    return this.currentUserSubject.value?.permisos.includes(permission) ?? false;
  }
}
