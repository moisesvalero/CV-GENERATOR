<script lang="ts">
	import { get } from 'svelte/store';
	import { pickLocalized } from '$lib/sanity/pick-localized';
	import CVPreview from '$lib/cv/CVPreview.svelte';
	import DownloadButton from '$lib/cv/DownloadButton.svelte';
	import ImportLinkedIn from '$lib/cv/ImportLinkedIn.svelte';
	import FormStep1 from '$lib/cv/FormStep1.svelte';
	import FormStep2 from '$lib/cv/FormStep2.svelte';
	import FormStep3 from '$lib/cv/FormStep3.svelte';
	import FormStep4 from '$lib/cv/FormStep4.svelte';
	import InstallPrompt from '$lib/pwa/InstallPrompt.svelte';
	import { cvData, currentStep, setStep } from '$lib/cv/store.svelte';
	import { locale, setLocale, t } from '$lib/i18n';
	import { LOCALE_LABELS, SUPPORTED_LOCALES } from '$lib/i18n/locales';

	let { data } = $props();

	const pageTitle = $derived.by(() => {
		const loc = get(locale);
		return pickLocalized(data.siteSettings?.metaTitle, loc) ?? get(t)('cv.meta.title');
	});
	const pageDescription = $derived.by(() => {
		const loc = get(locale);
		return pickLocalized(data.siteSettings?.metaDescription, loc) ?? get(t)('cv.meta.description');
	});

	const steps = $derived.by(() => {
		get(locale);
		const tr = get(t);
		return [
			{ n: 1, label: tr('cv.steps.personal') },
			{ n: 2, label: tr('cv.steps.experience') },
			{ n: 3, label: tr('cv.steps.education') },
			{ n: 4, label: tr('cv.steps.skills') }
		];
	});

	let showPreviewDrawer = $state(false);
	const currentStepNumber = $derived(currentStep.value);

	function goPrev() {
		if (currentStep.value > 1) setStep(currentStep.value - 1);
	}

	function goNext() {
		if (currentStep.value < 4) setStep(currentStep.value + 1);
	}

	function buildGoogleFontsUrl(titlesFont: string, bodyFont: string) {
		const normalizeFamily = (f: string) => encodeURIComponent(f.trim()).replace(/%20/g, '+');
		return `https://fonts.googleapis.com/css2?family=${normalizeFamily(titlesFont)}:wght@400;700&family=${normalizeFamily(bodyFont)}:wght@400;500&display=swap`;
	}

	$effect(() => {
		if (typeof document === 'undefined') return;
		const titles = cvData.fuenteTitulos;
		const body = cvData.fuenteCuerpo;
		if (!titles || !body) return;

		const href = buildGoogleFontsUrl(titles, body);
		const id = 'cv-google-fonts';

		let linkEl = document.getElementById(id) as HTMLLinkElement | null;
		if (!linkEl) {
			linkEl = document.createElement('link');
			linkEl.id = id;
			linkEl.rel = 'stylesheet';
			document.head.appendChild(linkEl);
		}

		if (linkEl.href !== href) linkEl.href = href;
	});

	$effect(() => {
		if (typeof document === 'undefined' || typeof window === 'undefined') return;
		if (window.innerWidth > 768) return;

		const html = document.documentElement;
		const body = document.body;
		const prevHtmlOverflow = html.style.overflow;
		const prevBodyOverflow = body.style.overflow;
		const prevBodyTouchAction = body.style.touchAction;

		if (showPreviewDrawer) {
			html.style.overflow = 'hidden';
			body.style.overflow = 'hidden';
			body.style.touchAction = 'none';
		}

		return () => {
			html.style.overflow = prevHtmlOverflow;
			body.style.overflow = prevBodyOverflow;
			body.style.touchAction = prevBodyTouchAction;
		};
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="page">
	<header class="topbar">
		<div class="topbarInner">
			<div class="brand">
				<div class="brandMark" aria-hidden="true">CV</div>
				<span class="brandName">generator</span>
			</div>
			<div class="topbarRight">
				<div class="langSwitcher" role="group" aria-label={$t('cv.langSwitcher.aria')}>
					{#each SUPPORTED_LOCALES as loc (loc)}
						<button
							type="button"
							class="langBtn"
							class:active={$locale === loc}
							onclick={() => setLocale(loc)}
						>
							{LOCALE_LABELS[loc]}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</header>

	<InstallPrompt />

	<div class="workspace">
		<div class="editorCol">
			<div class="progress">
				{#each steps as s}
					<button
						type="button"
						class="stepPill"
						class:active={currentStepNumber === s.n}
						class:completed={currentStepNumber > s.n}
						aria-current={currentStepNumber === s.n ? 'step' : undefined}
						onclick={() => setStep(s.n)}
					>
						<div class="stepNum">{s.n}</div>
						<div class="stepLabel">{s.label}</div>
					</button>
				{/each}
			</div>

			<ImportLinkedIn />

			<div class="formCard">
				{#if currentStepNumber === 1}
					<FormStep1 />
				{:else if currentStepNumber === 2}
					<FormStep2 />
				{:else if currentStepNumber === 3}
					<FormStep3 />
				{:else}
					<FormStep4 />
				{/if}
			</div>

			<div class="navRow">
				<button class="navBtn" type="button" onclick={goPrev} disabled={currentStepNumber === 1}>
					{$t('cv.nav.prev')}
				</button>

				{#if currentStepNumber < 4}
					<button class="navBtn primary" type="button" onclick={goNext}>
						{$t('cv.nav.next')}
					</button>
				{:else}
					<div class="navRight">
						<DownloadButton label={$t('cv.nav.downloadFinal')} />
					</div>
				{/if}
			</div>
		</div>

		<div class="previewCol">
			<button
				type="button"
				class="drawerToggleMobile"
				onclick={() => (showPreviewDrawer = true)}
				aria-label={$t('cv.nav.openPreview')}
			>
				{$t('cv.nav.openPreview')}
			</button>

			<button
				type="button"
				class="drawerBackdrop"
				class:open={showPreviewDrawer}
				onclick={() => (showPreviewDrawer = false)}
				aria-label={$t('cv.nav.closePreview')}
			></button>

			<div class="previewSticky" class:drawer-open={showPreviewDrawer}>
				<div class="previewInner" aria-hidden={!showPreviewDrawer}>
					<CVPreview />
				</div>

				<button
					type="button"
					class="drawerClose"
					onclick={() => (showPreviewDrawer = false)}
					aria-label={$t('cv.nav.closePreview')}
				>
					×
				</button>
			</div>
		</div>
	</div>

	<footer class="footer">
		{#if data.footerCreditUrl && data.footerCreditLabel}
			<span>{$t('cv.footer.by')}</span>
			<a href={data.footerCreditUrl} target="_blank" rel="noopener noreferrer">
				{data.footerCreditLabel}
			</a>
			<span class="footerSep" aria-hidden="true">·</span>
		{/if}
		<span>© {new Date().getFullYear()}</span>
		<span class="footerSep" aria-hidden="true">·</span>
		<a href="https://moisesvalero.es" target="_blank" rel="noopener noreferrer">Moisés Valero</a>
		<a
			class="githubLink"
			href="https://github.com/moisesvalero/CV-GENERATOR"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Repositorio en GitHub"
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path
					fill="currentColor"
					d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49v-1.72c-2.78.62-3.37-1.38-3.37-1.38-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.85.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.71 0 0 .84-.28 2.75 1.05A9.28 9.28 0 0 1 12 6.97c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.55 1.4.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.95.68 1.91v2.83c0 .27.18.59.69.49A10.13 10.13 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
				/>
			</svg>
		</a>
	</footer>
</div>

<style>
	.page {
		min-height: 100vh;
		height: auto;
		overflow: visible;
		background: var(--bg-main);
		color: var(--text-main);
		font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
		display: flex;
		flex-direction: column;
	}

	.topbar {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--border-light);
	}

	.topbarInner {
		width: min(1200px, 96%);
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 0;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.brandMark {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: var(--site-primary);
		color: #ffffff;
		font-weight: 800;
		font-size: 14px;
		display: grid;
		place-items: center;
		letter-spacing: 0.02em;
	}

	.brandName {
		font-weight: 750;
		font-size: 1.1rem;
		color: var(--text-main);
	}

	.topbarRight {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.langSwitcher {
		display: inline-flex;
		border: 1px solid var(--border-card);
		border-radius: 8px;
		overflow: hidden;
	}

	.langBtn {
		border: 0;
		background: transparent;
		color: var(--text-secondary);
		font-weight: 600;
		font-size: 0.82rem;
		padding: 6px 14px;
		cursor: pointer;
		transition: background 0.15s ease, color 0.15s ease;
		border-right: 1px solid var(--border-card);
	}

	.langBtn:last-child {
		border-right: 0;
	}

	.langBtn.active {
		background: var(--site-primary);
		color: #ffffff;
	}

	.langBtn:hover:not(.active) {
		background: var(--bg-soft);
	}

	.langBtn:focus-visible {
		outline: 2px solid var(--site-primary);
		outline-offset: -2px;
	}

	.workspace {
		width: min(1200px, 96%);
		margin: 20px auto 0;
		display: grid;
		grid-template-columns: minmax(0, 0.92fr) minmax(520px, 1.08fr);
		gap: 20px;
		align-items: start;
		flex: 1;
	}

	.editorCol {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.progress {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
	}

	.stepPill {
		width: 100%;
		text-align: left;
		background: #ffffff;
		border: 1px solid var(--border-card);
		border-radius: 12px;
		padding: 12px;
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
	}

	.stepPill:hover {
		border-color: var(--site-primary);
		box-shadow: 0 2px 8px color-mix(in srgb, var(--site-primary) 8%, transparent);
	}

	.stepPill.active {
		border-color: var(--site-primary);
		box-shadow: 0 2px 12px color-mix(in srgb, var(--site-primary) 12%, transparent);
	}

	.stepPill.completed {
		border-color: color-mix(in srgb, #10b981 40%, transparent);
	}

	.stepNum {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		display: grid;
		place-items: center;
		background: var(--bg-main);
		color: var(--text-secondary);
		font-weight: 700;
		font-size: 0.85rem;
		flex-shrink: 0;
		transition: background 0.15s ease, color 0.15s ease;
	}

	.stepPill.active .stepNum {
		background: var(--site-primary);
		color: #ffffff;
	}

	.stepPill.completed .stepNum {
		background: #10b981;
		color: #ffffff;
	}

	.stepLabel {
		font-weight: 600;
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.25;
		white-space: normal;
	}

	.stepPill.active .stepLabel {
		color: var(--text-main);
		font-weight: 700;
	}

	.formCard {
		background: #ffffff;
		border: 1px solid var(--border-card);
		border-radius: 14px;
		padding: 1.25rem;
		color: var(--text-main);
		overflow: visible;
	}

	.navRow {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.navBtn {
		border-radius: 12px;
		border: 1px solid var(--border-card);
		background: #ffffff;
		color: var(--text-main);
		padding: 10px 20px;
		font-weight: 600;
		cursor: pointer;
		flex: 1;
		transition: border-color 0.15s ease, background 0.15s ease;
	}

	.navBtn:hover:not(:disabled) {
		border-color: var(--site-primary);
		background: var(--bg-soft);
	}

	.navBtn.primary {
		background: var(--site-primary);
		border-color: var(--site-primary);
		color: #ffffff;
		font-weight: 700;
	}

	.navBtn.primary:hover {
		background: var(--site-accent-text);
		border-color: var(--site-accent-text);
	}

	.navBtn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.navRight {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		width: 100%;
	}

	.previewCol {
		min-width: 0;
	}

	.previewSticky {
		position: sticky;
		top: 80px;
		background: #DDE3E8;
		border-radius: 16px;
		padding: 18px;
		overflow-y: auto;
		max-height: calc(100dvh - 100px);
		box-shadow: inset 0 1px 3px rgba(22, 34, 45, 0.08);
	}

	.previewInner {
		display: flex;
		justify-content: center;
	}

	.drawerToggleMobile {
		display: none;
	}

	.drawerClose {
		display: none;
	}

	.drawerBackdrop {
		display: none;
	}

	.footer {
		width: min(1200px, 96%);
		margin: 20px auto 0;
		padding: 16px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		color: var(--text-secondary);
		font-size: 0.85rem;
		border-top: 1px solid var(--border-light);
	}

	.footer a {
		color: var(--site-primary);
		text-decoration: none;
		font-weight: 600;
	}

	.footer a:hover {
		text-decoration: underline;
	}

	.githubLink {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		color: var(--text-secondary);
	}

	.githubLink:hover {
		background: var(--bg-soft);
		text-decoration: none;
	}

	.githubLink svg {
		width: 18px;
		height: 18px;
	}

	.footerSep {
		margin: 0 6px;
		color: var(--border-light);
	}

	@media (max-width: 1180px) {
		.workspace {
			grid-template-columns: 1fr;
		}

		.previewSticky {
			position: relative;
			top: auto;
		}
	}

	@media (max-width: 768px) {
		.workspace {
			grid-template-columns: 1fr;
		}

		.previewCol {
			order: 2;
		}

		.previewSticky {
			position: fixed;
			left: 12px;
			right: 12px;
			bottom: calc(12px + env(safe-area-inset-bottom, 0px));
			top: auto;
			padding: 12px;
			z-index: 50;
			transform: translate3d(0, 115%, 0);
			opacity: 0;
			transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.24s ease;
			pointer-events: none;
			overflow: hidden;
			max-height: calc(100dvh - 24px);
			background: rgba(255, 255, 255, 0.96);
			border: 1px solid var(--border-card);
			box-shadow: 0 22px 48px rgba(0, 0, 0, 0.16);
			will-change: transform, opacity;
		}

		.previewSticky.drawer-open {
			transform: translate3d(0, 0, 0);
			opacity: 1;
			pointer-events: auto;
		}

		.previewInner {
			transform-origin: top center;
			justify-content: center;
			align-items: flex-start;
			overflow: auto;
			max-height: calc(100dvh - 90px);
			-webkit-overflow-scrolling: touch;
		}

		.drawerBackdrop {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 45;
			background: rgba(15, 23, 42, 0.34);
			backdrop-filter: blur(2px);
			opacity: 0;
			pointer-events: none;
			transition: opacity 0.2s ease;
		}

		.drawerBackdrop.open {
			opacity: 1;
			pointer-events: auto;
		}

		.drawerToggleMobile {
			display: block;
			width: 100%;
			border-radius: 12px;
			border: 1px solid var(--border-card);
			background: var(--site-primary);
			color: #ffffff;
			padding: 12px 14px;
			font-weight: 700;
			cursor: pointer;
		}

		.drawerClose {
			display: block;
			position: absolute;
			top: 8px;
			right: 10px;
			width: 36px;
			height: 36px;
			border-radius: 10px;
			border: 1px solid var(--border-card);
			background: rgba(0, 0, 0, 0.28);
			color: #ffffff;
			font-weight: 700;
			cursor: pointer;
		}

		.progress {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
