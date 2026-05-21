<script lang="ts">
	import { t } from '$lib/i18n';

	/**
	 * Mobile-only install hint: uses `beforeinstallprompt` on Chromium Android when available,
	 * otherwise shows short platform-specific copy (iOS “Add to Home Screen”, etc.).
	 */
	type BeforeInstallPromptEvent = Event & {
		prompt: () => Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
	};

	let deferred = $state<BeforeInstallPromptEvent | null>(null);
	let dismissed = $state(false);
	let isMobile = $state(false);

	const isClient = typeof window !== 'undefined';
	const isIos = $derived(
		isClient ? /iphone|ipad|ipod/i.test(navigator.userAgent || '') : false
	);
	const isStandalone = $derived(
		isClient
			? ((navigator as unknown as { standalone?: boolean }).standalone === true ||
					(window.matchMedia?.('(display-mode: standalone)')?.matches ?? false))
			: false
	);

	const show = $derived(isClient && isMobile && !dismissed && !isStandalone);

	$effect(() => {
		if (!isClient) return;

		const mq = window.matchMedia?.('(max-width: 768px)');
		const updateMobile = () => {
			isMobile = mq?.matches ?? window.innerWidth <= 768;
		};
		updateMobile();
		mq?.addEventListener?.('change', updateMobile);

		const onBip = (e: Event) => {
			e.preventDefault();
			deferred = e as BeforeInstallPromptEvent;
		};

		window.addEventListener('beforeinstallprompt', onBip);
		return () => {
			window.removeEventListener('beforeinstallprompt', onBip);
			mq?.removeEventListener?.('change', updateMobile);
		};
	});

	async function install() {
		if (!deferred) return;
		await deferred.prompt();
		await deferred.userChoice;
		deferred = null;
		dismissed = true;
	}
</script>

{#if show}
	<div class="banner" role="region" aria-label={$t('cv.pwa.regionAria')}>
		<div class="copy">
			<div class="title">{$t('cv.pwa.title')}</div>
			<div class="desc">
				{#if deferred}
					{$t('cv.pwa.descDeferred')}
				{:else if isIos}
					{$t('cv.pwa.descIosPrefix')} <span class="kbd">{$t('cv.pwa.shareAction')}</span>
					{$t('cv.pwa.descIosMiddle')} <span class="kbd">{$t('cv.pwa.addToHome')}</span>.
				{:else}
					{$t('cv.pwa.descAndroidPrefix')} <span class="kbd">{$t('cv.pwa.installApp')}</span>.
				{/if}
			</div>
		</div>

		<div class="actions">
			{#if deferred}
				<button type="button" class="btn primary" onclick={install}>{$t('cv.pwa.install')}</button>
			{/if}
			<button type="button" class="btn" onclick={() => (dismissed = true)}>{$t('cv.pwa.dismiss')}</button>
		</div>
	</div>
{/if}

<style>
	.banner {
		position: sticky;
		top: 10px;
		z-index: 20;
		width: min(1200px, 96%);
		margin: 0 auto 10px;
		padding: 12px 12px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		border-radius: 18px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
		background: rgba(255, 255, 255, 0.78);
		backdrop-filter: blur(14px);
	}

	/* Hard guard: nunca en escritorio aunque haya glitches de estado/caché */
	@media (min-width: 769px) {
		.banner {
			display: none !important;
		}
	}

	.title {
		font-weight: 950;
		color: #111827;
	}

	.desc {
		margin-top: 4px;
		color: #6b7280;
		font-weight: 650;
		font-size: 0.92rem;
	}

	.desc :global(.kbd) {
		display: inline-flex;
		padding: 2px 8px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
		background: color-mix(in srgb, var(--site-primary) 6%, transparent);
		color: var(--site-accent-text);
		font-weight: 850;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.btn {
		border-radius: 14px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
		background: color-mix(in srgb, var(--site-primary) 8%, transparent);
		color: var(--site-accent-text);
		padding: 10px 12px;
		font-weight: 900;
		cursor: pointer;
		white-space: nowrap;
	}

	.btn.primary {
		background: linear-gradient(135deg, var(--site-primary), var(--site-gradient-end));
		border-color: color-mix(in srgb, var(--site-gradient-end) 52%, transparent);
		color: #fff;
	}

	@media (max-width: 768px) {
		.banner {
			flex-direction: column;
			align-items: stretch;
		}
		.actions {
			justify-content: flex-end;
		}
	}
</style>

