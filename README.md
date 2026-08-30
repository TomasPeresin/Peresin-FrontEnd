# 🌐 Peresín FrontEnd — Portfolio & Admin SPA

[![Angular](https://img.shields.io/badge/Angular-SPA-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![RxJS](https://img.shields.io/badge/RxJS-7.5-B7178C?logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase%20Hosting-Deployed-FFCA28?logo=firebase&logoColor=black)](https://frontendpti.web.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Aplicación Web de Página Única (**SPA**) moderna, reactiva y completamente administrable desarrollada en **Angular y TypeScript** para el portfolio profesional de **Tomás Ignacio Peresín**.

---

## 📑 Tabla de Contenidos
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Manejo de Estados de Carga y Cold Start](#-manejo-de-estados-de-carga-y-cold-start)
- [Autenticación y Panel de Administración](#-autenticación-y-panel-de-administración)
- [Puesta en Marcha Local](#-puesta-en-marcha-local)
- [Scripts Disponibles](#-scripts-disponibles)
- [Configuración de Entornos](#-configuración-de-entornos)
- [Despliegue](#-despliegue)

---

## ✨ Características Principales

- 🎨 **Diseño Moderno & Glassmorphism:** Interfaz limpia inspirada en Bento UI, con microinteracciones, animaciones de entrada (`AOS`) y tipografía cuidada (*Outfit* + *Inter*).
- 🌓 **Soporte Completo de Modo Claro / Oscuro:** Switch de tema dinámico persistente basado en variables nativas CSS (`[data-bs-theme]`).
- 🎯 **Enfoque Multidisciplinario:** Presentación organizada por áreas técnicas de especialidad:
  - **Backend & APIs** (Java, Spring Boot, Spring Security, JPA).
  - **Analista Funcional** (Relevamiento, Historias de Usuario, Diagramas UML).
  - **Datos & SQL** (Modelado DER, Consultas, Normalización).
  - **QA & Testing** (Postman, Casos de Prueba, Criterios de Aceptación).
- 📂 **Filtrado de Proyectos por Categoría:** Filtros dinámicos interactivos para explorar proyectos según su tecnología y enfoque.
- ⚡ **Tolerancia a Hibernación (Cold-Start de Servidores Gratuitos):** El usuario puede navegar de inmediato sin bloqueos globales de pantalla. Las secciones dinámicas gestionan de forma reactiva tres estados (`loading`, `success`, `error`) con skeletons shimmer y mensajes amigables con humor.
- 🔐 **Panel de Control y CRUD Administrable:** Gestión completa de contenidos (crear, editar, eliminar proyectos, experiencia, formación académica y perfil) protegida mediante JSON Web Tokens (JWT).

---

## 🛠️ Stack Tecnológico

| Módulo | Tecnología | Propósito |
|---|---|---|
| **Framework** | Angular | SPA basada en componentes y control flow moderno (`@if`, `@for`) |
| **Lenguaje** | TypeScript `~5.8` | Tipado estático y robustez en lógica de negocio |
| **Diseño y Estilos** | Bootstrap `5.3.8` + Bootstrap Icons | Grid responsivo, componentes base y librerías de íconos |
| **Animaciones** | `aos` (`^2.3.4`) + CSS Keyframes | Animaciones de scroll y shimmer skeletons |
| **Manejo Reactivo** | `RxJS 7` + `@angular/common/http` | Peticiones asíncronas, interceptores y reactividad |
| **Hosting** | Firebase Hosting | Despliegue estático de alto rendimiento en CDN global |

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── componentes/
│   │   ├── acerca-de/          # Hero banner, bio, foto y estado de disponibilidad
│   │   ├── educacion/          # Formación académica (listado, alta, edición)
│   │   ├── encabezado/         # Navbar, toggle de tema, links sociales y auth
│   │   ├── experiencia/        # Línea de tiempo laboral (timeline responsivo)
│   │   ├── home/               # Vista integradora Single Page
│   │   ├── login/              # Formulario de inicio de sesión con JWT
│   │   ├── pie/                # Footer institucional
│   │   ├── proyectos/          # Portafolio, filtros por rol y cards de proyectos
│   │   ├── sign-in/            # Registro de usuarios
│   │   └── skills/             # Cuadrícula de especialización y chips dinámicos
│   ├── core/
│   │   └── config/
│   │       └── app.config.ts   # Configuración de URL base de la API
│   ├── model/                  # Interfaces y clases (Persona, Proyecto, LoadingState, etc.)
│   ├── service/                # Servicios HTTP de comunicación con el backend Spring Boot
│   │   ├── auth.service.ts     # Login y registro
│   │   ├── interceptor-service.ts # Inyección de cabeceras Authorization: Bearer
│   │   ├── persona.service.ts  # Consulta y actualización de perfil
│   │   ├── s-proyecto.service.ts # CRUD de proyectos y subida de imágenes
│   │   ├── s-experiencia.service.ts # CRUD de experiencia laboral
│   │   ├── s-educacion.service.ts   # CRUD de formación académica
│   │   ├── s-hysskills.service.ts   # CRUD de habilidades
│   │   └── token.service.ts    # Gestión de JWT y roles en SessionStorage
│   ├── app-routing.module.ts   # Enrutamiento de la aplicación
│   └── app.module.ts
├── assets/                     # Imágenes estáticas y recursos locales
├── environments/               # Variables de entorno (development vs production)
└── styles.css                  # Estilos globales, variables de tema y keyframes
```

---

## ⏳ Manejo de Estados de Carga y Cold Start

Para evitar bloqueos globales o pantallas blancas cuando el backend en Render se encuentra hibernando, cada sección dependiente del servidor implementa de forma reactiva el tipo `LoadingState`:

```typescript
export type LoadingState = 'loading' | 'success' | 'error';
```

1. **Estado `'loading'`:**
   - En **Proyectos:** Muestra una tarjeta simpática con animación de vapor/café (`☕ Despertando al servidor...`), barra de progreso suave, rotador dinámico de frases humorísticas y una grilla de **3 skeletons con efecto shimmer**.
   - En **Experiencia:** Inserta un elemento en la línea de tiempo (`timeline-item`) con el estado de sincronización y skeletons que replican la estructura final.
   - En **Educación:** Mantiene la cuadrícula de 2 columnas con tarjetas `edu-card` en estado de espera.
2. **Estado `'error'`:** Muestra una tarjeta amigable con botón **[Reintentar conexión]** para volver a solicitar los datos si se produjo un timeout.
3. **Estado `'success'`:** Desvanece el loader y revela los datos reales sin parpadeos ni saltos de layout.

---

## 🔒 Autenticación y Panel de Administración

- **Seguridad Stateless:** Al iniciar sesión exitosamente en `/login`, el token JWT y los roles se almacenan de forma segura en `sessionStorage`.
- **Interceptor HTTP:** `InterceptorService` intercepta peticiones salientes y adjunta la cabecera `Authorization: Bearer <token>` únicamente si existe una sesión activa.
- **Vistas y Acciones Condicionales:** Los botones de alta, edición y eliminación de registros solo son visibles para usuarios con el rol `ROLE_ADMIN`.

---

## 💻 Puesta en Marcha Local

### Prerrequisitos
- Node.js (versión 18 o superior recomendada).
- Angular CLI instalado globalmente: `npm install -g @angular/cli`.

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/TomasPeresin/Peresin-FrontEnd.git
cd Peresin-FrontEnd
npm install
```

### 2. Iniciar el Servidor de Desarrollo
```bash
npm start
# o: ng serve
```
Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente ante cualquier cambio.

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo en `http://localhost:4200/` |
| `npm run build` | Compila la aplicación para producción en la carpeta `dist/` |
| `npm run watch` | Compila en modo desarrollo escuchando cambios en tiempo real |
| `npm test` | Ejecuta las pruebas unitarias mediante Karma y Jasmine |

---

## 🌐 Configuración de Entornos

Las URLs de conexión al backend se conmutan automáticamente según el entorno:

- **Desarrollo (`src/environments/environment.ts`):**
  ```typescript
  export const environment = {
    production: false,
    url: 'http://localhost:8080'
  };
  ```
- **Producción (`src/environments/environment.production.ts`):**
  ```typescript
  export const environment = {
    production: true,
    url: 'https://backendpti.onrender.com'
  };
  ```

---

## 🚀 Despliegue en Firebase Hosting

Para compilar y publicar en producción:

```bash
# 1. Compilar para producción
npm run build

# 2. Desplegar en Firebase
firebase deploy
```

---

## 👤 Autor
- **Tomás Ignacio Peresín**
- **Portfolio:** [frontendpti.web.app](https://frontendpti.web.app)
- **GitHub:** [@TomasPeresin](https://github.com/TomasPeresin)
- **LinkedIn:** [Tomás Peresín](https://www.linkedin.com/in/tomas-peresin-364588213/)
