/**
 * Registro central de idiomas de la app.
 * Para añadir uno nuevo: inclúyelo en SUPPORTED_LOCALES, crea `cv-messages.<codigo>.json`
 * e impórtalo y fusiónalo en `index.ts` (igual que es/en).
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

/** Coincide prefijo BCP-47 (p. ej. fr-CA → fr) con el primer locale soportado. */
export function resolveLocaleFromNavigator(navLanguages: string | undefined): UiLocale {
	if (!navLanguages) return DEFAULT_LOCALE;
	const lower = navLanguages.toLowerCase();
	for (const supported of SUPPORTED_LOCALES) {
		if (lower.startsWith(supported)) return supported;
	}
	return DEFAULT_LOCALE;
}
