<script lang="ts">
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
	<div class="banner" role="region" aria-label="Instalar aplicación">
		<div class="copy">
			<div class="title">Instala CV-generator</div>
			<div class="desc">
				{#if deferred}
					En tu móvil, instálalo como app para abrirlo más rápido.
				{:else if isIos}
					En iOS: pulsa <span class="kbd">Compartir</span> y luego <span class="kbd">Añadir a pantalla de inicio</span>.
				{:else}
					En Android: abre el menú del navegador y elige <span class="kbd">Instalar app</span>.
				{/if}
			</div>
		</div>

		<div class="actions">
			{#if deferred}
				<button type="button" class="btn primary" onclick={install}>Instalar</button>
			{/if}
			<button type="button" class="btn" onclick={() => (dismissed = true)}>Ahora no</button>
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
		border: 1px solid rgba(249, 115, 22, 0.18);
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

	.kbd {
		display: inline-flex;
		padding: 2px 8px;
		border-radius: 999px;
		border: 1px solid rgba(249, 115, 22, 0.18);
		background: rgba(249, 115, 22, 0.06);
		color: #c2410c;
		font-weight: 850;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.btn {
		border-radius: 14px;
		border: 1px solid rgba(249, 115, 22, 0.18);
		background: rgba(249, 115, 22, 0.08);
		color: #c2410c;
		padding: 10px 12px;
		font-weight: 900;
		cursor: pointer;
		white-space: nowrap;
	}

	.btn.primary {
		background: linear-gradient(135deg, #f97316, #fb923c);
		border-color: rgba(251, 146, 60, 0.52);
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

