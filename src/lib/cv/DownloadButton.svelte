<script lang="ts">
	import { cvData } from './store.svelte.ts';

	// Se ejecuta solo en cliente (SvelteKit). Esto evita errores en SSR.
	import html2canvas from 'html2canvas';
	import jsPDF from 'jspdf';

	let generating = $state(false);
	let errorMessage = $state<string | null>(null);
	const { label = 'Descargar PDF' } = $props<{ label?: string }>();

	const safeFileName = $derived(
		String(cvData.nombre || 'CV')
			.trim()
			.replace(/\s+/g, '_')
			.replace(/[^\w-]+/g, '')
	);

	async function downloadPdf() {
		if (generating) return;
		errorMessage = null;
		generating = true;

		try {
			if (typeof document === 'undefined') return;

			const el = document.getElementById('cv-preview-render') as HTMLElement | null;
			if (!el) throw new Error('No se encontró el elemento del CV para exportar.');
			// Render oculto: no tocamos la UI (evita “preview grande” y glitches).
			const wrap = document.createElement('div');
			wrap.style.position = 'fixed';
			wrap.style.left = '-10000px';
			wrap.style.top = '0';
			wrap.style.width = '794px';
			wrap.style.height = '1123px';
			wrap.style.overflow = 'hidden';
			wrap.style.background = '#ffffff';
			wrap.style.pointerEvents = 'none';
			wrap.style.opacity = '0';

			const clone = el.cloneNode(true) as HTMLElement;
			clone.style.transform = 'none';
			clone.style.transformOrigin = 'top left';
			clone.style.width = '794px';
			clone.style.height = '1123px';

			wrap.appendChild(clone);
			document.body.appendChild(wrap);

			const canvas = await html2canvas(clone, {
				scale: 2,
				useCORS: true,
				allowTaint: true,
				logging: false,
				backgroundColor: '#ffffff'
			} as any);

			const imgData = canvas.toDataURL('image/png');

			const pdf = new jsPDF('p', 'mm', 'a4');
			pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

			pdf.save(`CV_${safeFileName || 'CV'}.pdf`);
			wrap.remove();
		} catch (err) {
			errorMessage = err instanceof Error ? err.message : String(err);
		} finally {
			generating = false;
		}
	}
</script>

<div class="downloadWrap">
	<button class="downloadBtn" type="button" disabled={generating} onclick={downloadPdf}>
		{#if generating}
			<span class="spinner" aria-hidden="true" />
			<span>Generando PDF...</span>
		{:else}
			<span>{label}</span>
		{/if}
	</button>

	{#if errorMessage}
		<div class="error" role="alert">{errorMessage}</div>
	{/if}
</div>

<style>
	.downloadWrap {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
	}

	.downloadBtn {
		width: 100%;
		border: 1px solid rgba(249, 115, 22, 0.18);
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.12), rgba(251, 146, 60, 0.08));
		color: #c2410c;
		border-radius: 14px;
		min-height: 46px;
		padding: 12px 14px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-weight: 850;
		cursor: pointer;
		transition: transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
	}

	.downloadBtn:hover:not(:disabled) {
		transform: translateY(-1px);
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.18), rgba(251, 146, 60, 0.12));
		border-color: rgba(251, 146, 60, 0.3);
	}

	.downloadBtn:disabled {
		opacity: 0.75;
		cursor: not-allowed;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border-radius: 999px;
		border: 2px solid rgba(194, 65, 12, 0.25);
		border-top-color: rgba(194, 65, 12, 0.95);
		animation: spin 0.9s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.error {
		color: #ffb4b4;
		font-weight: 750;
		font-size: 0.92em;
	}
</style>

