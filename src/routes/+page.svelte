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

	/** Builds a Google Fonts CSS URL for the two font families selected in the form. */
	function buildGoogleFontsUrl(titlesFont: string, bodyFont: string) {
		const normalizeFamily = (f: string) => encodeURIComponent(f.trim()).replace(/%20/g, '+');
		return `https://fonts.googleapis.com/css2?family=${normalizeFamily(titlesFont)}:wght@400;700&family=${normalizeFamily(bodyFont)}:wght@400;500&display=swap`;
	}

	// Inject or update a <link> so preview + PDF export use the chosen Google Fonts in the live DOM.
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
	<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="page">
	<div class="chrome">
		<InstallPrompt />
		<div class="brandRow">
			<div class="brandTopRow">
				<div class="eyebrow">
					{pickLocalized(data.siteSettings?.eyebrow, $locale) ?? $t('cv.brand.eyebrow')}
				</div>
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
			{#if data.siteSettings?.logoUrl}
				<div class="logoWrap">
					<img
						class="siteLogo"
						src={data.siteSettings.logoUrl}
						alt={data.siteSettings.siteName?.trim() ? data.siteSettings.siteName : ''}
						decoding="async"
						loading="eager"
					/>
				</div>
			{/if}
			<h1>
				<span class="titleTop"
					>{pickLocalized(data.siteSettings?.titleTop, $locale) ?? $t('cv.brand.titleTop')}</span
				>
				<span class="titleAccent"
					>{pickLocalized(data.siteSettings?.titleAccent, $locale) ?? $t('cv.brand.titleAccent')}</span
				>
			</h1>
			<p class="heroCopy">
				{pickLocalized(data.siteSettings?.heroCopy, $locale) ?? $t('cv.brand.heroCopy')}
			</p>
			<div
				class="claimRow"
				aria-label={pickLocalized(data.siteSettings?.benefitsAria, $locale) ??
					$t('cv.brand.benefitsAria')}
			>
				<span>{pickLocalized(data.siteSettings?.claim1, $locale) ?? $t('cv.brand.claim1')}</span>
				<span>{pickLocalized(data.siteSettings?.claim2, $locale) ?? $t('cv.brand.claim2')}</span>
				<span>{pickLocalized(data.siteSettings?.claim3, $locale) ?? $t('cv.brand.claim3')}</span>
			</div>
		</div>

		<div class="container">
			<div class="progress">
				{#each steps as s}
					<button
						type="button"
						class="stepPill"
						class:active={currentStepNumber === s.n}
						aria-current={currentStepNumber === s.n ? 'step' : undefined}
						onclick={() => setStep(s.n)}
					>
						<div class="stepNum">{s.n}</div>
						<div class="stepLabel">{s.label}</div>
						<div class="stepBar" class:active={currentStepNumber >= s.n}></div>
					</button>
				{/each}
			</div>

			<div class="layout">
				<div class="formCol">
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

					<div class="ctaPanel" class:final-step={currentStepNumber === 4}>
						{#if currentStepNumber === 4}
							<div class="ctaCopy">
								<div class="ctaLabel">
									{pickLocalized(data.siteSettings?.ctaReadyLabel, $locale) ??
										$t('cv.cta.readyLabel')}
								</div>
								<div class="ctaTitle">
									{pickLocalized(data.siteSettings?.ctaReadyTitle, $locale) ??
										$t('cv.cta.readyTitle')}
								</div>
							</div>
						{/if}

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
</div>

<style>
	.page {
		min-height: 100vh;
		height: auto;
		overflow: visible;
		background:
			radial-gradient(circle at 15% 10%, color-mix(in srgb, var(--site-primary) 10%, transparent), transparent 24%),
			radial-gradient(circle at 85% 6%, color-mix(in srgb, var(--site-gradient-end) 8%, transparent), transparent 26%),
			linear-gradient(180deg, #fffdf8 0%, #faf4ec 55%, #f3ede5 100%);
		color: var(--text-main);
		font-family: var(--font-ui);
		padding: 16px 0 12px;
		display: flex;
		flex-direction: column;
	}

	.chrome {
		display: flex;
		flex-direction: column;
		height: auto;
		min-height: auto;
	}

	.brandRow {
		width: min(1200px, 96%);
		margin: 0 auto 10px;
		text-align: center;
		padding: 2px 0 0;
	}

	.brandTopRow {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 10px;
	}

	.langSwitcher {
		display: inline-flex;
		gap: 2px;
		padding: 3px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid var(--border-card);
		box-shadow: var(--shadow-sm);
	}

	.langBtn {
		border: 0;
		background: transparent;
		color: var(--text-secondary);
		font-weight: 700;
		font-size: 0.82rem;
		padding: 6px 14px;
		border-radius: 999px;
		cursor: pointer;
		transition: background 0.15s ease, color 0.15s ease;
	}

	.langBtn.active {
		background: var(--btn-bg);
		color: #ffffff;
		box-shadow: 0 1px 3px rgba(28, 25, 23, 0.2);
	}

	.langBtn:hover:not(.active) {
		background: var(--accent-soft);
		color: var(--site-accent-text);
	}

	.langBtn:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--site-primary) 55%, transparent);
		outline-offset: 2px;
	}

	.brandTopRow .eyebrow {
		margin-bottom: 0;
	}

	.logoWrap {
		display: flex;
		justify-content: center;
		margin: 0 auto 14px;
	}

	.siteLogo {
		max-height: 56px;
		max-width: min(280px, 86vw);
		width: auto;
		height: auto;
		object-fit: contain;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--site-primary) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--site-primary) 16%, transparent);
		color: var(--site-accent-text);
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		margin-bottom: 12px;
	}

	.brandRow h1 {
		font-size: clamp(2.2rem, 4.5vw, 3.4rem);
		line-height: 1.04;
		letter-spacing: -0.02em;
		color: var(--text-main);
		margin-bottom: 12px;
	}

	.brandRow p {
		color: var(--text-secondary);
		font-size: 1rem;
		max-width: 720px;
		margin: 0 auto;
	}

	.heroCopy {
		max-width: 620px;
		margin: 0 auto 10px;
	}

	.claimRow {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 10px;
	}

	.claimRow span {
		padding: 7px 12px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.85);
		border: 1px solid var(--border-card);
		color: var(--site-accent-text);
		font-size: 0.84rem;
		font-weight: 700;
	}

	.container {
		width: min(1200px, 96%);
		margin: 0 auto;
		display: block;
	}

	.progress {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
		margin-bottom: 8px;
	}

	.stepPill {
		width: 100%;
		text-align: left;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(14px);
		border: 1px solid var(--border-card);
		border-radius: 14px;
		padding: 12px 14px;
		display: flex;
		align-items: center;
		gap: 12px;
		position: relative;
		overflow: hidden;
		cursor: pointer;
		transition:
			transform 0.15s ease,
			border-color 0.15s ease,
			box-shadow 0.15s ease,
			background 0.15s ease;
	}

	.stepPill:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--site-primary) 32%, transparent);
		box-shadow: var(--shadow-md);
	}

	.stepPill.active {
		border-color: color-mix(in srgb, var(--site-primary) 55%, transparent);
		background: linear-gradient(180deg, #fffaf4, #fff3e6);
		box-shadow: var(--shadow-md);
	}

	.stepNum {
		width: 30px;
		height: 30px;
		border-radius: 9px;
		display: grid;
		place-items: center;
		background: var(--bg-soft);
		color: var(--text-secondary);
		font-weight: 800;
		font-size: 0.9rem;
		flex-shrink: 0;
		transition: background 0.15s ease, color 0.15s ease;
	}

	.stepPill.active .stepNum {
		background: var(--btn-bg);
		color: #ffffff;
	}

	.stepLabel {
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--text-secondary);
		transition: color 0.15s ease;
	}

	.stepPill.active .stepLabel {
		color: var(--text-main);
		font-weight: 800;
	}

	.stepBar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3px;
		background: rgba(245, 240, 232, 0.2);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s ease;
	}

	.stepBar.active {
		transform: scaleX(1);
		background: linear-gradient(90deg, var(--site-primary), var(--site-gradient-end));
	}

	.layout {
		display: grid;
		grid-template-columns: 53% 47%;
		gap: 16px;
		align-items: start;
	}

	.formCol {
		min-width: 0;
		display: block;
	}

	.formCard {
		background: var(--bg-card);
		border: 1px solid var(--border-card);
		border-radius: 16px;
		padding: 18px;
		color: var(--text-main);
		overflow: visible;
		box-shadow: var(--shadow-md);
	}

	.navRow {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-top: 14px;
	}

	.ctaPanel {
		margin-top: 14px;
		padding: 14px;
		border-radius: 14px;
		border: 1px solid var(--border-card);
		background: var(--bg-card);
		box-shadow: var(--shadow-sm);
	}

	.ctaPanel.final-step {
		box-shadow: var(--shadow-md);
	}

	.ctaCopy {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 12px;
	}

	.ctaLabel {
		color: var(--site-accent-text);
		font-size: 0.78rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.ctaTitle {
		color: var(--text-main);
		font-size: 0.95rem;
		font-weight: 700;
	}

	.navBtn {
		border-radius: 12px;
		border: 1px solid var(--border-input);
		background: var(--bg-card);
		color: var(--text-main);
		padding: 12px 20px;
		font-weight: 700;
		cursor: pointer;
		flex: 1;
		transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
	}

	.navBtn:hover:not(:disabled) {
		border-color: color-mix(in srgb, var(--site-primary) 40%, transparent);
		background: var(--bg-soft);
	}

	.navBtn.primary {
		background: var(--btn-bg);
		border-color: var(--btn-bg);
		box-shadow: var(--shadow-md);
		color: #ffffff;
	}

	.navBtn.primary:hover:not(:disabled) {
		background: var(--btn-bg-hover);
		border-color: var(--btn-bg-hover);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
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
		top: 0;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(14px);
		border: 1px solid var(--border-card);
		border-radius: 16px;
		padding: 16px;
		overflow-y: auto;
		max-height: calc(100dvh - 24px);
		box-shadow: var(--shadow-md);
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

	@media (max-width: 768px) {
		.layout {
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
			border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
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
			margin-top: 12px;
			border-radius: 14px;
			border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
			background: color-mix(in srgb, var(--site-primary) 8%, transparent);
			color: var(--site-accent-text);
			padding: 12px 14px;
			font-weight: 950;
			cursor: pointer;
		}

		.drawerClose {
			display: block;
			position: absolute;
			top: 8px;
			right: 10px;
			width: 38px;
			height: 38px;
			border-radius: 14px;
			border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
			background: rgba(0, 0, 0, 0.28);
			color: #f5f0e8;
			font-weight: 950;
			cursor: pointer;
		}

		.ctaPanel {
			padding: 10px;
		}

		.ctaCopy {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	.stepPill:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--site-primary) 45%, transparent);
		outline-offset: 2px;
	}

	.footer {
		width: min(1200px, 96%);
		margin: 20px auto 0;
		padding: 14px 0 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		color: var(--text-muted);
		font-size: 0.88rem;
		border-top: 1px solid var(--border-light);
	}

	.footer a {
		color: var(--site-accent-text);
		text-decoration: none;
		font-weight: 700;
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
		border-radius: 999px;
		color: var(--site-accent-text);
	}

	.githubLink:hover {
		background: color-mix(in srgb, var(--site-primary) 10%, transparent);
		text-decoration: none;
	}

	.githubLink svg {
		width: 18px;
		height: 18px;
	}

	.footerSep {
		margin: 0 6px;
		color: rgba(107, 114, 128, 0.8);
	}

	.brandRow h1 {
		display: inline-flex;
		align-items: baseline;
		gap: 0.22em;
	}

	.titleTop {
		font-weight: 800;
		letter-spacing: 0;
		color: #111827;
	}

	.titleAccent {
		font-weight: 950;
		letter-spacing: 0;
		color: var(--site-accent-text);
		position: relative;
	}

	.titleAccent::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -0.08em;
		height: 0.16em;
		background: linear-gradient(90deg, color-mix(in srgb, var(--site-primary) 16%, transparent), color-mix(in srgb, var(--site-gradient-end) 34%, transparent));
		border-radius: 999px;
		z-index: -1;
	}
</style>

