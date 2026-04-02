/// <reference lib="webworker" />

// Service worker sencillo para PWA (cache-first para assets del build)
import { build, files, version } from '$service-worker';

const CACHE = `cv-generator-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);
			await cache.addAll(ASSETS);
		})()
	);
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

self.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);
			const cached = await cache.match(req);
			if (cached) return cached;

			try {
				const res = await fetch(req);
				// Cacheamos solo same-origin y respuestas “ok”
				const url = new URL(req.url);
				if (url.origin === self.location.origin && res.ok) {
					cache.put(req, res.clone());
				}
				return res;
			} catch {
				// Fallback: si existe una versión cacheada del index, úsala.
				return (await cache.match('/')) ?? cached ?? new Response('Offline', { status: 503 });
			}
		})()
	);
});

