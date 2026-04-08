# CV Generator (SvelteKit)

Generador de CV **100 % en el cliente**: formulario por pasos, vista previa en vivo, plantillas A4 y descarga en **PDF** (html2canvas + jsPDF). Incluye **PWA**, **i18n** (ES / EN) y, **si quieres**, **Sanity** para marca y textos de la landing.

## Requisitos

- Node.js 18+
- npm

## Configuración (`/.env`)

Copia `.env.example` a `.env` y ajusta:

| Variable | Descripción |
|----------|-------------|
| `PUBLIC_SITE_URL` | URL pública sin barra final (SEO). Ej. `https://tu-dominio.com` |
| `PUBLIC_APP_CREDIT_URL` | (Opcional) Enlace del pie de página |
| `PUBLIC_APP_CREDIT_LABEL` | (Opcional) Texto del enlace |
| `PUBLIC_SANITY_PROJECT_ID` | (Opcional) ID del proyecto Sanity — ver **Sanity** |
| `PUBLIC_SANITY_DATASET` | (Opcional) Dataset, p. ej. `production` |
| `PUBLIC_SANITY_API_VERSION` | (Opcional) Por defecto `2024-01-01` en código |
| `SANITY_READ_TOKEN` | Solo si el dataset **no** es público. No subas valores reales al repo |

**Sanity es opcional:** sin `PUBLIC_SANITY_*`, la app funciona con `cv-messages.*.json` y los colores por defecto en `app.css`. Los datos del CV no se envían a Sanity.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run check
npm run studio   # Studio: instala antes deps en studio/
```

## Sanity (opcional)

En `studio/` tienes el editor para logo, colores y textos (hero, SEO, CTA del paso 4) en **EN / ES**. Pasos:

1. Proyecto en [sanity.io](https://www.sanity.io/), dataset típico `production` y lectura pública (o token en `.env`).
2. **API** → **CORS**: `http://localhost:5173` y tu dominio en producción.
3. `studio/.env` desde `studio/.env.example` → `npm install` y `npm run dev` en `studio/` → **Site settings** → publicar.
4. Raíz: `.env` con `PUBLIC_SANITY_PROJECT_ID` y `PUBLIC_SANITY_DATASET`.

Si Sanity no está configurado o falla la petición, no rompe la app: se siguen los JSON y el CSS por defecto. Detalle: `studio/README.md`. Código: `src/lib/sanity/`, `src/routes/+layout.server.ts`.

## Estructura (SvelteKit)

- `src/routes/+page.svelte` — App principal del CV
- `src/routes/cv/` — Redirección a `/`
- `src/lib/cv/` — Formulario, plantillas, PDF
- `src/lib/pwa/` — PWA
- `src/lib/i18n/` — `cv-messages.*.json`, `/api/locale`
- `src/lib/sanity/` — Cliente CMS (opcional)
- `static/manifest.webmanifest` — PWA

## Idiomas

`src/lib/i18n/cv-messages.es.json` y `cv-messages.en.json`. Con Sanity, el hero / SEO / CTA pueden sobreescribir por idioma (vacío en CMS → se usa el JSON).

## API (`/api/locale`)

`POST /api/locale` con `{ "locale": "es" | "en" }` → cookie `app_locale`.

## Licencia

MIT — ver `LICENSE`.

## Vercel / venta

Checklist breve: `PUBLIC_SITE_URL`, variables Sanity **solo si** usan CMS, CORS en Sanity con la URL del deploy. Sin Sanity, solo `.env` mínimo y deploy.
