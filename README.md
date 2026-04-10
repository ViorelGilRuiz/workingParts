# Portal Incidencias IT

Portal profesional para gestionar partes tecnicos, clientes, equipos y metricas operativas desde una interfaz moderna construida con Next.js 15.

## Que incluye

- Login y registro demo con persistencia local
- Dashboard ejecutivo con KPIs, graficas y timeline
- Modulos de partes, clientes, equipo, incidencias y administracion
- Tema claro/oscuro persistente
- Interfaz minimalista con transiciones suaves y enfoque corporativo
- Preparado para evolucionar a Supabase Auth y persistencia real

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase JS

## Arranque local

1. Instala dependencias:

```bash
npm install
```

2. Crea `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

3. Inicia el entorno de desarrollo:

```bash
npm run dev
```

4. Abre:

```text
http://localhost:3000
```

## Credenciales demo

- Email: `carlos.martin@portalit.es`
- Contrasena: `demo1234`

## Variables de entorno

```env
NEXT_PUBLIC_APP_NAME=Portal Incidencias IT
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_DEFAULT_THEME=dark
NEXT_PUBLIC_COMPANY_NAME=Portal Incidencias
```

## Scripts utiles

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## Estado actual

- `npm run build` validado correctamente
- `npm run typecheck` validado correctamente
- Rutas comprobadas en local:
  - `/`
  - `/login`
  - `/app/dashboard`
  - `/app/partes`

## Despliegue en Netlify

El proyecto ya incluye `netlify.toml` con:

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `20`

Pasos:

1. Conecta el repositorio en Netlify.
2. Configura estas variables de entorno:
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_DEFAULT_THEME`
   - `NEXT_PUBLIC_COMPANY_NAME`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` si activas integracion real
3. Lanza el deploy de produccion.

## Siguientes mejoras recomendadas

- Sustituir la autenticacion demo por Supabase Auth
- Persistir partes y clientes en base de datos real
- Anadir tests E2E
- Activar exportacion real de informes
