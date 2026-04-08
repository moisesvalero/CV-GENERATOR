/**
 * Single source of truth for UI languages.
 * To add a locale: append its code here, add `cv-messages.<code>.json`, and register it in `index.ts`.
 */
export const SUPPORTED_LOCALES = ['es', 'en'] as const;

export type UiLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: UiLocale = 'es';

export const LOCALE_LABELS: Record<UiLocale, string> = {
	es: 'Español',
	en: 'English'
};

export function isUiLocale(value: string): value is UiLocale {
	return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function normalizeUiLocale(value: string | null | undefined): UiLocale {
	if (!value) return DEFAULT_LOCALE;
	const v = value.trim().toLowerCase();
	if (isUiLocale(v)) return v;

	const short = v.split('-')[0] ?? v;
	if (isUiLocale(short)) return short;

	return DEFAULT_LOCALE;
}

/** Pick the first supported locale that matches the browser language (e.g. `fr-CA` → `fr` once you add `fr`). */
export function resolveLocaleFromNavigator(navLanguages: string | undefined): UiLocale {
	if (!navLanguages) return DEFAULT_LOCALE;
	const lower = navLanguages.toLowerCase();
	for (const supported of SUPPORTED_LOCALES) {
		if (lower.startsWith(supported)) return supported;
	}
	return DEFAULT_LOCALE;
}
