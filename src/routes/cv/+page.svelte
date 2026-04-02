<script lang="ts">
	import CVPreview from '$lib/cv/CVPreview.svelte';
	import DownloadButton from '$lib/cv/DownloadButton.svelte';
	import FormStep1 from '$lib/cv/FormStep1.svelte';
	import FormStep2 from '$lib/cv/FormStep2.svelte';
	import FormStep3 from '$lib/cv/FormStep3.svelte';
	import FormStep4 from '$lib/cv/FormStep4.svelte';
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
	<title>CV Builder — Crea tu currículum moderno gratis</title>
	<meta
		name="description"
		content="Genera un CV profesional y moderno en minutos. Elige entre 3 estilos, personaliza colores y fuentes, descarga en PDF gratis."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="page">
	<div class="container">
		<div class="progress">
			{#each steps as s}
				<div class="stepPill" aria-current={currentStepNumber === s.n ? 'step' : undefined}>
					<div class="stepNum">{s.n}</div>
					<div class="stepLabel">{s.label}</div>
					<div class="stepBar" class:active={currentStepNumber >= s.n} />
				</div>
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
							<DownloadButton />
						</div>
					{/if}
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
</div>

<style>
	.page {
		min-height: 100vh;
		background: #0f0f0f;
		color: #f5f0e8;
		font-family: 'DM Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
		padding-top: 110px;
	}

	.container {
		width: min(1200px, 96%);
		margin: 0 auto;
	}

	.progress {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
		margin-bottom: 18px;
	}

	.stepPill {
		background: #1a1a1a;
		border: 1px solid rgba(245, 240, 232, 0.12);
		border-radius: 16px;
		padding: 12px 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		position: relative;
		overflow: hidden;
	}

	.stepNum {
		width: 30px;
		height: 30px;
		border-radius: 12px;
		display: grid;
		place-items: center;
		background: rgba(245, 240, 232, 0.08);
		font-weight: 950;
	}

	.stepLabel {
		font-weight: 900;
		font-size: 0.95em;
		opacity: 0.92;
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
		background: rgba(245, 240, 232, 0.45);
	}

	.layout {
		display: grid;
		grid-template-columns: 60% 40%;
		gap: 16px;
		align-items: start;
	}

	.formCol {
		min-width: 0;
	}

	.formCard {
		background: #1a1a1a;
		border: 1px solid rgba(245, 240, 232, 0.12);
		border-radius: 20px;
		padding: 16px;
	}

	.navRow {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-top: 14px;
	}

	.navBtn {
		border-radius: 14px;
		border: 1px solid rgba(245, 240, 232, 0.16);
		background: rgba(245, 240, 232, 0.06);
		color: #f5f0e8;
		padding: 12px 14px;
		font-weight: 950;
		cursor: pointer;
		flex: 1;
	}

	.navBtn.primary {
		background: rgba(245, 240, 232, 0.1);
		border-color: rgba(245, 240, 232, 0.32);
	}

	.navBtn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.navRight {
		flex: 1;
		display: flex;
		justify-content: flex-end;
	}

	.previewCol {
		min-width: 0;
	}

	.previewSticky {
		position: sticky;
		top: 96px;
		background: #1a1a1a;
		border: 1px solid rgba(245, 240, 232, 0.12);
		border-radius: 20px;
		padding: 14px;
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
			border: 1px solid rgba(245, 240, 232, 0.16);
			background: rgba(245, 240, 232, 0.06);
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
			border: 1px solid rgba(245, 240, 232, 0.16);
			background: rgba(0, 0, 0, 0.22);
			color: #f5f0e8;
			font-weight: 950;
			cursor: pointer;
		}
	}
</style>

