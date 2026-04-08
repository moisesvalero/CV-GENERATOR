import { fetchSiteSettings } from '$lib/sanity/fetch-site-settings';
import type { LayoutServerLoad } from './$types';

/** Loads CMS branding and copy when Sanity is configured; otherwise `siteSettings` is null. */
export const load: LayoutServerLoad = async () => {
	const siteSettings = await fetchSiteSettings();
	return { siteSettings };
};
