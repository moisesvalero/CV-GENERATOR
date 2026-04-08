import {
	DEFAULT_LOCALE,
	SUPPORTED_LOCALES,
	isUiLocale,
	type UiLocale
} from './locales';

/** Locale type persisted when using the optional `/api/locale` cookie endpoint. */
export type AppLocale = UiLocale;

export const APP_LOCALES: AppLocale[] = [...SUPPORTED_LOCALES];

/** SvelteKit `depends()` key if you later load locale from cookies in `load`. */
export const LOCALE_LOAD_DEPENDENCY = 'app:locale' as const;

/** HttpOnly cookie name for server-side locale preference (optional; UI uses `localStorage` today). */
export const APP_LOCALE_COOKIE = 'app_locale';

export function parseAppLocaleCookie(value: string | null | undefined): AppLocale | null {
	if (!value) return null;
	const v = value.trim().toLowerCase();
	return isUiLocale(v) ? v : null;
}

export function resolveAppLocale(cookieValue: string | null | undefined): AppLocale {
	return parseAppLocaleCookie(cookieValue) ?? DEFAULT_LOCALE;
}
