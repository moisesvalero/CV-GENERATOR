<script lang="ts">
	import CVPreview from '$lib/cv/CVPreview.svelte';
	import DownloadButton from '$lib/cv/DownloadButton.svelte';
	import FormStep1 from '$lib/cv/FormStep1.svelte';
	import FormStep2 from '$lib/cv/FormStep2.svelte';
	import FormStep3 from '$lib/cv/FormStep3.svelte';
	import FormStep4 from '$lib/cv/FormStep4.svelte';
	import InstallPrompt from '$lib/pwa/InstallPrompt.svelte';
	import { cvData, currentStep, setStep } from '$lib/cv/store.svelte';

	const steps = [
		{ n: 1, label: 'Datos personales' },
		{ n: 2, label: 'Experiencia' },
		{ n: 3, label: 'Educación' },
		{ n: 4, label: 'Habilidades & Estilo' }
	];

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
</script>

<svelte:head>
	<title>CV-generator — Crea tu currículum moderno gratis</title>
	<meta
		name="description"
		content="Genera un CV profesional y moderno en minutos. Elige entre 3 estilos, personaliza colores y fuentes, descarga en PDF gratis."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="page">
	<div class="chrome">
		<InstallPrompt />
		<div class="brandRow">
			<div class="eyebrow">Builder profesional</div>
			<h1>
				<span class="titleTop">CV</span>
				<span class="titleAccent">generator</span>
			</h1>
			<p class="heroCopy">Crea tu currículum moderno, personalízalo en tiempo real y descárgalo en PDF.</p>
			<div class="claimRow" aria-label="Beneficios del producto">
				<span>Preview instantánea</span>
				<span>3 templates premium</span>
				<span>PDF en un clic</span>
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
								<div class="ctaLabel">Listo para exportar</div>
								<div class="ctaTitle">Genera tu PDF final en un clic.</div>
							</div>
						{/if}

						<div class="navRow">
						<button class="navBtn" type="button" onclick={goPrev} disabled={currentStepNumber === 1}>
							Anterior
						</button>

						{#if currentStepNumber < 4}
							<button class="navBtn primary" type="button" onclick={goNext}>
								Siguiente
							</button>
						{:else}
							<div class="navRight">
								<DownloadButton label="Finalizar y generar PDF" />
							</div>
						{/if}
						</div>
					</div>
				</div>

				<div class="previewCol">
					<div class="previewSticky" class:drawer-open={showPreviewDrawer}>
						<button
							type="button"
							class="drawerToggle"
							onclick={() => (showPreviewDrawer = !showPreviewDrawer)}
							aria-label="Ver / ocultar preview"
						>
							{#if showPreviewDrawer} Cerrar preview {:else} Ver preview {/if}
						</button>

						<div class="previewInner" aria-hidden={!showPreviewDrawer}>
							<CVPreview />
						</div>

						<button
							type="button"
							class="drawerClose"
							onclick={() => (showPreviewDrawer = false)}
							aria-label="Cerrar preview"
						>
							×
						</button>
					</div>
				</div>
			</div>
		</div>

		<footer class="footer">
			<span>Desarrollado por</span>
			<a href="https://moisesvalero.es" target="_blank" rel="noopener noreferrer">Moises Valero</a>
			<span>© 2026</span>
		</footer>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		height: auto;
		overflow: visible;
		background:
			radial-gradient(circle at 15% 12%, rgba(249, 115, 22, 0.14), transparent 22%),
			radial-gradient(circle at 85% 8%, rgba(251, 146, 60, 0.1), transparent 24%),
			linear-gradient(180deg, #fffdf9 0%, #f7f3ee 55%, #f2ede7 100%);
		color: #1f2937;
		font-family: 'DM Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
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

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 10px;
		border-radius: 999px;
		background: rgba(249, 115, 22, 0.1);
		border: 1px solid rgba(249, 115, 22, 0.16);
		color: #c2410c;
		font-size: 0.82rem;
		font-weight: 800;
		margin-bottom: 10px;
	}

	.brandRow h1 {
		font-size: clamp(2rem, 4vw, 3.2rem);
		line-height: 1;
		letter-spacing: -0.05em;
		color: #111827;
		margin-bottom: 8px;
	}

	.brandRow p {
		color: #6b7280;
		font-size: 0.98rem;
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
		padding: 7px 10px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(249, 115, 22, 0.12);
		color: #c2410c;
		font-size: 0.84rem;
		font-weight: 800;
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
		background: rgba(255, 255, 255, 0.78);
		backdrop-filter: blur(14px);
		border: 1px solid rgba(249, 115, 22, 0.12);
		border-radius: 16px;
		padding: 12px 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		position: relative;
		overflow: hidden;
		cursor: pointer;
		transition:
			transform 0.15s ease,
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.stepPill:hover {
		transform: translateY(-1px);
		border-color: rgba(249, 115, 22, 0.24);
		box-shadow: 0 12px 24px rgba(249, 115, 22, 0.06);
	}

	.stepPill.active {
		border-color: rgba(251, 146, 60, 0.52);
		box-shadow: 0 16px 30px rgba(249, 115, 22, 0.08);
	}

	.stepNum {
		width: 30px;
		height: 30px;
		border-radius: 12px;
		display: grid;
		place-items: center;
		background: rgba(249, 115, 22, 0.15);
		color: #c2410c;
		font-weight: 950;
	}

	.stepLabel {
		font-weight: 900;
		font-size: 0.95em;
		opacity: 0.92;
		color: #111827;
	}

	.stepBar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3px;
		background: rgba(245, 240, 232, 0.14);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.25s ease;
	}

	.stepBar.active {
		transform: scaleX(1);
		background: linear-gradient(90deg, #f97316, #fb923c);
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
		background: rgba(255, 255, 255, 0.78);
		backdrop-filter: blur(14px);
		border: 1px solid rgba(249, 115, 22, 0.12);
		border-radius: 20px;
		padding: 14px;
		color: #111827;
		overflow: visible;
	}

	.navRow {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-top: 12px;
	}

	.ctaPanel {
		margin-top: 12px;
		padding: 12px;
		border-radius: 18px;
		border: 1px solid rgba(249, 115, 22, 0.12);
		background: rgba(255, 255, 255, 0.72);
		backdrop-filter: blur(14px);
	}

	.ctaPanel.final-step {
		box-shadow: 0 18px 40px rgba(249, 115, 22, 0.08);
	}

	.ctaCopy {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 10px;
	}

	.ctaLabel {
		color: #c2410c;
		font-size: 0.8rem;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.ctaTitle {
		color: #111827;
		font-size: 0.95rem;
		font-weight: 800;
	}

	.navBtn {
		border-radius: 14px;
		border: 1px solid rgba(249, 115, 22, 0.18);
		background: rgba(249, 115, 22, 0.08);
		color: #c2410c;
		padding: 12px 14px;
		font-weight: 950;
		cursor: pointer;
		flex: 1;
	}

	.navBtn.primary {
		background: linear-gradient(135deg, #f97316, #fb923c);
		border-color: rgba(251, 146, 60, 0.52);
		box-shadow: 0 18px 38px rgba(249, 115, 22, 0.18);
		color: #fff;
	}

	.navBtn:disabled {
		opacity: 0.55;
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
		background: rgba(255, 255, 255, 0.78);
		backdrop-filter: blur(14px);
		border: 1px solid rgba(249, 115, 22, 0.12);
		border-radius: 20px;
		padding: 14px;
		overflow: visible;
	}

	.previewInner {
		display: flex;
		justify-content: center;
	}

	.drawerToggle {
		display: none;
	}

	.drawerClose {
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
			bottom: 12px;
			top: auto;
			padding: 12px;
			z-index: 50;
			transform: translateY(120%);
			opacity: 0;
			transition: transform 0.25s ease, opacity 0.25s ease;
			pointer-events: none;
			overflow: hidden;
		}

		.previewSticky.drawer-open {
			transform: translateY(0%);
			opacity: 1;
			pointer-events: auto;
		}

		.previewInner {
			transform-origin: top center;
		}

		.drawerToggle {
			display: block;
			width: 100%;
			margin-top: 12px;
			border-radius: 14px;
			border: 1px solid rgba(249, 115, 22, 0.18);
			background: rgba(249, 115, 22, 0.08);
			color: #f5f0e8;
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
			border: 1px solid rgba(249, 115, 22, 0.18);
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
		outline: 2px solid rgba(249, 115, 22, 0.45);
		outline-offset: 2px;
	}

	.footer {
		width: min(1200px, 96%);
		margin: 14px auto 0;
		padding: 12px 0 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		color: #6b7280;
		font-size: 0.9rem;
		border-top: 1px solid rgba(249, 115, 22, 0.1);
	}

	.footer a {
		color: #c2410c;
		text-decoration: none;
		font-weight: 800;
	}

	.footer a:hover {
		text-decoration: underline;
	}

	.brandRow h1 {
		display: inline-flex;
		align-items: baseline;
		gap: 0.22em;
	}

	.titleTop {
		font-weight: 800;
		letter-spacing: -0.08em;
		color: #111827;
	}

	.titleAccent {
		font-weight: 950;
		letter-spacing: -0.08em;
		color: #c2410c;
		position: relative;
	}

	.titleAccent::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -0.08em;
		height: 0.16em;
		background: linear-gradient(90deg, rgba(249, 115, 22, 0.16), rgba(251, 146, 60, 0.34));
		border-radius: 999px;
		z-index: -1;
	}
</style>

