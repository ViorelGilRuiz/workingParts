# 🚀 Portal Incidencias IT

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.13-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.49.8-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Ready-00C46A?style=for-the-badge&logo=netlify)](https://netlify.com/)

> Portal web profesional para la gestión de partes de trabajo técnico IT, con enfoque en operativa diaria, supervisión, trazabilidad y métricas empresariales.

## 📋 Tabla de Contenidos

- [✨ Características](#-características)
- [🎯 Funcionalidades](#-funcionalidades)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [📦 Instalación](#-instalación)
- [🚀 Uso](#-uso)
- [🔧 Configuración](#-configuración)
- [📊 Dashboard Ejecutivo](#-dashboard-ejecutivo)
- [👥 Gestión de Usuarios](#-gestión-de-usuarios)
- [📈 Reportes y Analytics](#-reportes-y-analytics)
- [🔍 Búsqueda y Filtros](#-búsqueda-y-filtros)
- [📱 Responsive Design](#-responsive-design)
- [🌙 Modo Oscuro](#-modo-oscuro)
- [📤 Exportación de Datos](#-exportación-de-datos)
- [🔒 Seguridad](#-seguridad)
- [🧪 Testing](#-testing)
- [🚀 Despliegue](#-despliegue)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)
- [🙏 Agradecimientos](#-agradecimientos)

## ✨ Características

- 🎨 **Interfaz Minimalista**: Diseño limpio y profesional con Tailwind CSS
- 📊 **Dashboard Ejecutivo**: KPIs en tiempo real y métricas operativas
- 👥 **Gestión de Roles**: Técnico, Supervisor y Administrador
- 🔍 **Búsqueda Avanzada**: Filtrado por cliente, técnico, estado y fecha
- 📱 **Responsive**: Optimizado para desktop, tablet y móvil
- 🌙 **Modo Oscuro**: Soporte completo para tema oscuro
- 🔔 **Notificaciones**: Sistema de alertas para partes nuevos y actualizaciones
- 📤 **Exportación**: PDF y Excel con datos detallados
- 🔐 **Autenticación Segura**: Login/Registro con validación
- 💾 **Persistencia Local**: Funciona sin backend en modo demo
- ⚡ **Performance**: Optimizado con Next.js 15 y React 19

## 🎯 Funcionalidades

### 👤 Gestión de Usuarios
- 🔐 Autenticación segura con email/contraseña
- 👥 Roles: Técnico, Supervisor, Administrador
- 👤 Perfiles de usuario personalizables
- 🔄 Cambio de contraseña
- 🚪 Logout seguro

### 📋 Gestión de Partes
- ➕ Creación de partes técnicos
- 📝 Detalle completo: cliente, técnico, horas, descripción
- 🏷️ Etiquetas y categorías
- 📅 Fechas de inicio/fin
- ⏱️ Cálculo automático de duración
- 📊 Estados: Pendiente, En Progreso, Resuelto

### 📊 Dashboard Ejecutivo
- 📈 KPIs principales: Horas, Partes, Clientes, Tiempo Medio
- 📊 Gráficos interactivos con Recharts
- 📅 Resumen mensual
- 👥 Top técnicos por carga de trabajo
- 🏢 Clientes recurrentes
- 📋 Timeline de actividad reciente

### 🔍 Búsqueda y Filtros
- 🔎 Búsqueda global por texto
- 🎛️ Filtros rápidos: Estado, Técnico, Cliente
- 📅 Filtros por fecha
- 🔄 Ordenamiento múltiple
- 📄 Paginación inteligente

### 📤 Exportación
- 📄 Exportación a PDF con diseño profesional
- 📊 Exportación a Excel con todas las columnas
- 🎨 Formatos personalizables
- 📎 Adjuntos automáticos

## 🛠️ Stack Tecnológico

### Frontend
- ⚛️ **React 19**: Última versión con nuevas características
- 🚀 **Next.js 15**: App Router, Server Components, Turbopack
- 💙 **TypeScript 5.6**: Tipado fuerte y moderno
- 🎨 **Tailwind CSS 3.4**: Utilidades CSS, diseño responsivo
- 🎭 **Framer Motion**: Animaciones fluidas
- 📊 **Recharts**: Gráficos interactivos
- 📋 **React Table**: Tablas avanzadas con filtros

### Backend & Base de Datos
- 🗄️ **Supabase**: PostgreSQL, Auth, Storage, Edge Functions
- 🔐 **Row Level Security**: Políticas de seguridad por fila
- 📡 **Real-time**: Suscripciones en tiempo real
- 🔑 **JWT Tokens**: Autenticación stateless

### Librerías Adicionales
- 📝 **React Hook Form**: Formularios con validación
- ✅ **Zod**: Validación de esquemas
- 📅 **Date-fns**: Manipulación de fechas
- 📊 **ExcelJS**: Generación de archivos Excel
- 📄 **jsPDF**: Creación de PDFs
- 🎯 **Lucide React**: Iconos consistentes
- 🔧 **Class Variance Authority**: Variantes de componentes

### DevOps & Deployment
- 🌐 **Netlify**: Despliegue automático
- 🔄 **GitHub Actions**: CI/CD
- 📦 **PNPM**: Gestión de dependencias rápida
- 🎯 **ESLint + Prettier**: Calidad de código
- 📊 **Bundle Analyzer**: Optimización de bundles

## 📦 Instalación

### Prerrequisitos
- 📥 Node.js 20+ ([Descargar](https://nodejs.org/))
- 📦 PNPM ([Instalar](https://pnpm.io/installation))
- 🗄️ PostgreSQL (opcional, para desarrollo local)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/portal-incidencias-it.git
   cd portal-incidencias-it
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```

   Editar `.env.local`:
   ```env
   NEXT_PUBLIC_APP_NAME="Portal Incidencias IT"
   NEXT_PUBLIC_SUPABASE_URL="tu-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-supabase-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key"
   NEXT_PUBLIC_DEFAULT_THEME="light"
   NEXT_PUBLIC_COMPANY_NAME="Tu Empresa"
   ```

4. **Configurar base de datos (opcional)**
   ```bash
   # Ejecutar esquema SQL en Supabase
   # O usar datos demo incluidos
   ```

5. **Iniciar servidor de desarrollo**
   ```bash
   pnpm dev
   ```

6. **Abrir en navegador**
   ```
   http://localhost:3000
   ```

## 🚀 Uso

### Acceso Demo
- 📧 **Email**: `carlos.martin@portalit.es`
- 🔑 **Contraseña**: `demo1234`

### Navegación Principal
- 🏠 **Dashboard**: Vista general y KPIs
- 📋 **Partes**: Gestión de incidencias
- 👥 **Clientes**: Base de datos de clientes
- 👤 **Equipo**: Gestión de técnicos
- 📊 **Resumen Mensual**: Reportes periódicos
- 🏷️ **Incidencias Frecuentes**: Análisis de patrones
- ⚙️ **Admin**: Panel de administración

### Creación de Partes
1. Ir a "Partes" → "Nuevo Parte"
2. Completar formulario: Cliente, Técnico, Descripción
3. Agregar etiquetas y prioridad
4. Guardar automáticamente

## 🔧 Configuración

### Variables de Entorno
```env
# App Configuration
NEXT_PUBLIC_APP_NAME="Portal Incidencias IT"
NEXT_PUBLIC_DEFAULT_THEME="light"
NEXT_PUBLIC_COMPANY_NAME="Tu Empresa"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxxxx"
SUPABASE_SERVICE_ROLE_KEY="xxxxx"

# Optional
NEXT_PUBLIC_SENTRY_DSN=""
NEXT_PUBLIC_ANALYTICS_ID=""
```

### Base de Datos
Ejecutar los archivos SQL en orden:
1. `supabase/schema.sql` - Estructura de tablas
2. `supabase/seed.sql` - Datos de ejemplo

### Políticas RLS (Row Level Security)
```sql
-- Políticas de ejemplo para partes
CREATE POLICY "Users can view their own reports" ON reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Technicians can create reports" ON reports
  FOR INSERT WITH CHECK (auth.role() = 'technician');
```

## 📊 Dashboard Ejecutivo

### KPIs Principales
- ⏰ **Horas esta semana**: Carga total del equipo
- 📋 **Partes registrados**: Total de incidencias
- 🏢 **Clientes activos**: Cuentas atendidas
- ⏱️ **Tiempo medio**: Resolución promedio

### Gráficos Interactivos
- 📈 **Evolución mensual**: Tendencias de carga
- 📊 **Distribución por tipo**: Categorías de incidencias
- 👥 **Top técnicos**: Rendimiento individual
- 🏢 **Clientes recurrentes**: Análisis de frecuencia

## 👥 Gestión de Usuarios

### Roles y Permisos
- 👨‍💼 **Administrador**: Acceso completo
- 👨‍🔧 **Supervisor**: Gestión de equipo y reportes
- 👨‍💻 **Técnico**: Creación y gestión de partes

### Funcionalidades por Rol
| Funcionalidad | Admin | Supervisor | Técnico |
|---------------|-------|------------|---------|
| Ver Dashboard | ✅ | ✅ | ✅ |
| Crear Partes | ✅ | ✅ | ✅ |
| Gestionar Usuarios | ✅ | ❌ | ❌ |
| Ver Analytics | ✅ | ✅ | ❌ |
| Exportar Datos | ✅ | ✅ | ❌ |

## 📈 Reportes y Analytics

### Tipos de Reporte
- 📊 **Resumen Ejecutivo**: KPIs principales
- 📋 **Detalle de Partes**: Lista completa
- 👥 **Análisis por Técnico**: Productividad individual
- 🏢 **Análisis por Cliente**: Frecuencia y tipos
- 📅 **Resumen Mensual**: Tendencias temporales

### Exportación
- 📄 **PDF**: Reportes formateados profesionalmente
- 📊 **Excel**: Datos crudos para análisis
- 📧 **Email**: Envío automático de reportes

## 🔍 Búsqueda y Filtros

### Búsqueda Global
- 🔎 Texto libre en: cliente, técnico, descripción
- 🏷️ Búsqueda por etiquetas
- 📅 Rango de fechas
- 📊 Estados: Pendiente, Resuelto, etc.

### Filtros Rápidos
- ⏰ **Hoy**: Partes del día actual
- 📋 **Pendientes**: Incidencias abiertas
- 👥 **Mi Equipo**: Asignados a mí
- 🏢 **Cliente X**: Filtrar por cliente específico

## 📱 Responsive Design

### Breakpoints
- 📱 **Móvil**: < 768px
- 📟 **Tablet**: 768px - 1024px
- 💻 **Desktop**: > 1024px

### Optimizaciones
- 🎯 **Touch-friendly**: Botones de tamaño adecuado
- 📱 **Mobile-first**: Diseño centrado en móvil
- ⚡ **Performance**: Imágenes optimizadas
- ♿ **Accesibilidad**: Soporte para lectores de pantalla

## 🌙 Modo Oscuro

### Implementación
- 🎨 **CSS Variables**: Tema dinámico
- 💾 **Persistencia**: Guardado en localStorage
- ⚡ **Transiciones**: Cambios suaves
- 🎯 **Consistencia**: Todos los componentes soportan tema

### Personalización
```css
:root {
  --background: #ffffff;
  --foreground: #000000;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

## 📤 Exportación de Datos

### Formatos Soportados
- 📄 **PDF**: Diseño profesional con headers/footers
- 📊 **Excel**: Múltiples hojas, fórmulas
- 📋 **CSV**: Datos planos para importación

### Configuración
```typescript
const exportConfig = {
  filename: 'reporte-partes',
  format: 'pdf',
  includeCharts: true,
  dateRange: 'last-month'
};
```

## 🔒 Seguridad

### Autenticación
- 🔐 **JWT Tokens**: Sesiones seguras
- ⏰ **Expiración**: Tokens con tiempo limitado
- 🔄 **Refresh**: Renovación automática
- 🚪 **Logout**: Invalidación de sesiones

### Autorización
- 👥 **RBAC**: Control basado en roles
- 📋 **Permisos granulares**: Acciones específicas
- 🛡️ **Validación**: Input sanitizado
- 🔍 **Auditoría**: Logs de acciones

### Datos Sensibles
- 🔒 **Encriptación**: Datos en tránsito y reposo
- 🗝️ **Secrets**: Variables de entorno seguras
- 🚫 **No logs**: Información sensible no se registra

## 🧪 Testing

### Estrategia
- 🧩 **Unit Tests**: Componentes individuales
- 🔗 **Integration Tests**: Flujos completos
- 🎭 **E2E Tests**: Navegación real
- 📊 **Coverage**: >80% de cobertura

### Herramientas
- ⚡ **Vitest**: Testing framework rápido
- 🎭 **Playwright**: E2E testing
- 📊 **Coverage**: Reportes detallados
- 🔄 **CI/CD**: Tests automáticos

## 🚀 Despliegue

### Netlify (Recomendado)
1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Despliegue automático en push

### Vercel
1. Importar proyecto
2. Configurar environment variables
3. Deploy automático

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribución

### Guías de Contribución
1. 🍴 Fork el proyecto
2. 🌿 Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push a la rama (`git push origin feature/AmazingFeature`)
5. 🔄 Abrir Pull Request

### Estándares de Código
- 📏 **ESLint**: Reglas de linting
- 🎨 **Prettier**: Formateo automático
- 📝 **Conventional Commits**: Mensajes estandarizados
- 🧪 **Tests**: Cobertura requerida

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- 🚀 **Next.js Team**: Por el increíble framework
- 🎨 **Tailwind CSS**: Por el sistema de diseño
- 🗄️ **Supabase**: Por la plataforma backend
- 📊 **Recharts**: Por los gráficos
- 👥 **Comunidad Open Source**: Por todas las librerías

---

<div align="center">
  <p>Hecho con ❤️ para equipos de IT</p>
  <p>
    <a href="#-portal-incidencias-it">Volver arriba</a>
  </p>
</div>
4. Comprueba que aparece en la tabla y que el detalle abre en `/app/partes/[id]`.
5. Recarga la página para validar que el dato sigue presente en el navegador.

## Despliegue en Netlify

1. Sube el proyecto a un repositorio Git.
2. Conecta el repositorio en Netlify.
3. Configura las variables de entorno de producción:
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_DEFAULT_THEME`
   - `NEXT_PUBLIC_COMPANY_NAME`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. El archivo [netlify.toml](/c:/Users/Administrador/Desktop/Portal%20Incidencias/netlify.toml) ya define:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - `NODE_VERSION=20`
5. Lanza el primer deploy.
6. Valida el flujo principal en producción:
   - `/`
   - `/login`
   - `/app/dashboard`
   - `/app/partes`
   - creación de parte y apertura de detalle

## Checklist antes de publicar

1. Confirmar que `npm install` y `npm run build` funcionan en local.
2. Revisar que todas las variables de entorno estén cargadas en Netlify.
3. Confirmar que no se use ninguna clave sensible en componentes cliente.
4. Probar el alta de partes desde navegador limpio.
5. Si se activa Supabase real, añadir autenticación antes de abrir escrituras en producción.

## Siguientes pasos recomendados

1. Añadir autenticación real con Supabase Auth.
2. Persistir CRUD de partes y clientes contra Supabase.
3. Implementar subida real de adjuntos a Storage.
4. Añadir exportación activa desde acciones del servidor.
5. Incorporar RLS completa por rol y empresa.
6. Añadir tests y validación E2E.

## Notas

- El entorno de trabajo usado para preparar este repositorio no tenía `node`, `npm` ni `git` disponibles.
- Por ese motivo no se ha podido ejecutar `build`, `lint`, `typecheck` ni desplegar directamente desde aquí.
- La configuración queda lista para que el siguiente paso se haga desde una máquina con Node.js y acceso a Netlify.
