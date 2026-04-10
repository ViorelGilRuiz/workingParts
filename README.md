# WorkingParts

WorkingParts es un portal premium para servicio tecnico, partes de trabajo, clientes, supervision y facturacion ligera construido con `Next.js 15`.

## Estado del producto

La aplicacion ya esta preparada para una evolucion seria:

- autenticacion local de desarrollo
- login con Google via `Supabase Auth` listo para produccion
- rutas privadas protegidas
- base de clientes vacia real
- tickets y partes con firma digital
- exportacion PDF tipo factura
- dashboard, equipo, administracion y resumen mensual
- capa de datos desacoplada para migrar de `localStorage` a backend real
- configuracion lista para `Netlify`

## Stack

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `Framer Motion`
- `Supabase Auth`
- `ExcelJS`
- `jsPDF`
- `Recharts`
- `Zod`

## Arquitectura actual

### Frontend

- `src/app`: App Router y pantallas
- `src/components`: UI, layout, providers y modulos de negocio
- `src/lib`: utilidades, auth, datos, exportacion y configuracion

### Auth

- modo local para desarrollo y fallback
- modo cloud con `Supabase Auth + Google OAuth`
- `middleware.ts` para proteger `/app/*`
- callback OAuth en `src/app/auth/callback/route.ts`
- resolucion de roles basica desde metadata o listas de emails

### Datos

- proveedor de dominio en `src/components/providers/reports-provider.tsx`
- repositorio desacoplado en `src/lib/data`
- implementacion actual: `local-browser`
- preparada para siguiente adapter `supabase` o `postgres`

## Variables de entorno

Usa `.env.local`:

```env
NEXT_PUBLIC_APP_NAME=WorkingParts
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_DEFAULT_THEME=dark
NEXT_PUBLIC_COMPANY_NAME=Ibersoft
NEXT_PUBLIC_DEFAULT_ROLE=technician
WORKINGPARTS_ADMIN_EMAILS=admin@ibersoft.es
WORKINGPARTS_SUPERVISOR_EMAILS=supervisor@ibersoft.es
```

## Google Login con Supabase

### 1. Crear proveedor Google

En Google Cloud:

1. Crea un `OAuth Client ID`.
2. Añade como `Authorized redirect URI`:

```text
http://127.0.0.1:3000/auth/callback
https://TU-SITIO.netlify.app/auth/callback
```

### 2. Configurar Supabase Auth

En Supabase:

1. Activa `Google` en `Authentication > Providers`.
2. Pega el `Client ID` y `Client Secret`.
3. Define `Site URL`:

```text
http://127.0.0.1:3000
```

o en produccion:

```text
https://TU-SITIO.netlify.app
```

4. Añade `Redirect URLs`:

```text
http://127.0.0.1:3000/auth/callback
https://TU-SITIO.netlify.app/auth/callback
```

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir:

```text
http://127.0.0.1:3000
```

## Validacion

```bash
npm run typecheck
npm run build
```

## Despliegue en Netlify

### Configuracion del sitio

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `20`

El proyecto ya incluye:

- `netlify.toml`
- `@netlify/plugin-nextjs`
- middleware compatible con rutas privadas

### Variables en Netlify

Configura estas variables:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_DEFAULT_THEME`
- `NEXT_PUBLIC_COMPANY_NAME`
- `NEXT_PUBLIC_DEFAULT_ROLE`
- `WORKINGPARTS_ADMIN_EMAILS`
- `WORKINGPARTS_SUPERVISOR_EMAILS`

Para `NEXT_PUBLIC_SITE_URL` usa la URL final de Netlify, por ejemplo:

```text
https://workingparts.netlify.app
```

## Flujo actual del producto

1. El usuario accede por `/login`.
2. Puede autenticarse por Google si Supabase esta configurado.
3. Entra a `/app/dashboard`.
4. Crea clientes manualmente.
5. Registra tickets y partes.
6. Firma digitalmente el parte.
7. Exporta PDF tipo factura.
8. El supervisor revisa historico, actividad y resumen mensual.

## Escalado a Supabase o Postgres

La base ya esta preparada para crecer sin reescribir toda la app.

### Paso siguiente recomendado

1. Crear tablas reales para:
   - `profiles`
   - `clients`
   - `work_reports`
   - `report_audit_log`
   - `attachments`
2. Sustituir el adapter de `src/lib/data/local-browser-repository.ts` por uno `supabase`.
3. Mover roles a `profiles.role`.
4. Guardar firmas en `storage` o bucket privado.
5. Generar PDFs en servidor o edge function cuando necesites trazabilidad completa.

### Modelo objetivo

- `auth.users` para identidad
- `profiles` para rol, avatar y empresa
- `clients` para cartera
- `work_reports` para partes
- `report_events` para auditoria
- `invoices` para facturacion futura

## Roadmap recomendado

### Alto impacto inmediato

- persistencia real en Supabase
- tabla de auditoria de cambios
- panel de facturacion por cliente
- asignacion de tecnico responsable
- busqueda global conectada a datos reales

### Siguiente fase

- materiales y costes por parte
- recordatorios y follow-ups
- adjuntos reales en storage
- invitaciones por email
- permisos finos por rol
- CRM ligero para clientes

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```
