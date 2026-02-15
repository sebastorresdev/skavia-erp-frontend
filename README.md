# Skavia ERP - Frontend

Aplicación frontend moderna para **Skavia ERP**, un sistema integrado de gestión empresarial (ERP) construido con **Angular 19** y **TypeScript**.

## 🎯 Descripción

Skavia ERP es una solución empresarial completa que ofrece funcionalidades de gestión en múltiples áreas:

- 📦 **Órdenes de Trabajo** - Gestión y seguimiento de órdenes de trabajo
- 📊 **Inventario** - Gestión de stock, productos y almacenes
- 💰 **Ventas** - Gestión de ventas y facturación
- 🛒 **Compras** - Gestión de compras y proveedores
- 📈 **Contabilidad** - Gestión contable y financiera
- 👥 **Recursos Humanos** - Gestión de personal y nómina
- ⚙️ **Configuración** - Parámetros del sistema (Admin)

## ✨ Características Principales

### 🔐 Autenticación Segura
- **Login con credenciales** - Sistema de autenticación basado en tokens
- **Access Token + Refresh Token** - Implementación estándar de seguridad
- **Renovación automática de tokens** - Renovación transparente si el token expira
- **Persistencia de sesión** - La sesión se mantiene al recargar la página
- **Auto logout** - Cierre automático de sesión cuando ambos tokens expiran

### 🛡️ Sistema de Permisos
- **Control basado en permisos** - Acceso granular a módulos y funcionalidades
- **Formato de permisos** - `Permissions.ModuleName.Action` (ej: `Permissions.OrdenTrabajo.Ver`)
- **Filtrado dinámico de módulos** - Solo se muestran los módulos que el usuario puede acceder
- **Control por roles** - Soporte adicional para control por roles (Admin, User, etc.)

### 📱 Interfaz Moderna
- **Dashboard interactivo** - Panel principal con tarjetas de módulos accesibles
- **Diseño responsive** - Adaptado para escritorio, tablet y móvil
- **Tema claro/oscuro** - Soporte para modo oscuro integrado
- **PrimeNG Components** - Interfaz profesional con componentes de alta calidad

### 🚀 Arquitectura Escalable
- **Standalone Components** - Componentes Angular modernos (Angular 19+)
- **Lazy Loading** - Carga perezosa de módulos para mejor rendimiento
- **Servicios centralizados** - Lógica de negocio separada de componentes
- **Interceptores HTTP** - Manejo centralizado de autenticación y errores

## 📋 Requisitos

- **Node.js** v20 o superior
- **npm** v10 o superior
- **Angular CLI** v19

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/sebastorresdev/skavia-erp-frontend.git
cd skavia-erp-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Los archivos de entorno están en `environments/`:

**`environments/environment.ts`** (Desarrollo)
```typescript
export const environment = {
  baseUrl: 'http://localhost:5190/api'
};
```

**`environments/environment.prod.ts`** (Producción)
```typescript
export const environment = {
  baseUrl: 'https://tu-api-produccion.com/api'
};
```

### 4. Iniciar el servidor de desarrollo

```bash
ng serve
// o
npm start
```

La aplicación se abrirá en `http://localhost:4200`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── auth/
│   │   └── login/           # Componente de login
│   ├── core/
│   │   ├── constants/
│   │   │   └── menus.config.ts      # Configuración de módulos
│   │   ├── guards/
│   │   │   └── auth.guard.ts        # Guard de autenticación
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts  # Interceptor HTTP
│   │   ├── models/
│   │   │   └── system-module.ts     # Modelo de módulo
│   │   └── services/
│   │       ├── auth.service.ts      # Servicio de autenticación
│   │       ├── module.service.ts    # Servicio de módulos
│   │       └── menu.service.ts      # Servicio de menús
│   ├── features/
│   │   ├── dashboard/       # Panel principal
│   │   ├── inventory/       # Módulo de inventario
│   │   ├── settings/        # Configuración
│   │   └── work-order-management/  # Gestión de órdenes
│   ├── layout/
│   │   ├── layout.ts        # Componente principal del layout
│   │   ├── topbar.ts        # Barra superior
│   │   └── user-menu.ts     # Menú de usuario
│   ├── app.config.ts        # Configuración de la app
│   ├── app.routes.ts        # Rutas de la aplicación
│   └── app.ts               # Componente root
├── environments/            # Configuración por entorno
└── styles.css              # Estilos globales
```

## 🔑 Flujo de Autenticación

### Flujo de Login

```
1. Usuario ingresa credenciales
2. POST /api/users/login
3. Servidor devuelve: { accessToken, refreshToken, expiresIn }
4. Frontend guarda tokens en localStorage
5. Carga usuario actual con GET /api/users/me
6. Redirige a dashboard
```

### Renovación Automática de Token

```
1. Usuario hace petición HTTP
2. Interceptor agrega Authorization header con accessToken
3. Si respuesta es 401 (token expirado):
   - POST /api/users/refresh { refreshToken }
   - Obtiene nuevo accessToken
   - Reintenta petición original
