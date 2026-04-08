import {
	DEFAULT_LOCALE,
	SUPPORTED_LOCALES,
	isUiLocale,
	type UiLocale
} from './locales';

export type SiteLocale = UiLocale;

export const SITE_LOCALES: SiteLocale[] = [...SUPPORTED_LOCALES];
export const LOCALE_LOAD_DEPENDENCY = 'app:locale' as const;
export const PORTFOLIO_LOCALE_COOKIE = 'portfolio_locale';

export function parseSiteLocaleCookie(value: string | null | undefined): SiteLocale | null {
	if (!value) return null;
	const v = value.trim().toLowerCase();
	return isUiLocale(v) ? v : null;
}

export function resolveSiteLocale(cookieValue: string | null | undefined): SiteLocale {
	return parseSiteLocaleCookie(cookieValue) ?? DEFAULT_LOCALE;
}
