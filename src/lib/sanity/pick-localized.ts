import type { UiLocale } from '$lib/i18n/locales';
import type { LocalizedString } from './types';

/**
 * Picks the best string for the active UI language, then falls back to the other locale.
 */
export function pickLocalized(
	field: LocalizedString | null | undefined,
	locale: UiLocale
): string | null {
	if (!field) return null;
	const primary = locale === 'es' ? field.es?.trim() : field.en?.trim();
	const secondary = locale === 'es' ? field.en?.trim() : field.es?.trim();
	return primary || secondary || null;
}
