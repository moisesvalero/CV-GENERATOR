import { writable, derived, get } from 'svelte/store';
import cvEn from './cv-messages.en.json';
import cvEs from './cv-messages.es.json';
import {
	DEFAULT_LOCALE,
	normalizeUiLocale,
	resolveLocaleFromNavigator,
	type UiLocale
} from './locales';

type Json = Record<string, unknown>;

/**
 * All UI strings for this app live in `cv-messages.<locale>.json`.
 * To add a language: create `cv-messages.<code>.json`, extend `SUPPORTED_LOCALES`, and add an entry here.
 */
const translations: Record<UiLocale, Json> = {
	es: cvEs as Json,
	en: cvEn as Json
};

function lookupKey(obj: unknown, keys: string[]): unknown {
	let value: unknown = obj;
	for (const k of keys) {
		if (value == null || typeof value !== 'object') return undefined;
		value = (value as Record<string, unknown>)[k];
	}
	return value;
}

function translate(locale: UiLocale, key: string): string {
	const keys = key.split('.');
	let value = lookupKey(translations[locale], keys);
	if (typeof value === 'string') return value;

	if (locale !== DEFAULT_LOCALE) {
		value = lookupKey(translations[DEFAULT_LOCALE], keys);
		if (typeof value === 'string') return value;
	}
	if (locale !== 'en' && DEFAULT_LOCALE !== 'en') {
		value = lookupKey(translations.en, keys);
		if (typeof value === 'string') return value;
	}

	return key;
}

/** Replaces `{{name}}`-style placeholders in translation strings. */
export function translateParams(locale: UiLocale, key: string, params: Record<string, string>): string {
	let s = translate(locale, key);
	for (const [k, v] of Object.entries(params)) {
		s = s.replaceAll(`{{${k}}}`, v);
	}
	return s;
}

const defaultLang = (() => {
	if (typeof window === 'undefined') return DEFAULT_LOCALE;

	const saved = localStorage.getItem('lang');
	const hasManualSelection = localStorage.getItem('lang_manual') === '1';

	if (hasManualSelection && saved) {
		return normalizeUiLocale(saved);
	}

	return resolveLocaleFromNavigator(navigator.language || undefined);
})();

export const locale = writable<UiLocale>(defaultLang);

if (typeof document !== 'undefined') {
	document.documentElement.lang = defaultLang;
}

export const t = derived(locale, ($locale) => {
	return (key: string) => translate($locale, key);
});

/** Use when you need `t` inside a plain TS function (outside Svelte markup). */
export function getTranslator(): (key: string) => string {
	const loc = get(locale);
	return (key: string) => translate(loc, key);
}

/** @param lang BCP-47 or short locale code (e.g. `es`, `en`) */
export function setLocale(lang: string) {
	const normalized = normalizeUiLocale(lang);
	locale.set(normalized);
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('lang', normalized);
		localStorage.setItem('lang_manual', '1');
	}
	if (typeof document !== 'undefined') {
		document.documentElement.lang = normalized;
	}
}
