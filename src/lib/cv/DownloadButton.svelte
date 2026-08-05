<script lang="ts">
	import { getTranslator, t } from '$lib/i18n';
	import { cvData } from './store.svelte.ts';

	let generating = $state(false);
	let errorMessage = $state<string | null>(null);
	const { label } = $props<{ label?: string }>();

	const safeFileName = $derived(
		String(cvData.nombre || 'CV')
			.trim()
			.replace(/\s+/g, '_')
			.replace(/[^\w-]+/g, '')
	);

	/** A4 at 96dpi: 210mm ≈ 794px, 297mm ≈ 1123px. */
	const PAGE_W = 794;
	const PAGE_H = 1123;
	/** Minimum content height (px) to justify creating a trailing page. */
	const SLICE_MIN = 80;
	const A4_W_MM = 210;
	const A4_H_MM = 297;

	/**
	 * Exports `#cv-preview-render` to an A4 PDF entirely in the browser.
	 * Renders the full content at its natural height and slices it into as many
	 * A4 pages as needed, so long CVs flow into multiple sheets instead of being cut off.
	 */
	async function downloadPdf() {
		if (generating) return;
		errorMessage = null;
		generating = true;

		try {
			if (typeof document === 'undefined') return;

			const el = document.getElementById('cv-preview-render') as HTMLElement | null;
			if (!el) throw new Error(getTranslator()('cv.download.missingElement'));

			const wrap = document.createElement('div');
			wrap.style.position = 'fixed';
			wrap.style.left = '-10000px';
			wrap.style.top = '0';
			wrap.style.width = `${PAGE_W}px`;
			wrap.style.height = 'auto';
			wrap.style.background = '#ffffff';
			wrap.style.pointerEvents = 'none';
			wrap.style.opacity = '0';

			const clone = el.cloneNode(true) as HTMLElement;
			clone.style.transform = 'none';
			clone.style.transformOrigin = 'top left';
			clone.style.width = `${PAGE_W}px`;
			clone.style.height = 'auto';
			clone.style.minHeight = `${PAGE_H}px`;
			clone.style.overflow = 'visible';

			wrap.appendChild(clone);
			document.body.appendChild(wrap);

			const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
				import('html2canvas'),
				import('jspdf')
			]);

			const scale = 2;
			const canvas = await html2canvas(clone, {
				scale,
				useCORS: true,
				allowTaint: true,
				logging: false,
				backgroundColor: '#ffffff'
			} as any);

			const contentPx = canvas.height / scale;
			const fullPages = Math.floor(contentPx / PAGE_H);
			const remainder = contentPx - fullPages * PAGE_H;
			const pageCount = remainder > SLICE_MIN ? fullPages + 1 : Math.max(1, fullPages);

			const pdf = new jsPDF('p', 'mm', 'a4');
			const sliceH = PAGE_H * scale;
			const sliceW = canvas.width;

			for (let i = 0; i < pageCount; i++) {
				const srcY = i * sliceH;
				const srcH = Math.min(sliceH, canvas.height - srcY);

				const slice = document.createElement('canvas');
				slice.width = sliceW;
				slice.height = sliceH;
				const ctx = slice.getContext('2d');
				if (ctx) {
					ctx.fillStyle = '#ffffff';
					ctx.fillRect(0, 0, sliceW, sliceH);
					ctx.drawImage(canvas, 0, srcY, sliceW, srcH, 0, 0, sliceW, srcH);
				}

				if (i > 0) pdf.addPage();
				pdf.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, A4_W_MM, A4_H_MM);
			}

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
			<span class="spinner" aria-hidden="true"></span>
			<span>{$t('cv.download.generating')}</span>
		{:else}
			<span>{label ?? $t('cv.download.defaultLabel')}</span>
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
		border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
		background: linear-gradient(135deg, color-mix(in srgb, var(--site-primary) 12%, transparent), color-mix(in srgb, var(--site-gradient-end) 8%, transparent));
		color: var(--site-accent-text);
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
		background: linear-gradient(135deg, color-mix(in srgb, var(--site-primary) 18%, transparent), color-mix(in srgb, var(--site-gradient-end) 12%, transparent));
		border-color: color-mix(in srgb, var(--site-gradient-end) 30%, transparent);
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
