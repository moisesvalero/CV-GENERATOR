<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { browser } from '$app/environment';

	let {
		data,
		children
	}: {
		data: import('./$types').LayoutData;
		children: Snippet;
	} = $props();

	/** PWA / mobile browser chrome; prefers explicit theme color, then primary accent. */
	const themeColor = $derived(
		data.siteSettings?.themeColor ??
			data.siteSettings?.primaryColor ??
			'#f97316'
	);

	/**
	 * Pushes Sanity-driven palette to the document root so all components can use
	 * `var(--site-primary)` / `var(--site-gradient-end)` / `var(--site-accent-text)` with CSS fallbacks.
	 */
	$effect(() => {
		if (!browser) return;
		const r = document.documentElement;
		const s = data.siteSettings;
		if (!s) {
			r.style.removeProperty('--site-primary');
			r.style.removeProperty('--site-gradient-end');
			r.style.removeProperty('--site-accent-text');
			return;
		}
		if (s.primaryColor) r.style.setProperty('--site-primary', s.primaryColor);
		else r.style.removeProperty('--site-primary');
		if (s.gradientEndColor) r.style.setProperty('--site-gradient-end', s.gradientEndColor);
		else r.style.removeProperty('--site-gradient-end');
		if (s.accentTextColor) r.style.setProperty('--site-accent-text', s.accentTextColor);
		else r.style.removeProperty('--site-accent-text');
	});
</script>

<svelte:head>
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="theme-color" content={themeColor} />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
</svelte:head>

{@render children()}
