/// <reference lib="webworker" />

/**
 * PWA service worker: precaches build + static files only.
 * HTML navigations are always network-first so users never get a stuck blank or stale shell.
 * Only immutable assets under `/_app/` and precached paths get cache-first after being stored.
 */
import { build, files, version } from '$service-worker';

const CACHE = `cv-generator-${version}`;
const ASSETS = new Set<string>([...build, ...files]);

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);
			await cache.addAll([...ASSETS]);
		})()
	);
	void (self as ServiceWorkerGlobalScope).skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
			await (self as unknown as ServiceWorkerGlobalScope).clients.claim();
		})()
	);
});

function cacheableImmutable(url: URL): boolean {
	if (url.origin !== self.location.origin) return false;
	return url.pathname.startsWith('/_app/') || ASSETS.has(url.pathname);
}

self.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;

	/* Full page loads: never serve a cached document first (avoids blank / broken shells). */
	if (req.mode === 'navigate' || req.destination === 'document') {
		event.respondWith(
			(async () => {
				try {
					return await fetch(req);
				} catch {
					const cache = await caches.open(CACHE);
					return (await cache.match('/')) ?? new Response('Offline', { status: 503 });
				}
			})()
		);
		return;
	}

	event.respondWith(
		(async () => {
			const url = new URL(req.url);
			const cache = await caches.open(CACHE);

			if (cacheableImmutable(url)) {
				const hit = await cache.match(req);
				if (hit) return hit;
			}

			try {
				const res = await fetch(req);
				if (res.ok && cacheableImmutable(url)) {
					cache.put(req, res.clone());
				}
				return res;
			} catch {
				const hit = await cache.match(req);
				return hit ?? new Response('Offline', { status: 503 });
			}
		})()
	);
});