4. Si refresh falla → Auto logout
```

### Persistencia de Sesión

```
1. Al cargar la app, AuthService busca token en localStorage
2. Si existe token → Verifica si es válido (GET /api/users/me)
3. Si respuesta es exitosa → Usuario autenticado
4. Si es 401 → Token expirado, intenta renovar
5. Si falla → Redirige a login
```

## 🔒 Sistema de Permisos y Control de Acceso

### Formato de Permisos

Los permisos siguen el patrón: `Permissions.{ModuleName}.{Action}`

**Ejemplos:**
- `Permissions.OrdenTrabajo.Ver` - Ver órdenes de trabajo
- `Permissions.OrdenTrabajo.Crear` - Crear órdenes de trabajo
- `Permissions.Inventario.Ver` - Ver inventario
- `Permissions.Ventas.Editar` - Editar ventas

### Filtrado de Módulos

El `ModuleService` compara automáticamente:

```typescript
// Usuario con permiso:
"Permissions.OrdenTrabajo.Ver"

// Módulo requiere:
requiredPermissions: ['Permissions.OrdenTrabajo']

// Resultado: ✅ ACCESO PERMITIDO
// (porque "Permissions.OrdenTrabajo.Ver" inicia con "Permissions.OrdenTrabajo")
```

### Uso en Componentes

```typescript
import { ModuleService } from '../../core/services/module.service';
import { MODULE_MENUS } from '../../core/constants/menus.config';

export class MyComponent {
  private moduleService = inject(ModuleService);
  
  accessibleModules = this.moduleService.getAccessibleModules(MODULE_MENUS);
  
  canAccess(moduleId: string): boolean {
    return this.moduleService.canAccessModule(moduleId, MODULE_MENUS);
  }
}
```

## 🔐 Verificación de Permisos en AuthService

```typescript
// Verificar si usuario tiene un permiso específico
hasPermission(permission: string): boolean {
  return this.currentUserSubject.value?.permisos.includes(permission) ?? false;
}

// Verificar si usuario tiene un rol
hasRole(role: string): boolean {
  return this.currentUserSubject.value?.roles.includes(role) ?? false;
}

// Renovar token automáticamente
refreshAccessToken(): Observable<boolean>
```

## 📡 Endpoints API Requeridos

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/users/login` | Login con credenciales |
| POST | `/api/users/refresh` | Renovar token |
| GET | `/api/users/me` | Obtener usuario actual |

### Respuesta de Login

```json
{
  "tokenType": "Bearer",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600,
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Respuesta de Usuario

```json
{
  "userId": "123",
  "username": "john.doe",
  "email": "john@example.com",
  "urlFotoPerfil": "https://...",
  "roles": ["User", "Admin"],
  "permisos": [
    "Permissions.OrdenTrabajo.Ver",
    "Permissions.OrdenTrabajo.Crear",
    "Permissions.Inventario.Ver"
  ],
  "sucursales": [
    {
      "codigo": "SU001",
      "nombre": "Sucursal Principal"
    }
  ]
}
```

## 🎨 Temas y Estilos

La aplicación utiliza **PrimeNG** con **Aura Theme**.

Para cambiar tema, edita `app.config.ts`:

```typescript
providePrimeNG({
  theme: {
    preset: Aura,  // Cambiar aquí
    options: {
      darkModeSelector: '.my-app-dark',
      cssLayer: {
        name: 'primeng',
        order: 'theme, base, primeng',
      },
    },
  },
})
```

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm start                # Inicia servidor de desarrollo
ng serve                # Alternativa con Angular CLI

# Compilación
ng build                # Build para producción
ng build --configuration production

# Testing
npm test                # Ejecuta pruebas unitarias
ng test

# Desarrollo con watch
ng build --watch        # Recompila al detectar cambios

# Linting
ng lint                 # Valida código TypeScript
```

## 📦 Dependencias Principales

- **Angular 19** - Framework frontend
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **PrimeNG** - Componentes UI profesionales
- **TailwindCSS** - Framework de estilos

## 🔄 Flujo de Trabajo Típico

### 1. Login
```
Usuario → Ingresa credenciales → Dashboard
```

### 2. Acceso a Módulos
```
Dashboard → Visualiza solo módulos permitidos → Selecciona módulo
```

### 3. Manejo de Token Expirado
```
Usuario navegando → Token expira → Interceptor detecta 401
→ Intenta renovar → Usuario no se da cuenta → Continúa navegando
```

### 4. Expiración Total
```
Ambos tokens expiran → Interceptor no puede renovar → Auto logout
→ Redirige a login
```

## 🐛 Troubleshooting

### Error: "No token found, request without Authorization header"

- **Causa**: Usuario no autenticado o token borrado
- **Solución**: Hacer login nuevamente

### Error 401 Unauthorized en peticiones

- **Causa**: Token expirado o inválido
- **Solución**: El interceptor intentará renovar automáticamente

### Módulos no aparecen en dashboard

- **Causa**: Usuario no tiene permisos para ese módulo
- **Solución**: Verificar en backend que los permisos incluyan el prefijo correcto

### Error de dependencia circular

- **Causa**: `AuthService` se inicializa en constructor
- **Solución**: Ya está solucionado, se usa `APP_INITIALIZER`

## 📚 Recursos Adicionales

- [Angular Documentation](https://angular.io/docs)
- [PrimeNG Documentation](https://primeng.org)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 👨‍💻 Autor

**Sebastián Torres**
- GitHub: [@sebastorresdev](https://github.com/sebastorresdev)
- Proyecto: [Skavia ERP Frontend](https://github.com/sebastorresdev/skavia-erp-frontend)

## 📄 Licencia

Este proyecto está bajo licencia **MIT**.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para reportar bugs o solicitar features, abre un [issue en GitHub](https://github.com/sebastorresdev/skavia-erp-frontend/issues).

---

**Última actualización:** Febrero 14, 2026

¡Gracias por usar Skavia ERP! 🚀
