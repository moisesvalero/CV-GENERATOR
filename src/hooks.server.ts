import type { Handle } from '@sveltejs/kit';

const securityHeaders: Record<string, string> = {
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

const csp = [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"frame-ancestors 'none'",
	"img-src 'self' data: blob: https:",
	"font-src 'self' data: https://fonts.gstatic.com",
	"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
	"script-src 'self' 'unsafe-inline' https://vercel.live",
	"script-src-elem 'self' 'unsafe-inline' https://vercel.live",
	"connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io https://vercel.live https://*.vercel.live",
	"frame-src https://vercel.live"
].join('; ');

function isHtml(response: Response) {
	return response.headers.get('Content-Type')?.toLowerCase().includes('text/html') ?? false;
}

function isMarkdown(response: Response) {
	return response.headers.get('Content-Type')?.toLowerCase().includes('text/markdown') ?? false;
}

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	for (const [name, value] of Object.entries(securityHeaders)) {
		response.headers.set(name, value);
	}

	if (isHtml(response)) {
		response.headers.set('Content-Security-Policy', csp);
	}

	if (isMarkdown(response)) {
		response.headers.set('Content-Type', 'text/markdown; charset=utf-8');
		response.headers.append('Vary', 'Accept');
		response.headers.set('X-AEO-Version', '1.0');
		response.headers.set('X-Robots-Tag', 'noindex');
	}

	return response;
};
