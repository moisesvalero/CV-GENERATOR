import { fetchSiteSettings } from '$lib/sanity/fetch-site-settings';
import { env } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';

/** Loads CMS branding and copy when Sanity is configured; otherwise `siteSettings` is null. */
export const load: LayoutServerLoad = async () => {
	const siteSettings = await fetchSiteSettings();
	const footerCreditUrl = env.PUBLIC_APP_CREDIT_URL?.trim() || null;
	const footerCreditLabel = env.PUBLIC_APP_CREDIT_LABEL?.trim() || null;

	return { siteSettings, footerCreditUrl, footerCreditLabel };
};
