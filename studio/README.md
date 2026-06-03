# Sanity Studio (optional)

Use this to edit site name, logo, colors, and landing copy without changing code. The Svelte app reads content when `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` are set in the root `.env`.

1. Create a project at [sanity.io](https://www.sanity.io/).
2. Copy `.env.example` to `.env` and set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`.
3. In the Sanity project, add **CORS origins**: `http://localhost:5173` and your production URL.
4. Prefer a **public** dataset for reads, or set `SANITY_READ_TOKEN` in the **root** app `.env` (not here).
5. Run `pnpm install`, then `pnpm run dev`, open **Site settings**, publish the singleton (`siteSettings`).
6. Copy the same project ID and dataset into the repo root `.env` as `PUBLIC_SANITY_*`.
