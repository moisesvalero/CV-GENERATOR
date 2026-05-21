import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { APP_LOCALE_COOKIE, type AppLocale } from '$lib/i18n/app-locale';
import { dev } from '$app/environment';
import { isUiLocale, SUPPORTED_LOCALES } from '$lib/i18n/locales';

/**
 * POST /api/locale — optional server-side locale preference.
 * Sets an HttpOnly cookie so a future SSR layer could read language without exposing it to JS.
 * The main CV UI still uses the client `locale` store + `localStorage` via `setLocale()`.
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const origin = request.headers.get('origin');
	if (origin && origin !== new URL(request.url).origin) {
		throw error(403, 'Cross-origin locale updates are not allowed');
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}
	const loc = (body as { locale?: string })?.locale;
	if (!loc || !isUiLocale(loc)) {
		throw error(400, `locale must be one of: ${SUPPORTED_LOCALES.join(', ')}`);
	}
	const locale = loc as AppLocale;
	cookies.set(APP_LOCALE_COOKIE, locale, {
		path: '/',
		maxAge: 60 * 60 * 24 * 365,
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev
	});
	return json({ ok: true, locale });
};
