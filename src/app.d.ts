// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { PublicSiteSettings } from '$lib/sanity/types';

declare global {
	namespace App {
		interface Error {
			message: string;
		}
		// interface Locals {}
		interface LayoutData {
			siteSettings: PublicSiteSettings | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_SITE_URL?: string;
		/** Optional footer link URL (e.g. your site or profile). */
		PUBLIC_APP_CREDIT_URL?: string;
		/** Label shown for `PUBLIC_APP_CREDIT_URL` in the footer. */
		PUBLIC_APP_CREDIT_LABEL?: string;
		/** Sanity project ID (optional; enables CMS). */
		PUBLIC_SANITY_PROJECT_ID?: string;
		/** Sanity dataset, e.g. production. */
		PUBLIC_SANITY_DATASET?: string;
		/** Sanity API version (defaults to 2024-01-01 in code if unset). */
		PUBLIC_SANITY_API_VERSION?: string;
	};
}

declare module '$env/dynamic/private' {
	export const env: {
		/** Read token if the dataset is not public. */
		SANITY_READ_TOKEN?: string;
	};
}

export {};
