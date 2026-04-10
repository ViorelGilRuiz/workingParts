# Ibersoft Portal IT

Portal premium para soporte IT, tickets, clientes, supervision y facturacion ligera construido con `Next.js 15`.

## Vision

Esta aplicacion esta pensada para un flujo real de empresa:

- El tecnico registra tickets y partes de trabajo de forma rapida.
- El cliente puede validar el servicio con firma digital.
- El jefe consulta historico, carga del equipo, horas y actividad.
- Administracion dispone de una base elegante para exportar PDF y preparar facturacion.

La base de datos local arranca vacia en clientes y tickets para evitar demos falsas y permitir empezar desde cero.

## Lo que ya incluye

- Login visual premium con identidad `Ibersoft`
- Menu lateral grande, ordenado y minimalista
- Dashboard limpio con estados vacios elegantes
- Alta manual de clientes
- Flujo de tickets con plantillas tecnicas reutilizables
- Historico visual de tickets
- Tabla de tickets con filtros
- Detalle de parte con firma digital
- Exportacion de PDF tipo factura
- Exportacion de resumen en PDF y Excel
- Vistas para equipo, administracion, patrones e historico mensual
- Tema claro/oscuro persistente

## Stack

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `Framer Motion`
- `Recharts`
- `ExcelJS`
- `jsPDF`

## Arranque local

```bash
npm install
npm run dev
```

Produccion local:

```bash
npm run build
npm run start
```

Abrir en navegador:

```text
http://localhost:3000
```

## Credenciales demo de acceso

El portal mantiene usuarios demo solo para autenticacion local:

- `carlos.martin@ibersoft.es` / `demo1234`
- `lucia@ibersoft.es` / `demo1235`
- `diego@ibersoft.es` / `demo1236`
- `sara@ibersoft.es` / `demo1237`

Clientes y tickets no vienen precargados.

## Flujo recomendado

1. Entrar al portal.
2. Crear los primeros clientes en `Clientes`.
3. Registrar tickets en `Tickets y partes`.
4. Firmar el parte desde el detalle.
5. Exportar el PDF tipo factura.
6. Consultar dashboard, historico y resumen mensual.

## Scripts utiles

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## Estructura funcional

- `src/app/login`: acceso visual y registro local
- `src/app/app/dashboard`: centro ejecutivo y onboarding
- `src/app/app/partes`: flujo principal de tickets
- `src/app/app/clientes`: alta manual y cartera
- `src/app/app/partes/[id]`: detalle, firma y PDF premium
- `src/app/app/resumen-mensual`: control de horas y facturacion
- `src/app/app/admin`: estructura y crecimiento del backoffice

## Validacion recomendada antes de desplegar

```bash
npm run typecheck
npm run build
```

## Despliegue en Netlify

El proyecto esta preparado para compilar con:

```bash
npm run build
```

Variables utiles:

```env
NEXT_PUBLIC_APP_NAME=Ibersoft Portal IT
NEXT_PUBLIC_DEFAULT_THEME=dark
NEXT_PUBLIC_COMPANY_NAME=Ibersoft
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Siguientes mejoras naturales

- Persistencia real en Supabase o Postgres
- Envio real de facturas por email
- Calendario de visitas y mantenimientos
- Control de cobros pendientes
- Roles y permisos conectados a backend
- KPI avanzados por tecnico y cliente
